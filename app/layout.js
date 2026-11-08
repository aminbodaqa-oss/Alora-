
import "./globals.css";

export const metadata = {
  title: "Alora | اكتشف منتجنا",
  description: "اكتشف عروض ومنتجات Alora المميزة واطلب بسهولة.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
    }
