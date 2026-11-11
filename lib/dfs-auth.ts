import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "dfs_admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Default password fallback for initial dev setup (overridden by env variable)
const DEFAULT_PASSCODE = "gdg-madurai-dfs-2026";

function getAdminSecret(): string {
  return (
    process.env.DFS_SESSION_SECRET ||
    process.env.ADMIN_SECRET ||
    process.env.AUTH_SECRET ||
    "devfest-madurai-dfs-2026-super-secret-key-32b"
  );
}

function getExpectedPassword(): string {
  return process.env.DFS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || DEFAULT_PASSCODE;
}

/**
 * Timing-safe password verification
 */
export function verifyAdminPassword(input: string): boolean {
  if (!input || typeof input !== "string") return false;

  const expected = getExpectedPassword();
  const inputBuffer = crypto.createHash("sha256").update(input.trim()).digest();
  const expectedBuffer = crypto.createHash("sha256").update(expected.trim()).digest();

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

interface SessionPayload {
  role: "admin";
  issuedAt: number;
  expiresAt: number;
  adminId: string;
}

/**
 * Creates a signed session token.
 */
export function createSessionToken(adminId = "admin"): string {
  const secret = getAdminSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    role: "admin",
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_SECONDS,
    adminId,
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payloadString).digest("base64url");

  return `${payloadString}.${signature}`;
}

/**
 * Validates a signed session token.
 */
export function verifySessionToken(token?: string): { valid: boolean; adminId?: string } {
  if (!token || typeof token !== "string") return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };

  const [payloadString, signature] = parts;
  const secret = getAdminSecret();

  const expectedSig = crypto.createHmac("sha256", secret).update(payloadString).digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadString, "base64url").toString("utf-8")) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.role !== "admin" || payload.expiresAt < now) {
      return { valid: false };
    }

    return { valid: true, adminId: payload.adminId };
  } catch {
    return { valid: false };
  }
}

/**
 * Server-side helper to check if current request has a valid admin session.
 */
export async function checkAdminSessionFromCookies(): Promise<{ authenticated: boolean; adminId?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const result = verifySessionToken(token);
    return { authenticated: result.valid, adminId: result.adminId };
  } catch {
    return { authenticated: false };
  }
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS };
