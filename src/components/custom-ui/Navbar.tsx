import { navbarLinks } from "@/lib/constants";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";

// use html semantics, use clsx for inline links styling, only show cart item when we logged in

const Navbar = () => {
  return (
    <div className="h-20 bg-white px-4 md:px-8 lg:px-16 xl:px-32 relative">
      {/* smaller screens */}
      <div className="h-full flex items-center justify-between pt-4 md:hidden">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo of website"
            width={100}
            height={100}
          />
        </Link>
        <Menu />
      </div>

      {/* bigger screens */}
      <div className="max-md:hidden md:flex items-center justify-between h-full">
        {/* left */}
      <div className="flex items-center gap-10">
        <Link href="/" >
          <Image
            src="/logo.svg"
            alt="logo of website"
            width={100}
            height={100}
          />
        </Link>
        <ul className="flex gap-8 lg:gap-10">
          {navbarLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.url} className="hover:underline ">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* right */}
      <div className="flex items-center justify-between gap-6">
        <SearchBar />
        <NavIcons />
      </div>
      </div>
    </div>
  );
};

export default Navbar;