import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import {ThemeProvider} from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    template: "%s | My App Service",
    default: "My App Service - Next.js Fullstack Project",
  },
  description: "A comprehensive fullstack application built with Next.js 15, React 19, and Tailwind CSS.",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Fullstack", "Web Development"],
  authors: [{ name: "My App Team" }],
  creator: "My App Team",
  publisher: "My App Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "My App Service",
    description: "Experience the best fullstack web application features.",
    url: "/",
    siteName: "My App Service",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png", // public 폴더에 이미지를 추가해야 함
        width: 1200,
        height: 630,
        alt: "My App Service Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My App Service",
    description: "Experience the best fullstack web application features.",
    images: ["/og-image.png"],
    creator: "@myapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // public 폴더에 추가 권장
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
              {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
