import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// make your link highlighted when clicking  using cn of utils
const Sidebar = () => {
  return (
    <div className=" h-screen left-0 top-0 sticky w-48 flex flex-col justify-center items-center shadow-xl font-medium bg-[#8fabca] max-lg:hidden">
      <Link href="/" className="w-24 h-20">
        <Image
          src="/logo.svg"
          alt="logo of website"
          width={100}
          height={70}
          priority
          sizes="(max-width: 768px) 80px, 125px"
        />
      </Link>
      <div className="flex flex-col gap-20 pt-24">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className="flex flex-row gap-2 text-gray"
          >
            {link.icon}
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-row gap-2 mt-20">
        <UserButton />
        <p>Edit Profile</p>
      </div>
    </div>
  );
};

export default Sidebar;
