import { NextResponse } from "next/server";
import { checkAdminSessionFromCookies } from "@/lib/dfs-auth";
import {
  getDFSStoreData,
  saveDFSDraft,
  publishDFSSelection,
  unpublishDFSSelection,
  validateParticipantsForPublish,
  type DFSParticipant,
} from "@/lib/dfs-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await checkAdminSessionFromCookies();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
  }

  try {
    const data = await getDFSStoreData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to retrieve participant records." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await checkAdminSessionFromCookies();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      participants?: DFSParticipant[];
    };
    const { action, participants } = body;
    const adminId = session.adminId || "admin-gdg-madurai";

    if (action === "save-draft") {
      if (!Array.isArray(participants)) {
        return NextResponse.json({ error: "Participants array is required." }, { status: 400 });
      }

      const draft = await saveDFSDraft(participants, adminId);
      return NextResponse.json({
        ok: true,
        message: "Draft saved successfully.",
        draft,
      });
    }

    if (action === "publish") {
      if (Array.isArray(participants)) {
        const validation = validateParticipantsForPublish(participants);
        if (!validation.valid) {
          return NextResponse.json(
            { error: "Cannot publish: " + validation.errors.join(" ") },
            { status: 400 },
          );
        }
        await saveDFSDraft(participants, adminId);
      }

      const published = await publishDFSSelection(adminId);
      return NextResponse.json({
        ok: true,
        message: "Selection officially published to the public announcement page.",
        published,
      });
    }

    if (action === "unpublish") {
      const published = await unpublishDFSSelection(adminId);
      return NextResponse.json({
        ok: true,
        message: "Announcement unpublished. Public page reverted to pending state.",
        published,
      });
    }

    return NextResponse.json({ error: "Unknown management action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Operation failed. Please retry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
