
import { requireAdmin } from "@/lib/auth";
import { getSql } from "@/lib/db";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Image,
  MessageCircle,
  Store,
  Clock,
  TrendingUp,
  ChevronLeft,
  Menu,
  Users,
  Palette,
  HelpCircle
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

const navigation = [
  {
    title: "الرئيسية",
    items: [
      { label: "نظرة عامة", icon: LayoutDashboard, href: "#overview" }
    ]
  },
  {
    title: "إدارة المتجر",
    items: [
      { label: "المنتجات", icon: Package, href: "#products" },
      { label: "الطلبات", icon: ShoppingBag, href: "#orders" }
    ]
  },
  {
    title: "محتوى الموقع",
    items: [
      { label: "صور المنتج", icon: Image, href: "#images" },
      { label: "الأسئلة الشائعة", icon: HelpCircle, href: "#faqs" }
    ]
  },
  {
    title: "إعدادات النظام",
    items: [
      { label: "إعدادات الموقع", icon: Settings, href: "#settings" }
    ]
  }
];

const sections = [
  {
    id: "products",
    title: "إدارة المنتجات",
    description: "إضافة المنتجات وتعديل بياناتها وأسعارها.",
    icon: Package,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    id: "orders",
    title: "إدارة الطلبات",
    description: "متابعة طلبات العملاء وحالات الطلب.",
    icon: ShoppingBag,
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: "images",
    title: "صور المنتج",
    description: "إدارة معرض الصور والصورة الرئيسية.",
    icon: Image,
    color: "bg-purple-50 text-purple-600"
  },
  {
    id: "faqs",
    title: "الأسئلة الشائعة",
    description: "إضافة وتعديل أسئلة العملاء وإجاباتها.",
    icon: MessageCircle,
    color: "bg-amber-50 text-amber-600"
  },
  {
    id: "settings",
    title: "إعدادات الموقع",
    description: "الهوية والألوان والاسم وبيانات التواصل.",
    icon: Palette,
    color: "bg-emerald-50 text-emerald-600"
  }
];

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

  const statistics = [
    {
      title: "إجمالي المنتجات",
      value: stats.products_count,
      icon: Package,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "إجمالي الطلبات",
      value: stats.orders_count,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "طلبات جديدة",
      value: stats.pending_orders,
      icon: Clock,
      color: "bg-amber-50 text-amber-600"
    }
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Store size={22} />
            </div>
            <div>
              <h1 className="font-black text-lg">Alora</h1>
              <p className="text-xs text-slate-500">لوحة الإدارة</p>
            </div>
          </div>
          <span className="text-xs font-bold text-green-600">متصل</span>
        </div>

        <details className="mt-4">
          <summary className="list-none flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <span className="flex items-center gap-2 font-bold text-sm">
              <Menu size={19} />
              القائمة الرئيسية
            </span>
            <ChevronLeft size={18} />
          </summary>

          <nav className="mt-3 bg-white border border-slate-200 rounded-xl p-3 space-y-4">
            {navigation.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-bold text-slate-400 mb-2 px-2">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Icon size={18} />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            ))}
          </nav>
        </details>
      </header>

      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-l border-slate-200 sticky top-0 h-screen shrink-0">

          <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Alora</h1>
              <p className="text-xs text-slate-400">إدارة المتجر</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
            {navigation.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-black text-slate-400 px-3 mb-3">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === "#overview";

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition ${
                          active
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                        }`}
                      >
                        <Icon size={19} />
                        {item.label}
                        {active && <ChevronLeft size={16} className="mr-auto" />}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="rounded-xl bg-slate-50 p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">المدير</p>
                <p className="text-xs text-slate-400">حساب الإدارة</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 min-w-0">

          {/* Top Bar */}
          <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 px-8 items-center justify-between">
            <div>
              <h2 className="font-black text-lg">لوحة التحكم</h2>
              <p className="text-xs text-slate-400 mt-1">
                إدارة ومتابعة متجرك
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              النظام يعمل
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

            <div id="overview" className="mb-8">
              <p className="text-xs font-black text-indigo-600 mb-2">
                ALORA ADMINISTRATION
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                نظرة عامة
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                أهلاً بك، من هنا يمكنك متابعة وإدارة متجرك.
              </p>
            </div>

            {databaseError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
                تعذر تحميل الإحصائيات. تحقق من اتصال قاعدة البيانات.
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {statistics.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={23} />
                      </div>
                      <TrendingUp size={19} className="text-slate-300" />
                    </div>

                    <p className="text-sm font-bold text-slate-500">
                      {item.title}
                    </p>
                    <p className="text-3xl font-black text-slate-900 mt-2">
                      {Number(item.value || 0).toLocaleString("ar-EG")}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Management Sections */}
            <div className="mb-5">
              <h3 className="text-xl font-black text-slate-900">
                أقسام الإدارة
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                جميع أدوات إدارة المتجر مرتبة في مكان واحد.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <a
                    key={section.id}
                    id={section.id}
                    href={`#${section.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition scroll-mt-6"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.color}`}>
                        <Icon size={23} />
                      </div>
                      <ChevronLeft size={19} className="text-slate-300" />
                    </div>

                    <h4 className="font-black text-slate-900">
                      {section.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 leading-6">
                      {section.description}
                    </p>
                  </a>
                );
              })}
            </div>

            <footer className="text-center text-xs text-slate-400 mt-12 pb-6">
              © {new Date().getFullYear()} Alora. جميع الحقوق محفوظة.
            </footer>

          </div>
        </section>
      </div>
    </main>
  );
}
