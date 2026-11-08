
"use client";

import { useState, useEffect } from "react";

const PRODUCT = {
  name: "منتجك المميز",
  description:
    "اكتشف تجربة مختلفة مع منتجنا المميز. جودة رائعة وتصميم أنيق واهتمام بأدق التفاصيل.",
  oldPrice: 1200,
  price: 799,
  discount: 33,
  images: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900"
  ]
};

const FAQS = [
  {
    q: "ما هي طريقة الطلب؟",
    a: "اضغط على اطلب دلوقتي واملأ بياناتك، وسيتم إرسال تفاصيل طلبك إلينا عبر واتساب."
  },
  {
    q: "كم تكلفة الشحن؟",
    a: "يتم تحديد تكلفة الشحن حسب المحافظة والعنوان."
  },
  {
    q: "ما مدة توصيل الطلب؟",
    a: "تختلف مدة التوصيل حسب المحافظة، وسيتم تأكيد الموعد معك."
  },
  {
    q: "هل يمكن الدفع عند الاستلام؟",
    a: "يمكنك الاستفسار عن طرق الدفع المتاحة أثناء تأكيد الطلب."
  },
  {
    q: "هل يوجد استبدال واسترجاع؟",
    a: "يمكنك طلب الاستبدال أو الاسترجاع وفقًا لسياسة المتجر."
  },
  {
    q: "هل سيتم تأكيد الطلب؟",
    a: "نعم، سيتم التواصل معك لتأكيد بيانات الطلب قبل الشحن."
  }
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // موعد انتهاء العرض التجريبي
  const OFFER_END = new Date("2026-12-01T23:59:59+02:00").getTime();

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(
        0,
        OFFER_END - Date.now()
      );

      setTime({
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const total = PRODUCT.price * quantity;

  const handleOrder = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      alert("من فضلك أكمل جميع البيانات");
      return;
    }

    // استبدل الرقم برقم واتساب المتجر
    const whatsappNumber = "201000000000";

    const message = `
طلب جديد من متجر Alora

المنتج: ${PRODUCT.name}
السعر: ${PRODUCT.price} جنيه
الكمية: ${quantity}
الإجمالي: ${total} جنيه

اسم العميل: ${form.name}
رقم الهاتف: ${form.phone}
العنوان: ${form.address}
`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="container-main flex items-center justify-between py-5">
          <h1 className="text-3xl font-black tracking-wide text-indigo-600">
            Alora
          </h1>

          <a
            href="#order"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            اطلب الآن
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="container-main grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">

        {/* GALLERY */}
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-slate-100">
            <img
              src={PRODUCT.images[selectedImage]}
              alt={PRODUCT.name}
              className="h-[360px] w-full object-cover md:h-[480px]"
            />

            <span className="absolute right-4 top-4 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
              خصم {PRODUCT.discount}%
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {PRODUCT.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-xl border-2 ${
                  selectedImage === index
                    ? "border-indigo-600"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`صورة المنتج ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div>
          <span className="mb-4 inline-block rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600">
            عرض خاص لفترة محدودة
          </span>

          <h2 className="mb-5 text-4xl font-black leading-tight md:text-5xl">
            {PRODUCT.name}
          </h2>

          <p className="mb-7 text-lg leading-8 text-slate-500">
            {PRODUCT.description}
          </p>

          <div className="mb-7 flex items-center gap-4">
            <span className="text-4xl font-black text-indigo-600">
              {PRODUCT.price} ج.م
            </span>

            <span className="text-xl text-slate-400 line-through">
              {PRODUCT.oldPrice} ج.م
            </span>

            <span className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
              وفر {PRODUCT.oldPrice - PRODUCT.price} جنيه
            </span>
          </div>

          <div className="mb-7 rounded-2xl bg-slate-50 p-5">
            <p className="mb-4 text-center font-bold">
              العرض ينتهي خلال
            </p>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                ["days", "يوم"],
                ["hours", "ساعة"],
                ["minutes", "دقيقة"],
                ["seconds", "ثانية"]
              ].map(([key, label]) => (
                <div key={key} className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="text-2xl font-black text-indigo-600">
                    {String(time[key]).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-7 flex items-center gap-4">
            <span className="font-bold">الكمية:</span>

            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10 rounded-lg bg-slate-100 font-bold"
            >
              -
            </button>

            <span className="min-w-8 text-center text-xl font-bold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 rounded-lg bg-slate-100 font-bold"
            >
              +
            </button>
          </div>

          <a
            href="#order"
            className="block rounded-2xl bg-indigo-600 py-5 text-center text-xl font-black text-white shadow-lg transition hover:bg-indigo-700"
          >
            اطلب دلوقتي
          </a>

          <p className="mt-4 text-center text-sm text-slate-400">
            اطلب بسهولة وسيتم التواصل معك لتأكيد الطلب
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-12">
        <div className="container-main grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {[
            ["🚚", "شحن لجميع المحافظات"],
            ["🔒", "بياناتك في أمان"],
            ["☎️", "خدمة عملاء"]
          ].map(([icon, title]) => (
            <div key={title} className="rounded-2xl bg-white p-7">
              <div className="mb-3 text-4xl">{icon}</div>
              <h3 className="font-bold">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="container-main py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 p-6 shadow-xl md:p-10">

          <h2 className="mb-3 text-center text-3xl font-black">
            اطلب منتجك الآن
          </h2>

          <p className="mb-8 text-center text-slate-500">
            املأ بياناتك وسنرسل طلبك إلى واتساب
          </p>

          <form onSubmit={handleOrder} className="space-y-5">

            <input
              required
              placeholder="الاسم بالكامل"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-xl border p-4 outline-none focus:border-indigo-500"
            />

            <input
              required
              type="tel"
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full rounded-xl border p-4 outline-none focus:border-indigo-500"
            />

            <textarea
              required
              placeholder="العنوان بالتفصيل والمحافظة"
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="w-full rounded-xl border p-4 outline-none focus:border-indigo-500"
            />

            <div className="flex justify-between rounded-xl bg-slate-50 p-4 font-bold">
              <span>إجمالي الطلب</span>
              <span className="text-indigo-600">{total} جنيه</span>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-5 text-lg font-black text-white transition hover:bg-indigo-700"
            >
              تأكيد الطلب عبر واتساب
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="container-main max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-black">
            الأسئلة الشائعة
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenFAQ(openFAQ === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-5 text-right font-bold"
                >
                  {faq.q}
                  <span className="text-xl text-indigo-600">
                    {openFAQ === index ? "−" : "+"}
                  </span>
                </button>

                {openFAQ === index && (
                  <p className="border-t px-5 py-4 leading-8 text-slate-500">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-9 text-center text-white">
        <h2 className="mb-3 text-2xl font-black">Alora</h2>

        <p className="text-sm text-slate-400">
          جميع الحقوق محفوظة © {new Date().getFullYear()} Alora
        </p>
      </footer>

    </main>
  );
              }
                  
