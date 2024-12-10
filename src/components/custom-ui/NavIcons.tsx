"use client";

import useCart from "@/lib/hooks/useCart";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const NavIcons = () => {
  const { user } = useUser();
  const cart = useCart();
  const pathname = usePathname();
  const { signOut, redirectToSignIn, redirectToSignUp } = useClerk();

  const handleLogout = async () => {
    await signOut();
    window.location.href = pathname;
  };

  const handleLogin = () => {
    redirectToSignIn({ redirectUrl: pathname });
  };

  const handleRegister = () => {
    redirectToSignUp({ redirectUrl: pathname });
  };

  return (
    <div className="p-4 rounded-lg">
      {user ? (
        <div className="flex items-center justify-center gap-4 min-h-12">
          <Link
            href="/wishlist"
            className={`text-white hover:text-gray-300 hover:underline ${
              user ? "visible" : "invisible"
            }`}
          >
            Wishlist
          </Link>
          <Link
            href="/orders"
            className={`text-white hover:text-gray-300 hover:underline ${
              user ? "visible" : "invisible"
            }`}
          >
            Orders
          </Link>
          <Link href="/cart" className="relative text-white">
            <ShoppingCart />
            <span
              className="absolute -top-3 right-0 text-lg text-gray-300"
              style={{
                minWidth: "1.5rem",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {cart.cartItems.length > 0 ? cart.cartItems.length : ""}
            </span>
          </Link>
          <SignedIn>
            <Button
              className={`w-full text-center bg-gray-900 text-white hover:bg-gray-700 ${
                user ? "visible" : "hidden"
              }`}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </SignedIn>
        </div>
      ) : (
        <div className="flex flex-row gap-4">
          <SignedOut>
            <Button
              className={`w-full text-center bg-gray-900 text-white hover:bg-gray-700 ${
                !user ? "visible" : "hidden"
              }`}
              onClick={handleLogin}
            >
              Login
            </Button>

            <Button
              className={`w-full text-center bg-gray-900 text-white hover:bg-gray-700 ${
                !user ? "visible" : "hidden"
              }`}
              onClick={handleRegister}
            >
              Register
            </Button>
          </SignedOut>
        </div>
      )}
    </div>
  );
};

export default NavIcons;
