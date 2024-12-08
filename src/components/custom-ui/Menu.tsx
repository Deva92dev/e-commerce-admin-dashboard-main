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
import { navbarLinks } from "@/lib/constants";

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
        <div className="fixed inset-x-0 bg-[#4D4c4C] text-white w-full top-24 h-[calc(50vh-6rem)] overflow-y-auto flex flex-col items-center justify-start py-8 text-lg gap-4 z-30 shadow-lg">
          <ul className="flex flex-col gap-4">
            {navbarLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.url}
                  className="hover:text-navbar-hover hover:underline transition duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Link href="/cart" className="relative">
                <ShoppingCart />
                <span className="absolute -top-3 right-0 text-lg text-gray-300">
                  {cart.cartItems.length}
                </span>
              </Link>
              <Link href="/wishlist">Wishlist</Link>
              <Link href="/orders">Orders</Link>
              <SignedIn>
                <SignOutButton>
                  <Link href="/" className="text-center">
                    <CircleUserRound />
                  </Link>
                </SignOutButton>
              </SignedIn>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full text-center bg-gray-900 text-white hover:bg-gray-700">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full text-center bg-gray-900 text-white hover:bg-gray-700">
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
