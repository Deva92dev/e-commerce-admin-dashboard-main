import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/lib/provider";

export const metadata: Metadata = {
  title: "Own Closet - Cloth Store",
  description: "Fashion Meets Standard through in vogue styles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isTestEnv = process.env.NODE_ENV === "test";

  return isTestEnv ? (
    <html lang="en">
      <body>{children}</body>
    </html>
  ) : (
    <Provider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
