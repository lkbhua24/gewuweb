import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export function PostCard({
  title,
  content,
  authorName,
  authorAvatar,
  likesCount,
  commentsCount,
  createdAt,
}: PostCardProps) {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="size-8">
            <AvatarImage src={authorAvatar ?? undefined} />
            <AvatarFallback className="text-xs">
              {authorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{authorName}</p>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
        </div>
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{content}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" />
            {likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {commentsCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
