import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle } from "lucide-react";

interface CircleCardProps {
  name: string;
  description: string;
  membersCount: number;
  postsCount: number;
  iconUrl?: string | null;
}

export function CircleCard({
  name,
  description,
  membersCount,
  postsCount,
}: CircleCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {membersCount} 成员
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {postsCount} 帖子
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
