import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="relative w-full h-screen">
        <Image
          src="/Hero.jpg"
          alt="Hero image"
          priority
          style={{ objectFit: "cover" }}
          fill={true}
          quality={100}
        />
        <div className="absolute top-2/4 left-1/4 flex flex-col gap-4">
          <p>60% Discount</p>
          <h1 className=" font-extrabold text-4xl text-black">
            Winter Collection
          </h1>
          <Link href="/products">
            <Button className="bg-blue-500 w-max">Shop Now</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Hero;
