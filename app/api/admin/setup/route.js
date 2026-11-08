
import { NextResponse } from "next/server";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

const scryptAsync = promisify(scrypt);

export async function POST(request) {
  try {
    const setupSecret = process.env.ADMIN_SETUP_KEY;

    if (!setupSecret || setupSecret.length < 32) {
      return NextResponse.json(
        { message: "إعداد إنشاء المدير غير مكتمل على السيرفر" },
        { status: 503 }
      );
    }

    const body = await request.json();

    const suppliedKey = String(body.setupKey || "");
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    const expected = Buffer.from(setupSecret);
    const received = Buffer.from(suppliedKey);

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return NextResponse.json(
        { message: "مفتاح الإعداد غير صحيح" },
        { status: 403 }
      );
    }

    if (!/^[a-zA-Z0-9_.-]{3,40}$/.test(username)) {
      return NextResponse.json(
        { message: "اسم المستخدم يجب أن يكون من 3 إلى 40 حرفًا إنجليزيًا أو رقمًا" },
        { status: 400 }
      );
    }

    if (password.length < 12 || password.length > 200) {
      return NextResponse.json(
        { message: "كلمة المرور يجب أن تكون 12 حرفًا على الأقل" },
        { status: 400 }
      );
    }

    const sql = getSql();

    const existingAdmins = await sql`
      SELECT id FROM admins LIMIT 1
    `;

    if (existingAdmins.length > 0) {
      return NextResponse.json(
        { message: "تم إنشاء حساب مدير بالفعل. إنشاء الحساب الأول مغلق." },
        { status: 409 }
      );
    }

    const salt = randomBytes(16).toString("hex");
    const derivedKey = await scryptAsync(password, salt, 64);
    const passwordHash =
      `scrypt$${salt}$${Buffer.from(derivedKey).toString("hex")}`;

    const result = await sql`
      INSERT INTO admins (username, password_hash)
      VALUES (${username}, ${passwordHash})
      ON CONFLICT (username) DO NOTHING
      RETURNING id
    `;

    if (!result.length) {
      return NextResponse.json(
        { message: "اسم المستخدم مستخدم بالفعل" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم إنشاء حساب المدير بنجاح. يمكنك تسجيل الدخول الآن.",
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    return NextResponse.json(
      { message: "تعذر إنشاء حساب المدير" },
      { status: 500 }
    );
  }
}
