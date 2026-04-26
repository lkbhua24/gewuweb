import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface DealCardProps {
  title: string;
  platform: string;
  price: number;
  originalPrice?: number | null;
  isActive?: boolean;
}

export function DealCard({ title, platform, price, originalPrice, isActive = true }: DealCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          {isActive && discount > 0 && (
            <Badge variant="destructive" className="shrink-0 text-[10px] px-1.5 py-0">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            ¥{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              ¥{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <Tag className="size-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{platform}</span>
        </div>
      </CardContent>
    </Card>
  );
}
