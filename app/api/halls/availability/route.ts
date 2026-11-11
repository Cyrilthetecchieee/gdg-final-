import { NextResponse } from "next/server";
import { hallLiveEnabled } from "@/lib/hall-availability";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    enabled: hallLiveEnabled({ HALL_LIVE_ENABLED: process.env.HALL_LIVE_ENABLED }),
  });
}
