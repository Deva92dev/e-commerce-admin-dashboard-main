"use client";
import Image from "next/image";
import React, { useState } from "react";

interface GalleryProps {
  title: string;
  productMedia: string[];
}

const Gallery = ({ productMedia, title }: GalleryProps) => {
  const mainImageUrl = `/api/cloudinary-cached-image?secure_url=${encodeURIComponent(
    productMedia[0]
  )}`;

  const [mainImage, setMainImage] = useState(mainImageUrl);
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
    <div className="grid grid-cols-1 gap-6 aspect-[4/3]">
      <div
        className="relative h-[600px] overflow-hidden rounded-lg border-4 border-productDetails-secondary/30 shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover overflow-hidden rounded-lg transition-transform duration-300 ease-in-out ${
            isHovered ? "scale-125" : "scale-100"
          }`}
          style={{
            transformOrigin: `${isHovered ? mousePosition.x : 50}% ${
              isHovered ? mousePosition.y : 50
            }%`,
          }}
        />
      </div>

      <div className="flex flex-row gap-2">
        {productMedia.map((image, index) => {
          const cachedThumbnailUrl = `/api/cloudinary-cached-image?secure_url=${encodeURIComponent(
            image
          )}`;

          return (
            <div key={index}>
              <Image
                src={cachedThumbnailUrl}
                alt="image"
                width={200}
                height={200}
                loading="lazy"
                className={`rounded-lg border-2 overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out ${
                  mainImage === cachedThumbnailUrl
                    ? "border-productDetails-secondary/50 scale-105 shadow-md"
                    : "border-gray-300 hover:scale-110"
                }`}
                onClick={() => setMainImage(cachedThumbnailUrl)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
