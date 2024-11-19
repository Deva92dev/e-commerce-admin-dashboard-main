const ReviewSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-8">
      {/* Skeleton for the post review form */}
      <div className="flex flex-col gap-6 max-w-xl mb-4">
        <div className="h-5 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-20 bg-gray-300 rounded-lg"></div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-300 rounded-full"></div>
          ))}
        </div>
        <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Skeleton for review items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col border p-4 rounded-xl gap-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col gap-1">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 bg-gray-300 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSkeleton;
