
import { requireAdmin } from "@/lib/auth";
import { getSql } from "@/lib/db";
import {
  Package,
  ShoppingBag,
  Users,
  Settings,
  LayoutDashboard,
  Image,
  MessageCircle,
  TrendingUp,
  Store,
  Clock,
  ArrowUpLeft
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const sql = getSql();

  const result = await sql`
    SELECT
      (SELECT COUNT(*) FROM products) AS products_count,
      (SELECT COUNT(*) FROM orders) AS orders_count,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS pending_orders
  `;

  return result[0];
}

export default async function AdminDashboard() {
  await requireAdmin();

  let stats = {
    products_count: 0,
    orders_count: 0,
    pending_orders: 0
  };

  let databaseError = false;

  try {
    stats = await getDashboardData();
  } catch (error) {
    console.error("Dashboard error:", error);
    databaseError = true;
  }

  const cards = [
    {
      title: "المنتجات",
      value: stats.products_count,
      icon: Package,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "إجمالي الطلبات",
      value: stats.orders_count,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "طلبات قيد المراجعة",
      value: stats.pending_orders,
      icon: Clock,
      color: "bg-amber-100 text-amber-600"
    }
  ];

  const sections = [
    {
      title: "إدارة المنتجات",
      description: "عرض وإدارة منتجات المتجر",
      icon: Package,
      href: "/admin/products"
    },
    {
      title: "إدارة الطلبات",
      description: "متابعة طلبات العملاء",
      icon: ShoppingBag,
      href: "/admin/orders"
    },
    {
      title: "إعدادات الموقع",
      description: "الاسم والشعار والألوان وبيانات المتجر",
      icon: Settings,
      href: "/admin/settings"
    },
    {
      title: "صور الموقع",
      description: "إدارة صور وعرض المنتج",
      icon: Image,
      href: "/admin/images"
    },
    {
      title: "الأسئلة الشائعة",
      description: "إدارة الأسئلة والإجابات",
      icon: MessageCircle,
      href: "/admin/faqs"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100" dir="rtl">

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
              <Store size={25} />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900">
                Alora
              </h1>
              <p className="text-xs text-slate-500">
                لوحة تحكم المدير
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            النظام متصل
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <p className="text-sm text-indigo-600 font-bold mb-2">
            ADMINISTRATION
          </p>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            مرحباً بك في لوحة التحكم
          </h2>

          <p className="text-slate-500 mt-2">
            تابع متجرك وأدر المنتجات والطلبات من مكان واحد.
          </p>
        </div>

        {databaseError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            تعذر تحميل بعض الإحصائيات. تحقق من اتصال قاعدة البيانات.
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon size={24} />
                  </div>

                  <TrendingUp className="text-slate-300" size={20} />
                </div>

                <p className="text-sm text-slate-500 font-bold">
                  {card.title}
                </p>

                <p className="text-3xl font-black text-slate-900 mt-2">
                  {Number(card.value || 0).toLocaleString("ar-EG")}
                </p>
              </div>
            );
          })}
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                إدارة المتجر
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                الوصول السريع لأقسام الإدارة
              </p>
            </div>

            <LayoutDashboard className="text-indigo-600" size={25} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <a
                  key={section.title}
                  href={section.href}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon size={23} />
                    </div>

                    <ArrowUpLeft
                      size={20}
                      className="text-slate-400 group-hover:text-indigo-600"
                    />
                  </div>

                  <h4 className="font-black text-slate-900">
                    {section.title}
                  </h4>

                  <p className="text-sm text-slate-500 mt-2">
                    {section.description}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <footer className="text-center text-xs text-slate-400 mt-12 pb-6">
          © {new Date().getFullYear()} Alora. جميع الحقوق محفوظة.
        </footer>

      </div>
    </main>
  );
    }
          
