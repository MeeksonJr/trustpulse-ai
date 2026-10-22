import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import { WidgetConfig, ReviewItem, Workspace } from "@/types/trustpulse";

export async function GET(
  request: Request,
  props: { params: Promise<{ widgetId: string }> }
) {
  const params = await props.params;
  const widgetId = params.widgetId;

  let widget: WidgetConfig | undefined = TrustPulseStore.getWidgetConfigById(widgetId);

  // Cloud fallback: query Supabase if not found in memory (crucial for serverless cold-starts)
  if (!widget) {
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        const { data } = await supabase
          .from("trustpulse_widgets")
          .select("*")
          .eq("id", widgetId)
          .maybeSingle();

        if (data) {
          widget = {
            id: data.id,
            workspaceId: data.workspace_id,
            type: data.type,
            theme: data.theme,
            title: data.title,
            position: data.position,
            minRating: data.min_rating,
            maxReviews: data.max_reviews,
            loopIntervalSeconds: data.loop_interval_seconds,
            showPlatformBadge: data.show_platform_badge,
            showVerifiedCheck: data.show_verified_check,
            showDate: data.show_date,
            customAccentColor: data.custom_accent_color,
          };
        }
      }
    } catch (e) {
      console.warn("[TrustPulse] Supabase widget lookup notice:", e);
    }
  }

  if (!widget) {
    return NextResponse.json(
      { success: false, error: "Widget not found" },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    );
  }

  let allReviews: ReviewItem[] = TrustPulseStore.getReviews(widget.workspaceId);

  // Cloud fallback: query Supabase if reviews not populated in local memory
  if (allReviews.length === 0) {
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        const { data: supaReviews } = await supabase
          .from("trustpulse_reviews")
          .select("*")
          .eq("workspace_id", widget.workspaceId)
          .order("rating", { ascending: false });

        if (supaReviews && supaReviews.length > 0) {
          allReviews = supaReviews.map((r) => ({
            id: r.id,
            workspaceId: r.workspace_id,
            authorName: r.author_name,
            authorAvatar: r.author_avatar || undefined,
            authorRole: r.author_role || "Verified Client",
            authorLocation: r.author_location || "",
            rating: r.rating,
            reviewText: r.review_text,
            platform: r.platform,
            sentiment: r.sentiment,
            reviewDate: r.review_date,
            isVerified: r.is_verified,
            isFeatured: r.is_featured,
          }));
        }
      }
    } catch (e) {
      console.warn("[TrustPulse] Supabase reviews lookup notice:", e);
    }
  }

  const eligibleReviews = allReviews
    .filter((r) => r.rating >= widget.minRating)
    .slice(0, widget.maxReviews);

  let workspace: Workspace | undefined = TrustPulseStore.getWorkspaceById(widget.workspaceId);

  // Cloud fallback: query Supabase for workspace info if missing in memory
  if (!workspace) {
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        const { data: wsData } = await supabase
          .from("trustpulse_workspaces")
          .select("*")
          .eq("id", widget.workspaceId)
          .maybeSingle();

        if (wsData) {
          workspace = {
            id: wsData.id,
            name: wsData.name,
            slug: wsData.slug,
            category: wsData.category,
            brandColor: wsData.brand_color,
            googlePlaceId: wsData.google_place_id,
            googleReviewUrl: wsData.google_review_url,
            trustpilotUrl: wsData.trustpilot_url,
            starThreshold: wsData.star_threshold,
            customHeadline: wsData.custom_headline,
            customSubheadline: wsData.custom_subheadline,
            stats: wsData.stats,
            createdAt: wsData.created_at,
          };
        }
      }
    } catch (e) {
      console.warn("[TrustPulse] Supabase workspace lookup notice:", e);
    }
  }

  return NextResponse.json(
    {
      success: true,
      widget,
      workspace: workspace
        ? {
            name: workspace.name,
            brandColor: workspace.brandColor,
            stats: workspace.stats,
          }
        : null,
      reviews: eligibleReviews,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
