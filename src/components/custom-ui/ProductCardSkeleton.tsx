const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-border rounded-lg">
      <div className="relative h-72 bg-white rounded-t-lg"></div>
      {/* text section */}
      <div className="px-2 my-4">
        <div className="flex flex-col justify-between my-4 space-y-2">
          <div className="h-4 bg-white rounded w-3/4"></div>
          <div className="h-3 bg-white rounded w-1/2"></div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="h-4 bg-white rounded w-1/4"></div>
          <div className="h-6 w-6 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
