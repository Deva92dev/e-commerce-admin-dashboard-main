import { navbarLinks } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";

const Navbar = () => {
  return (
    <header className="h-24 px-4 md:px-6 lg:px-12 xl:px-24 relative max-sm:p-2 bg-navbar-background text-navbar-text">
      {/* smaller screens */}
      <div className="h-full flex items-center justify-between pt-4 lg:hidden">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo of website"
            width={100}
            height={70}
            priority
            sizes="(max-width: 768px) 80px, 125px"
          />
        </Link>
        <SearchBar />
        <Menu />
      </div>

      {/* bigger screens */}
      <header className="max-lg:hidden lg:flex items-center justify-between h-full ">
        {/* left */}
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo of website"
              width={100}
              height={100}
            />
          </Link>
          <ul className="flex gap-8">
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
        </div>
        {/* right */}
        <div className="flex items-center justify-between gap-4">
          <SearchBar />
          <NavIcons />
        </div>
      </header>
    </header>
  );
};

export default Navbar;
