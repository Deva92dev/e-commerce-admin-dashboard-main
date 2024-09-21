import {
  footerGeneralLinks,
  footerImportantLinks,
  footerSocialLinks,
} from "@/lib/constants";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-80 my-8  px-4 md:px-6 lg:px-12 xl:px-24 grid items-center gap-8 grid-cols-1 md:grid-cols-2 max-md:h-96 lg:grid-cols-3 bg-gray-50">
      <div className="space-y-3">
        {footerImportantLinks.map((v) => (
          <div key={v.label}>
            <Link href={v.url} className="hover:underline">
              {v.label}
            </Link>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {footerGeneralLinks.map((g) => (
          <div key={g.label}>
            <Link href={g.url}>{g.label}</Link>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {footerSocialLinks.map((l) => (
          <div key={l.label}>
            <Link href={l.url}>{l.label}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
