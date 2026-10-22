import { NextRequest, NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import { FeedbackStatus, PrivateFeedback } from "@/types/trustpulse";

export async function GET(req: NextRequest) {
  try {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId") || undefined;
    let feedback: PrivateFeedback[] = TrustPulseStore.getPrivateFeedback(workspaceId);

    // Cloud fallback: If local memory has no grievances for this workspace, fetch from Supabase
    if (feedback.length === 0) {
      try {
        const supabase = getServerSupabaseAdmin();
        if (supabase) {
          let query = supabase
            .from("trustpulse_grievances")
            .select("*")
            .order("created_at", { ascending: false });

          if (workspaceId) {
            query = query.eq("workspace_id", workspaceId);
          }

          const { data } = await query;
          if (data && data.length > 0) {
            feedback = data.map((g) => ({
              id: g.id,
              workspaceId: g.workspace_id,
              campaignId: g.campaign_id || undefined,
              rating: g.rating,
              customerName: g.customer_name,
              customerEmail: g.customer_email,
              customerPhone: g.customer_phone || "",
              grievanceText: g.grievance_text,
              status: g.status as FeedbackStatus,
              resolutionNotes: g.resolution_notes || undefined,
              createdAt: g.created_at,
              resolvedAt: g.resolved_at || undefined,
            }));
          }
        }
      } catch (e) {
        console.warn("[TrustPulse] Supabase grievances fetch notice:", e);
      }
    }

    return NextResponse.json({ success: true, feedback });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve feedback";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, resolutionNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Feedback ID and status are required" },
        { status: 400 }
      );
    }

    const updated = TrustPulseStore.updatePrivateFeedback(
      id,
      status as FeedbackStatus,
      resolutionNotes
    );

    // Sync status update to Supabase
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        await supabase
          .from("trustpulse_grievances")
          .update({
            status,
            resolution_notes: resolutionNotes || null,
            resolved_at: status === "resolved" ? new Date().toISOString() : null,
          })
          .eq("id", id);
      }
    } catch (e) {
      console.warn("[TrustPulse] Supabase grievance patch notice:", e);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
      feedback: updated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update feedback";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
