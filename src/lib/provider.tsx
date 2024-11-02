"use client";
import { ClerkProvider } from "@clerk/nextjs";

export function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
