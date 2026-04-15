/**
 * Loading Skeleton Component
 * Provides visual feedback during data loading
 * Improves perceived performance and UX
 */

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'product' | 'blog';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  const renderSkeleton = () => {
    switch (variant) {
      case 'product':
        return (
          <div className={`card ${className}`}>
            <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
            <div className="skeleton h-6 w-3/4 rounded mb-2"></div>
            <div className="skeleton h-4 w-full rounded mb-2"></div>
            <div className="skeleton h-4 w-5/6 rounded mb-4"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton h-8 w-24 rounded"></div>
              <div className="skeleton h-6 w-20 rounded"></div>
            </div>
            <div className="skeleton h-10 w-full rounded-lg"></div>
          </div>
        );

      case 'blog':
        return (
          <div className={`card ${className}`}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="skeleton w-full h-48 rounded-lg"></div>
              </div>
              <div className="md:w-2/3">
                <div className="skeleton h-6 w-32 rounded-full mb-3"></div>
                <div className="skeleton h-8 w-full rounded mb-3"></div>
                <div className="skeleton h-4 w-full rounded mb-2"></div>
                <div className="skeleton h-4 w-5/6 rounded mb-4"></div>
                <div className="flex gap-4">
                  <div className="skeleton h-4 w-24 rounded"></div>
                  <div className="skeleton h-4 w-24 rounded"></div>
                  <div className="skeleton h-4 w-20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={className}>
            <div className="skeleton h-4 w-full rounded mb-2"></div>
            <div className="skeleton h-4 w-5/6 rounded"></div>
          </div>
        );

      case 'avatar':
        return (
          <div className={`flex items-center gap-3 ${className}`}>
            <div className="skeleton w-12 h-12 rounded-full"></div>
            <div className="flex-1">
              <div className="skeleton h-4 w-32 rounded mb-2"></div>
              <div className="skeleton h-3 w-24 rounded"></div>
            </div>
          </div>
        );

      case 'button':
        return <div className={`skeleton h-10 w-32 rounded-lg ${className}`}></div>;

      case 'card':
      default:
        return (
          <div className={`card ${className}`}>
            <div className="skeleton h-40 w-full rounded-lg mb-4"></div>
            <div className="skeleton h-6 w-3/4 rounded mb-2"></div>
            <div className="skeleton h-4 w-full rounded mb-2"></div>
            <div className="skeleton h-4 w-5/6 rounded"></div>
          </div>
        );
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
}

