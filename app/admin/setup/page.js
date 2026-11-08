
"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminSetup() {
  const [setupKey, setSetupKey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (password.length < 12) {
      setError("كلمة المرور يجب ألا تقل عن 12 حرفًا");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setupKey,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تعذر إنشاء الحساب");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-7 sm:p-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Alora
          </h1>

          <p className="text-slate-500 mt-2">
            إعداد حساب المدير الأول
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 rounded-xl p-4 mb-5">
              تم إنشاء حساب المدير بنجاح.
            </div>

            <a
              href="/admin/login"
              className="block w-full rounded-xl bg-indigo-600 text-white font-bold py-3"
            >
              الانتقال لتسجيل الدخول
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-bold text-sm mb-2">
                مفتاح الإعداد السري
              </label>

              <input
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                required
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="أدخل مفتاح الإعداد"
              />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2">
                اسم المستخدم
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={40}
                pattern="[a-zA-Z0-9_.-]+"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="مثال: aloraadmin"
              />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2">
                كلمة المرور
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={12}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 outline-none focus:border-indigo-500"
                  placeholder="12 حرفًا على الأقل"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2">
                تأكيد كلمة المرور
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="أعد كتابة كلمة المرور"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5"
            >
              {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب المدير"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
