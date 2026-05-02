import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageCircle, Share2 } from "lucide-react";
import { HeatIndicator, calculateHeatLevel } from "./heat-indicator";
import { LikeButton } from "./like-button";

interface PostCardProps {
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string | null;
  authorRole?: string;
  circleName?: string;
  tags?: string[];
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
}

export function PostCard({
  title,
  content,
  authorName,
  authorAvatar,
  authorRole,
  circleName,
  tags = [],
  viewsCount,
  commentsCount,
  likesCount,
  createdAt,
}: PostCardProps) {
  const heatLevel = calculateHeatLevel(viewsCount, likesCount, commentsCount);

  return (
    <div className="post-card group cursor-pointer">
      {/* 头部：头像 + 昵称 + 身份标签 + 时间 + 圈子来源 + 热度标识 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={authorAvatar ?? undefined} />
            <AvatarFallback className="text-xs bg-[var(--community-primary)]/20 text-[var(--community-primary)]">
              {authorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white/90">{authorName}</p>
              {authorRole && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--community-accent)]/20 text-[var(--community-accent)]">
                  {authorRole}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{createdAt}</span>
              {circleName && (
                <>
                  <span>·</span>
                  <span className="text-[var(--community-primary)]">{circleName}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* 热度标识 */}
        <HeatIndicator level={heatLevel} />
      </div>

      {/* 内容：标题 + 摘要（2行截断）+ 标签 */}
      <h3 className="font-semibold text-base mb-2 text-white/90 line-clamp-1 group-hover:text-[var(--community-primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-white/60 line-clamp-2 leading-relaxed mb-3">
        {content}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60 hover:bg-[var(--community-primary)]/10 hover:text-[var(--community-primary)] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部：浏览数 + 评论数 + 点赞数 + 分享 */}
      <div className="flex items-center gap-6 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          {viewsCount}
        </span>
        <span className="flex items-center gap-1.5 group-hover:text-[var(--community-primary)] transition-colors">
          <MessageCircle className="w-4 h-4" />
          {commentsCount}
        </span>
        <LikeButton initialLikes={likesCount} />
        <button className="flex items-center gap-1.5 hover:text-white/80 transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
          分享
        </button>
      </div>
    </div>
  );
}
