import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function PhoneCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="aspect-square mb-3 rounded-lg" />
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}

export function PostCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  );
}

export function DealCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  );
}
