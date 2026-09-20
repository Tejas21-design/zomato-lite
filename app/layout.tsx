import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zomato Lite",
  description: "Restaurant reviews, computed the honest way.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-line">
          <nav className="mx-auto flex w-full max-w-[800px] items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              zomato lite
            </Link>
            <span className="text-xs text-muted">reviews, computed live</span>
          </nav>
        </header>
        {children}
        <footer className="mt-auto border-t border-line">
          <div className="mx-auto w-full max-w-[800px] px-6 py-6 text-xs text-muted">
            Built to learn how a full-stack app fits together.
          </div>
        </footer>
      </body>
    </html>
  );
}