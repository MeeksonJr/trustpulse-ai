import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import type { GooglePlaceResult } from "@/lib/places/google-maps";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result: GooglePlaceResult = body.business;

    if (!result || !result.name || !result.slug) {
      return NextResponse.json(
        { success: false, error: "Invalid business data provided." },
        { status: 400 }
      );
    }

    const { workspace, reviews, widgets } = TrustPulseStore.registerGoogleClient(result);

    // Sync to Supabase PostgreSQL in background
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        await supabase.from("trustpulse_workspaces").upsert({
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          category: workspace.category,
          brand_color: workspace.brandColor,
          google_place_id: workspace.googlePlaceId || null,
          google_review_url: workspace.googleReviewUrl,
          star_threshold: workspace.starThreshold,
          custom_headline: workspace.customHeadline,
          custom_subheadline: workspace.customSubheadline,
          stats: workspace.stats,
        });

        if (reviews.length > 0) {
          await supabase.from("trustpulse_reviews").upsert(
            reviews.map((r) => ({
              id: r.id,
              workspace_id: workspace.id,
              author_name: r.authorName,
              author_avatar: r.authorAvatar,
              author_role: r.authorRole,
              author_location: r.authorLocation,
              rating: r.rating,
              review_text: r.reviewText,
              platform: r.platform,
              sentiment: r.sentiment,
              review_date: r.reviewDate,
              is_verified: r.isVerified,
              is_featured: r.isFeatured,
            }))
          );
        }

        if (widgets.length > 0) {
          await supabase.from("trustpulse_widgets").upsert(
            widgets.map((w) => ({
              id: w.id,
              workspace_id: workspace.id,
              type: w.type,
              theme: w.theme,
              title: w.title,
              position: w.position,
              min_rating: w.minRating,
              max_reviews: w.maxReviews,
              loop_interval_seconds: w.loopIntervalSeconds,
              show_platform_badge: w.showPlatformBadge,
              show_verified_check: w.showVerifiedCheck,
              show_date: w.showDate,
              custom_accent_color: w.customAccentColor,
            }))
          );
        }
      }
    } catch (dbErr) {
      console.warn("[TrustPulse] Supabase background sync notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Client workspace for "${workspace.name}" created with live QR funnel and embed widgets.`,
      workspace,
      reviews,
      reviewCount: reviews.length,
      widgetsGenerated: widgets.map((w) => w.id),
      funnelUrl: `/r/${workspace.slug}`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
