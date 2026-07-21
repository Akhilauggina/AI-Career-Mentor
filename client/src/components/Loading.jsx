export const Spinner = ({ size = "md" }) => {
  const sizes = { sm: "h-5 w-5", md: "h-10 w-10", lg: "h-16 w-16" };
  return (
    <div className="flex justify-center items-center h-48">
      <div
        className={`animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 ${sizes[size]}`}
      />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
    <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
    <div className="h-3 bg-slate-100 rounded w-full mb-1" />
    <div className="h-3 bg-slate-100 rounded w-3/4" />
  </div>
);

export const SkeletonGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

const Loading = () => <Spinner />;

export default Loading;
