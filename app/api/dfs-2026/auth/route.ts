import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminPassword,
  createSessionToken,
  checkAdminSessionFromCookies,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/dfs-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await checkAdminSessionFromCookies();
  return NextResponse.json({ authenticated: session.authenticated, adminId: session.adminId || null });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { password?: string };
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Passcode is required." }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid administrator passcode." }, { status: 401 });
    }

    const token = createSessionToken("admin-gdg-madurai");
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });

    return NextResponse.json({ ok: true, message: "Authentication successful." });
  } catch {
    return NextResponse.json({ error: "Authentication service error." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return NextResponse.json({ ok: true, message: "Signed out successfully." });
  } catch {
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
