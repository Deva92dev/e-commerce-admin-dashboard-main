import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-screen aspect-[4/3]">
      <Image
        src="/Hero.jpg"
        alt="Hero image of Own Closet"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fill
        priority
        className="object-cover brightness-90"
      />
      <div className="absolute inset-0 top-2/4 left-1/4 flex flex-col gap-4">
        <p className="text-landingPage-secondary">60% Discount</p>
        <h1 className="font-bold text-3xl text-text font-serif tracking-tight">
          Winter Collection
        </h1>
        <Link href="/products">
          <Button className="bg-sand hover:bg-sand-dark text-olive-dark hover:text-olive-dark/80 font-semibold font-serif transition-colors duration-300">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
