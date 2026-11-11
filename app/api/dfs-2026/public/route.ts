import { NextResponse } from "next/server";
import { getPublicDFSData } from "@/lib/dfs-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicDFSData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Announcement details are temporarily unavailable. Please retry." },
      { status: 503 },
    );
  }
}
