import type { Metadata } from "next";

import "../globals.css";
import Navbar from "@/components/custom-ui/Navbar";
import Footer from "@/components/custom-ui/Footer";
import { ToasterProvider } from "@/lib/ToasterProvider";

export const metadata: Metadata = {
  title: {
    default: "Own Closet",
    template: "%s - Own Closet",
  },
  description: "Fashion Meets Standard through in vogue styles.",
  twitter: {
    card: "summary_large_image",
  },
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
