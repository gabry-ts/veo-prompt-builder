interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'text' | 'circle';
  count?: number;
  className?: string;
}

function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className = '',
}: LoadingSkeletonProps): JSX.Element {
  const skeletons = Array.from({ length: count });

  const SkeletonCard = (): JSX.Element => (
    <div className={`glass-card rounded-2xl p-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
      </div>
    </div>
  );

  const SkeletonList = (): JSX.Element => (
    <div className={`flex items-center gap-4 glass-card rounded-xl p-4 animate-pulse ${className}`}>
      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>
      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
  );

  const SkeletonText = (): JSX.Element => (
    <div className={`space-y-2 animate-pulse ${className}`}>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
    </div>
  );

  const SkeletonCircle = (): JSX.Element => (
    <div
      className={`bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse ${className}`}
      style={{ width: '48px', height: '48px' }}
    />
  );

  const renderSkeleton = (): JSX.Element => {
    switch (variant) {
      case 'card':
        return <SkeletonCard />;
      case 'list':
        return <SkeletonList />;
      case 'text':
        return <SkeletonText />;
      case 'circle':
        return <SkeletonCircle />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
