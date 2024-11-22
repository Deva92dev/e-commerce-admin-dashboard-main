import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative w-full h-screen">
      <Image
        src="/Hero.jpg"
        alt="Hero image of Own Closet"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fill
        priority={true}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,[BASE64_STRING]"
        quality={80}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: "100%", // Ensure no layout shifts
          maxHeight: "100vh", // Prevent any overflow on small screens
        }}
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
  );
};

export default Hero;
