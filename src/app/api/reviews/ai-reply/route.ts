import { NextResponse } from "next/server";
import { generateAIReplyOptions } from "@/lib/ai/gemini-responder";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import { ReviewItem } from "@/types/trustpulse";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, reviewData, workspaceId, businessName, businessCategory } = body;

    let review: ReviewItem | undefined = reviewData;

    if (!review && reviewId) {
      // 1. Search in local store
      const allReviews = TrustPulseStore.getReviews(workspaceId);
      review = allReviews.find((r) => r.id === reviewId) || TrustPulseStore.getReviews().find((r) => r.id === reviewId);

      // 2. Fallback to Supabase if not in server memory
      if (!review) {
        try {
          const supabase = getServerSupabaseAdmin();
          if (supabase) {
            const { data } = await supabase
              .from("trustpulse_reviews")
              .select("*")
              .eq("id", reviewId)
              .maybeSingle();

            if (data) {
              review = {
                id: data.id,
                workspaceId: data.workspace_id,
                authorName: data.author_name,
                authorAvatar: data.author_avatar || undefined,
                authorRole: data.author_role || "Customer",
                authorLocation: data.author_location || "",
                rating: data.rating,
                reviewText: data.review_text,
                platform: data.platform,
                sentiment: data.sentiment,
                reviewDate: data.review_date,
                isVerified: data.is_verified,
                isFeatured: data.is_featured,
              };
            }
          }
        } catch (dbErr) {
          console.warn("[TrustPulse] Supabase review lookup notice:", dbErr);
        }
      }
    }

    if (!review && (body.reviewText || body.text)) {
      review = {
        id: reviewId || `rev-${Date.now()}`,
        workspaceId: workspaceId || "ws-general",
        authorName: body.authorName || "Valued Customer",
        rating: body.rating || 5,
        reviewText: body.reviewText || body.text,
        platform: body.platform || "google",
        sentiment: "positive",
        reviewDate: new Date().toISOString(),
        isVerified: true,
        isFeatured: true,
      };
    }

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review details not found." },
        { status: 404 }
      );
    }

    const wsId = workspaceId || review.workspaceId;
    const ws = TrustPulseStore.getWorkspaceById(wsId);
    const resolvedName = businessName || ws?.name || "Our Business";
    const resolvedCategory = businessCategory || ws?.category || "Professional Services";

    const options = await generateAIReplyOptions(
      review,
      resolvedName,
      resolvedCategory
    );

    return NextResponse.json({ success: true, options });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "AI reply generation failed";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
