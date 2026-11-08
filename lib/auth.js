
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createHmac,
  timingSafeEqual,
} from "crypto";

const COOKIE_NAME = "alora_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must contain at least 32 characters."
    );
  }

  return secret;
}

function sign(value) {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

export async function createAdminSession(adminId) {
  const expires = Date.now() + SESSION_DURATION * 1000;

  const payload = Buffer.from(
    JSON.stringify({
      id: adminId,
      expires,
    })
  ).toString("base64url");

  const signature = sign(payload);
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    `${payload}.${signature}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    }
  );
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);

  if (!session?.value) return null;

  try {
    const [payload, signature] = session.value.split(".");

    if (!payload || !signature) return null;

    const expected = Buffer.from(sign(payload), "hex");
    const received = Buffer.from(signature, "hex");

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      !data.id ||
      !Number.isFinite(data.expires) ||
      data.expires < Date.now()
    ) {
      return null;
    }

    return { id: data.id };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
