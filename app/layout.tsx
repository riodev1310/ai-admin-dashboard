import "./globals.css";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppProviders } from "@/components/providers/AppProviders";
import { env } from "@/lib/env";
import { Space_Grotesk } from "next/font/google";

const brandFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-brand"
});

export const metadata = {
  title: env.APP_NAME,
  description: "Admin dashboard quản lý thông minh cho doanh nghiệp (DAG/RAG/TAG)"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={env.DEFAULT_LOCALE.startsWith("vi") ? "vi" : "en"}>
      <body className={brandFont.variable}>
        <AntdRegistry>
          <AppProviders>{children}</AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
