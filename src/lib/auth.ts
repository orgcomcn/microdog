import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const AUTH_NONCE_COOKIE = "microdog_auth_nonce";
const AUTH_SESSION_COOKIE = "microdog_session";
const AUTH_REFERRAL_COOKIE = "microdog_referral_code";
const ADMIN_SESSION_COOKIE = "microdog_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const NONCE_TTL_SECONDS = 60 * 10;
const REFERRAL_TTL_SECONDS = 60 * 60 * 24 * 30;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createAuthNonce() {
  return randomBytes(16).toString("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

function buildCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function setAuthNonceCookie(nonce: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_NONCE_COOKIE, nonce, buildCookieOptions(NONCE_TTL_SECONDS));
}

export async function getAuthNonceCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_NONCE_COOKIE)?.value ?? null;
}

export async function setReferralCookie(referralCode: string) {
  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_REFERRAL_COOKIE,
    normalizeReferralCode(referralCode),
    buildCookieOptions(REFERRAL_TTL_SECONDS),
  );
}

export async function getReferralCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_REFERRAL_COOKIE)?.value ?? null;
}

export async function clearAuthNonceCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_NONCE_COOKIE, "", buildCookieOptions(0));
}

export async function clearReferralCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_REFERRAL_COOKIE, "", buildCookieOptions(0));
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, token, buildCookieOptions(SESSION_TTL_MS / 1000));
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, "", buildCookieOptions(0));
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, buildCookieOptions(ADMIN_SESSION_TTL_MS / 1000));
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", buildCookieOptions(0));
}

type FindSessionOptions = {
  clearInvalidCookie?: boolean;
};

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

export async function findSessionUser(options?: FindSessionOptions) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = sha256(rawToken);
  const session = await prisma.authSession.findUnique({
    where: { token: tokenHash },
    include: {
      user: {
        include: {
          invitedBy: {
            select: {
              uid: true,
              walletAddress: true,
            },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (options?.clearInvalidCookie) {
      await clearSessionCookie();
    }

    return null;
  }

  if (session.user.status === "FROZEN") {
    if (options?.clearInvalidCookie) {
      await clearSessionCookie();
    }

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

export async function persistAdminSession(username: string) {
  const rawToken = createSessionToken();
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: {
      username,
      token: tokenHash,
      expiresAt,
    },
  });

  await setAdminSessionCookie(rawToken);

  return {
    username,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function findAdminSession(options?: FindSessionOptions) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = sha256(rawToken);
  const session = await prisma.adminSession.findUnique({
    where: { token: tokenHash },
  });

  if (!session || session.expiresAt < new Date()) {
    if (options?.clearInvalidCookie) {
      await clearAdminSessionCookie();
    }

    return null;
  }

  await prisma.adminSession.update({
    where: { id: session.id },
    data: {
      lastSeenAt: new Date(),
    },
  });

  return session;
}

export function normalizeReferralCode(value: string) {
  return value.trim().toUpperCase();
}
