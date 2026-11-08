
import { NextResponse } from "next/server";
import { promisify } from "util";
import { scrypt, timingSafeEqual } from "crypto";
import { getSql } from "@/lib/db";
import { createAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const scryptAsync = promisify(scrypt);

async function verifyPassword(password, storedHash) {
  try {
    const [algorithm, salt, hash] = storedHash.split("$");

    if (
      algorithm !== "scrypt" ||
      !salt ||
      !hash ||
      !/^[a-f0-9]{128}$/i.test(hash)
    ) {
      return false;
    }

    const derivedKey = await scryptAsync(password, salt, 64);
    const storedKey = Buffer.from(hash, "hex");

    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (
      !username ||
      !password ||
      username.length > 100 ||
      password.length > 200
    ) {
      return NextResponse.json(
        { message: "أدخل اسم المستخدم وكلمة المرور" },
        { status: 400 }
      );
    }

    const sql = getSql();

    const admins = await sql`
      SELECT id, password_hash
      FROM admins
      WHERE username = ${username}
      LIMIT 1
    `;

    if (
      !admins.length ||
      !(await verifyPassword(password, admins[0].password_hash))
    ) {
      return NextResponse.json(
        { message: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await createAdminSession(admins[0].id);

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { message: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
