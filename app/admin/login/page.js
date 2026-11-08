
"use client";

import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, Store } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "بيانات الدخول غير صحيحة");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-7 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <Store size={32} />
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Alora
          </h1>

          <p className="text-slate-500 mt-2">
            لوحة تحكم المتجر
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            تسجيل دخول المدير
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            أدخل بياناتك للوصول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              اسم المستخدم
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              كلمة المرور
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="إظهار أو إخفاء كلمة المرور"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 transition flex items-center justify-center gap-2"
          >
            <LockKeyhole size={18} />
            {loading ? "جارٍ تسجيل الدخول..." : "دخول لوحة التحكم"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          © {new Date().getFullYear()} Alora. جميع الحقوق محفوظة.
        </p>
      </div>
    </main>
  );
}
