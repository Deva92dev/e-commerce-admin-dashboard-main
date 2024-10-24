import type { Metadata } from "next";

import "../globals.css";
import Navbar from "@/components/custom-ui/Navbar";
import Footer from "@/components/custom-ui/Footer";
import { ToasterProvider } from "@/lib/ToasterProvider";

export const metadata: Metadata = {
  title: "Own Closet - Cloth Store for Youth & All",
  description:
    "Fashion Meets Standard through in vogue styles & Seasons wonders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
