const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 animate-pulse">
      {/* Main image skeleton */}
      <div className="relative h-[600px] bg-gray-300 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gray-300" />
      </div>

      {/* Thumbnail skeletons */}
      <div className="flex flex-row gap-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-[200px] h-[200px] bg-gray-300 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default GallerySkeleton;
