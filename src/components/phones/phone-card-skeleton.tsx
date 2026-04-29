import { cn } from "@/lib/utils";

interface PhoneCardSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function PhoneCardSkeleton({ className, style }: PhoneCardSkeletonProps) {
  return (
    <div className={cn("phone-card-skeleton group", className)} style={style}>
      <div className="phone-card-skeleton-content">
        <div className="phone-card-skeleton-header">
          <div className="flex items-center">
            <div className="skeleton-element skeleton-brand" />
            <div className="skeleton-element skeleton-tag" />
          </div>
          <div className="skeleton-element skeleton-badge" />
        </div>

        <div className="phone-card-skeleton-visual">
          <div className="skeleton-element skeleton-phone" />
        </div>

        <div className="phone-card-skeleton-info">
          <div className="skeleton-element skeleton-title" />
          <div className="skeleton-element skeleton-title-short" />
          <div className="skeleton-element skeleton-price" />
        </div>
      </div>
    </div>
  );
}

interface PhoneCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function PhoneCardSkeletonGrid({ count = 10, className }: PhoneCardSkeletonGridProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <PhoneCardSkeleton
          key={index}
          className={cn(
            "animate-skeleton-enter",
            className
          )}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        />
      ))}
    </>
  );
}
