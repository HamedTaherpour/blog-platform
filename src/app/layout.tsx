import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Conduit - A place to share your knowledge",
  description:
    "A social blogging platform built with Next.js, Tailwind CSS, and the RealWorld API",
  keywords: "blog, social, articles, knowledge sharing, realworld",
  authors: [{ name: "Conduit Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Conduit - A place to share your knowledge",
    description:
      "A social blogging platform built with Next.js, Tailwind CSS, and the RealWorld API",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conduit - A place to share your knowledge",
    description:
      "A social blogging platform built with Next.js, Tailwind CSS, and the RealWorld API",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Conduit",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Conduit",
    "apple-mobile-web-app-title": "Conduit",
    "msapplication-TileColor": "oklch(0.55 0.18 250)", // modern blue primary
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "oklch(0.55 0.18 250)", // modern blue primary
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
