import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import Image from "next/image";

const TopNavBar = () => {
  return (
    <div className="lg:hidden w-full h-20 px-4 flex flex-row justify-between items-center bg-[#75a7dd] relative">
      <Link href="/">
        <div className="w-24 h-20 flex items-center justify-center">
          <Image src="/logo.svg" alt="logo of store" width={100} height={70} />
        </div>
      </Link>
      <div className="flex flex-row gap-6 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className="flex flex-row gap-2 font-medium"
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <Menu />
      <div className="">
        <UserButton />
      </div>
    </div>
  );
};

export default TopNavBar;
