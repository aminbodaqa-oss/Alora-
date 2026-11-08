
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("alora_admin_session");

  if (!session?.value) {
    return null;
  }

  try {
    const decoded = Buffer.from(
      session.value,
      "base64"
    ).toString("utf8");

    const data = JSON.parse(decoded);

    if (
      !data.id ||
      !data.expires ||
      data.expires < Date.now() ||
      !process.env.ADMIN_SESSION_SECRET ||
      data.secret !== process.env.ADMIN_SESSION_SECRET
    ) {
      return null;
    }

    return { id: data.id };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
