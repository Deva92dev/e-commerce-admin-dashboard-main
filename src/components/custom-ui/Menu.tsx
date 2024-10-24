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
import { CircleUserRound, MenuIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const cart = useCart();

  return (
    <div>
      <MenuIcon
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      {isOpen && (
        <div className="absolute bg-[#4D4c4C] text-white w-full h-[calc((100vh-80px)/2)] top-20 right-0 flex flex-col items-center justify-center text-lg gap-6 z-30">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact-Us</Link>
          {user ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <Link href="/cart" className="relative">
                <ShoppingCart />
                <span className="absolute -top-3 right-0 text-lg text-[#FF69B4]">
                  {cart.cartItems.length}
                </span>
              </Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/orders">Orders</Link>
              <SignedIn>
                <SignOutButton>
                  <Link href="/" className="w-full text-left">
                    <CircleUserRound />
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
      )}
    </div>
  );
};

export default Menu;
