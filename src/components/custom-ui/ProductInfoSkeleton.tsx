const ProductInfoSkeleton = () => {
  return (
    <div className="max-w-[400px] flex flex-col gap-4 animate-pulse">
      {/* Title and favorite icon skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>

      {/* Rating and reviews skeleton */}
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>

      {/* Category skeleton */}
      <div className="h-4 w-1/4 bg-gray-300 rounded mt-2"></div>

      {/* Price skeleton */}
      <div className="h-8 w-1/4 bg-gray-300 rounded mt-2"></div>

      {/* Stock status skeleton */}
      <div className="h-4 w-1/4 bg-gray-300 rounded mt-2"></div>

      {/* Description skeleton */}
      <div className="h-4 w-full bg-gray-300 rounded mt-2"></div>

      {/* Color options skeleton */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Size options skeleton */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Quantity selector skeleton */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Add to Cart button skeleton */}
      <div className="h-12 w-full bg-gray-300 rounded mt-4"></div>
    </div>
  );
};

export default ProductInfoSkeleton;
