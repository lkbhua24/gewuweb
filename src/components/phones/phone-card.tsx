import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";
import Image from "next/image";

interface PhoneCardProps {
  brand: string;
  model: string;
  imageUrl?: string | null;
  priceCny?: number | null;
  category?: string | null;
}

export function PhoneCard({ brand, model, imageUrl, priceCny, category }: PhoneCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="aspect-square mb-3 flex items-center justify-center rounded-lg bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${brand} ${model}`}
              className="object-contain p-4"
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          ) : (
            <Smartphone className="size-12 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{brand}</span>
            {category && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {category}
              </Badge>
            )}
          </div>
          <h3 className="font-medium text-sm line-clamp-2">{model}</h3>
          {priceCny && (
            <p className="text-sm font-semibold text-primary">
              ¥{priceCny.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
