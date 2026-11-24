import type { Metadata } from "next";
import "./globals.css";
import  localFont from "next/font/local";
import SideNav from "./components/ui/SideNav";


const firjar = localFont({
  src: "./fonts/Firjar-Medium.woff2",
  variable: "--font-firjar",
});

export const metadata: Metadata = {
  title: "صفحة الإدارة",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      className={`h-full antialiased`}
    >
      <body dir="rtl" className={`min-h-full flex  ${firjar.variable} font-sans`}>
        <SideNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
