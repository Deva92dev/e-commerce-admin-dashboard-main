import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import HeroImage from "@/images/Hero.jpg";

const Hero = () => {
  return (
    <>
      <div
        className="relative w-full h-screen"
        style={{ paddingBottom: "66.67%" }}
      >
        <Image
          src={HeroImage}
          alt="Hero image"
          priority
          style={{ objectFit: "cover" }}
          fill
          quality={100}
          sizes="(max-width:768px) 100vw (max-width:1200px) 70vw"
        />
        <div className="absolute top-2/4 left-1/4 flex flex-col gap-4">
          <p>60% Discount</p>
          <h1 className=" font-extrabold text-4xl text-black">
            Winter Collection
          </h1>
          <Link href="/products">
            <Button className="bg-black hover:bg-green-800 w-max">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Hero;
