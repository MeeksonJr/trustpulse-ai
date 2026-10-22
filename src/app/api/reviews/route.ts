import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || undefined;
  const reviews = TrustPulseStore.getReviews(workspaceId);
  return NextResponse.json({ success: true, reviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.workspaceId || !body.authorName || !body.rating || !body.reviewText) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = TrustPulseStore.addReview({
      workspaceId: body.workspaceId,
      authorName: body.authorName,
      authorRole: body.authorRole || "Customer",
      authorLocation: body.authorLocation || "",
      rating: Number(body.rating),
      reviewText: body.reviewText,
      platform: body.platform || "direct",
      sentiment: body.rating >= 4 ? "positive" : body.rating === 3 ? "neutral" : "negative",
      isVerified: true,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : true,
    });

    // Sync to Supabase in background
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        await supabase.from("trustpulse_reviews").insert({
          id: newReview.id,
          workspace_id: newReview.workspaceId,
          author_name: newReview.authorName,
          author_avatar: newReview.authorAvatar || null,
          author_role: newReview.authorRole,
          author_location: newReview.authorLocation || "",
          rating: newReview.rating,
          review_text: newReview.reviewText,
          platform: newReview.platform,
          sentiment: newReview.sentiment,
          review_date: newReview.reviewDate,
          is_verified: newReview.isVerified,
          is_featured: newReview.isFeatured,
        });
      }
    } catch (dbErr) {
      console.warn("[TrustPulse] Supabase review sync notice:", dbErr);
    }

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
