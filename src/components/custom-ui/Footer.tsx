import {
  footerGeneralLinks,
  footerImportantLinks,
  footerSocialLinks,
} from "@/lib/constants";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full h-80 px-4 py-8 md:px-6 lg:px-12 xl:px-24 grid items-center gap-8 grid-cols-1 md:grid-cols-2 max-md:h-96 lg:grid-cols-3 bg-footer-background text-sm md:text-base leading-relaxed">
      <div className="space-y-3">
        {footerImportantLinks.map((v) => (
          <div key={v.label}>
            <Link
              href={v.url}
              className="text-footer-text hover:text-footer-hover hover:underline"
            >
              {v.label}
            </Link>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {footerGeneralLinks.map((g) => (
          <div key={g.label}>
            <Link
              href={g.url}
              className="text-footer-text hover:text-footer-hover hover:underline"
            >
              {g.label}
            </Link>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {footerSocialLinks.map((l) => (
          <div key={l.label}>
            <Link
              href={l.url}
              className="text-footer-text hover:text-footer-hover hover:underline"
            >
              {l.label}
            </Link>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
