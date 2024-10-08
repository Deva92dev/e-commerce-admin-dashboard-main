import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/custom-ui/Navbar";
import Footer from "@/components/custom-ui/Footer";
import { ToasterProvider } from "@/lib/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <ToasterProvider />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
