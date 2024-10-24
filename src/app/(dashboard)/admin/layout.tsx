import type { Metadata } from "next";

import { ToasterProvider } from "@/lib/ToasterProvider";
import "../../globals.css";
import Sidebar from "../components/Sidebar";
import TopNavBar from "../components/TopNavBar";

export const metadata: Metadata = {
  title: "Admin page",
  description: "Data about Website",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToasterProvider />
        <div className="flex max-lg:flex-col">
          <Sidebar />
          <TopNavBar />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
