import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const AUTH_NONCE_COOKIE = "microdog_auth_nonce";
const AUTH_SESSION_COOKIE = "microdog_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const NONCE_TTL_SECONDS = 60 * 10;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createAuthNonce() {
  return randomBytes(16).toString("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function setAuthNonceCookie(nonce: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_NONCE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: NONCE_TTL_SECONDS,
  });
}

export async function getAuthNonceCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_NONCE_COOKIE)?.value ?? null;
}

export async function clearAuthNonceCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_NONCE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function buildWalletLoginMessage(address: string, nonce: string) {
  const normalizedAddress = address.toLowerCase();
  const issuedAt = new Date().toISOString();

  return [
    "MicroDOG Wallet Login",
    "",
    `Address: ${normalizedAddress}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
    "",
    "Sign this message to log in to MicroDOG.",
  ].join("\n");
}

export async function findSessionUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = sha256(rawToken);
  const session = await prisma.authSession.findUnique({
    where: { token: tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    await clearSessionCookie();
    return null;
  }

  return session.user;
}

export async function persistUserSession(userId: string, walletAddress: string) {
  const rawToken = createSessionToken();
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.authSession.create({
    data: {
      userId,
      token: tokenHash,
      walletAddress: walletAddress.toLowerCase(),
      expiresAt,
    },
  });

  await setSessionCookie(rawToken);

  return {
    expiresAt: expiresAt.toISOString(),
  };
}
