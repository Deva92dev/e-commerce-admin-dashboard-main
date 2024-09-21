"use client";
import useCart from "@/lib/hooks/useCart";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { LogOut, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const NavIcons = () => {
  const { user } = useUser();
  const cart = useCart();

  return (
    <div>
      {user ? (
        <div className="flex items-center justify-center gap-4">
          <Link href={"/wishlist"}>Wishlist</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/cart" className="relative">
            <ShoppingCart />
            <span className="absolute -top-3 right-0 text-lg text-[#FF69B4]">
              {cart.cartItems.length}
            </span>
          </Link>
          <SignedIn>
            <SignOutButton>
              <Link href="/" className="w-full text-left">
                <Button className="w-full text-center hover:bg-blue-400">
                  Logout
                </Button>
              </Link>
            </SignOutButton>
          </SignedIn>
        </div>
      ) : (
        <div className="flex flex-row gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="w-full text-center hover:bg-blue-400">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-full text-center hover:bg-blue-400">
                Register
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      )}
    </div>
  );
};

export default NavIcons;
