import { NextRequest, NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import { Workspace } from "@/types/trustpulse";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    const id = req.nextUrl.searchParams.get("id");
    const userId = req.nextUrl.searchParams.get("userId") || undefined;

    if (slug) {
      let ws: Workspace | undefined = TrustPulseStore.getWorkspaceBySlug(slug);
      if (!ws) {
        try {
          const supabase = getServerSupabaseAdmin();
          if (supabase) {
            const { data } = await supabase
              .from("trustpulse_workspaces")
              .select("*")
              .eq("slug", slug)
              .maybeSingle();

            if (data) {
              ws = {
                id: data.id,
                name: data.name,
                slug: data.slug,
                category: data.category,
                brandColor: data.brand_color,
                googlePlaceId: data.google_place_id,
                googleReviewUrl: data.google_review_url,
                trustpilotUrl: data.trustpilot_url,
                starThreshold: data.star_threshold,
                customHeadline: data.custom_headline,
                customSubheadline: data.custom_subheadline,
                stats: data.stats,
                createdAt: data.created_at,
              };
            }
          }
        } catch (e) {
          console.warn("[TrustPulse] Supabase slug lookup notice:", e);
        }
      }

      if (!ws) {
        return NextResponse.json(
          { success: false, error: "Workspace not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, workspace: ws });
    }

    if (id) {
      let ws: Workspace | undefined = TrustPulseStore.getWorkspaceById(id);
      if (!ws) {
        try {
          const supabase = getServerSupabaseAdmin();
          if (supabase) {
            const { data } = await supabase
              .from("trustpulse_workspaces")
              .select("*")
              .eq("id", id)
              .maybeSingle();

            if (data) {
              ws = {
                id: data.id,
                name: data.name,
                slug: data.slug,
                category: data.category,
                brandColor: data.brand_color,
                googlePlaceId: data.google_place_id,
                googleReviewUrl: data.google_review_url,
                trustpilotUrl: data.trustpilot_url,
                starThreshold: data.star_threshold,
                customHeadline: data.custom_headline,
                customSubheadline: data.custom_subheadline,
                stats: data.stats,
                createdAt: data.created_at,
              };
            }
          }
        } catch (e) {
          console.warn("[TrustPulse] Supabase id lookup notice:", e);
        }
      }

      if (!ws) {
        return NextResponse.json(
          { success: false, error: "Workspace not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, workspace: ws });
    }

    const workspaces = TrustPulseStore.getWorkspaces(userId);
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        let query = supabase
          .from("trustpulse_workspaces")
          .select("*")
          .order("created_at", { ascending: false });

        const isDemo =
          !userId ||
          userId === "demo" ||
          userId === "usr-partner" ||
          userId === "usr-demo-agency";

        if (isDemo) {
          query = query.or(
            "user_id.is.null,user_id.eq.demo,user_id.eq.usr-partner,user_id.eq.usr-demo-agency"
          );
        } else {
          query = query.eq("user_id", userId);
        }

        const { data } = await query;

        if (data && data.length > 0) {
          const seen = new Set(workspaces.map((w) => w.id));
          for (const row of data) {
            if (!seen.has(row.id)) {
              workspaces.push({
                id: row.id,
                userId: row.user_id || "demo",
                name: row.name,
                slug: row.slug,
                category: row.category,
                brandColor: row.brand_color,
                googlePlaceId: row.google_place_id,
                googleReviewUrl: row.google_review_url,
                trustpilotUrl: row.trustpilot_url,
                starThreshold: row.star_threshold,
                customHeadline: row.custom_headline,
                customSubheadline: row.custom_subheadline,
                stats: row.stats,
                createdAt: row.created_at,
              });
              seen.add(row.id);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[TrustPulse] Supabase workspaces list notice:", e);
    }

    return NextResponse.json({ success: true, workspaces });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve workspaces";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      category,
      brandColor,
      googleReviewUrl,
      trustpilotUrl,
      starThreshold,
      customHeadline,
      customSubheadline,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");
    const userId = body.userId || "demo";

    const newWorkspace: Workspace = {
      id: body.id || `ws-${cleanSlug}-${Date.now().toString(36)}`,
      userId: userId,
      name: name.trim(),
      slug: cleanSlug,
      category: category || "Local Business",
      brandColor: brandColor || "#10b981",
      googleReviewUrl: googleReviewUrl || "https://maps.google.com",
      trustpilotUrl: trustpilotUrl || undefined,
      starThreshold: Number(starThreshold) || 4,
      customHeadline: customHeadline || "How was your experience today?",
      customSubheadline: customSubheadline || "Please take 10 seconds to share your feedback.",
      createdAt: new Date().toISOString(),
      stats: {
        averageRating: 5.0,
        totalReviews: 3,
        shieldedReviews: 0,
        positiveRedirects: 3,
      },
    };

    const saved = TrustPulseStore.saveWorkspace(newWorkspace);

    // Sync to Supabase PostgreSQL
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        await supabase.from("trustpulse_workspaces").upsert({
          id: saved.id,
          user_id: saved.userId || "demo",
          name: saved.name,
          slug: saved.slug,
          category: saved.category,
          brand_color: saved.brandColor,
          google_review_url: saved.googleReviewUrl,
          trustpilot_url: saved.trustpilotUrl || null,
          star_threshold: saved.starThreshold,
          custom_headline: saved.customHeadline,
          custom_subheadline: saved.customSubheadline,
          stats: saved.stats,
        });
      }
    } catch (dbErr) {
      console.warn("[TrustPulse] Supabase workspace sync notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Workspace created successfully",
      workspace: saved,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create workspace";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
