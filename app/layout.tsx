import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/language-provider";
import { languageForHost, PAGE_DESCRIPTION, PAGE_TITLE } from "@/lib/language";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vietnamese",
  display: "swap",
});

async function requestLanguage() {
  return languageForHost((await headers()).get("host"));
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await requestLanguage();
  return {
    title: PAGE_TITLE[language],
    description: PAGE_DESCRIPTION[language],
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await requestLanguage();
  return (
    <html lang={language} suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} antialiased`}><LanguageProvider defaultLanguage={language}>{children}<Toaster position="top-center" /></LanguageProvider></body>
    </html>
  );
}
