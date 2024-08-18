"use client";
import Image from "next/image";
import React, { useState } from "react";

interface GalleryProps {
  title: string;
  productMedia: string[];
}

const Gallery = ({ productMedia, title }: GalleryProps) => {
  const [mainImage, setMainImage] = useState(productMedia[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div
        className="relative h-[600px] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainImage}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw (max-width:1200px) 70vw"
          className={`object-cover overflow-hidden rounded-lg transition-transform duration-300 ease-in-out ${
            isHovered ? "scale-150" : "scale-100"
          }`}
          style={{
            transformOrigin: `${isHovered ? mousePosition.x : 50}% ${
              isHovered ? mousePosition.y : 50
            }%`,
          }}
        />
      </div>

      <div className="flex flex-row gap-2">
        {productMedia.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              alt="image"
              width={200}
              height={200}
              className={`rounded-lg cursor-pointer ${
                mainImage === image ? "border border-black" : ""
              }`}
              onClick={() => setMainImage(image)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
