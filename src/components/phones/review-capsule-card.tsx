"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 胶囊评论卡片组件
// 与排行榜视觉语言统一的评论展示卡片
// ============================================================================

export interface ReviewData {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  date: string;
  isTopReview?: boolean;
}

interface ReviewCapsuleCardProps {
  review: ReviewData;
  index: number;
  themeColor: string;
}

export function ReviewCapsuleCard({ review, index, themeColor }: ReviewCapsuleCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.div
      className={cn(
        "capsule-card group cursor-pointer capsule-pressable relative overflow-hidden",
        review.isTopReview && "capsule-card-top3"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transform: isPressed ? "scale(0.98)" : "scale(1)",
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* 背景层 - 与排行榜胶囊相同的视觉语言 */}
      <div
        className="capsule-layer-0"
        style={{
          background: `linear-gradient(90deg, ${themeColor}08 0%, ${themeColor}15 100%)`,
        }}
      />

      <div className="capsule-layer-1 h-full" />

      {/* 内容层 */}
      <div className="capsule-layer-2 absolute inset-0 flex flex-col justify-center">
        <div className="px-5 py-4">
          {/* 顶部：作者信息 + 评分 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* 头像 */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: `${themeColor}20`,
                  color: themeColor,
                  border: `1px solid ${themeColor}30`,
                }}
              >
                {review.author.charAt(0)}
              </div>
              <span className="text-xs text-white/70 font-ranking-cn">{review.author}</span>
              {review.isTopReview && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-ranking-cn"
                  style={{
                    background: `${themeColor}15`,
                    color: themeColor,
                    border: `1px solid ${themeColor}30`,
                  }}
                >
                  精选
                </span>
              )}
            </div>

            {/* 评分 */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3",
                    i < Math.floor(review.rating)
                      ? "fill-current"
                      : "fill-none text-white/20"
                  )}
                  style={{
                    color: i < Math.floor(review.rating) ? themeColor : undefined,
                  }}
                />
              ))}
              <span className="text-xs font-ranking-num text-white/50 ml-1">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 评论内容 */}
          <p className="text-sm text-white/70 font-ranking-cn leading-relaxed line-clamp-2 mb-2">
            {review.content}
          </p>

          {/* 标签 */}
          <div className="flex items-center gap-1.5 mb-2">
            {review.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-ranking-cn"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底部：时间 + 互动 */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/30 font-ranking-cn">{review.date}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={cn(
                  "flex items-center gap-1 text-[10px] transition-colors",
                  liked ? "text-white/70" : "text-white/30 hover:text-white/50"
                )}
              >
                <ThumbsUp className={cn("size-3", liked && "fill-current")} />
                <span className="font-ranking-num">{likeCount}</span>
              </button>
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <MessageCircle className="size-3" />
                <span className="font-ranking-num">{review.replies}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 评论列表组件
// ============================================================================

interface ReviewCapsuleListProps {
  reviews: ReviewData[];
  themeColor: string;
}

export function ReviewCapsuleList({ reviews, themeColor }: ReviewCapsuleListProps) {
  return (
    <div className="space-y-3">
      {reviews.map((review, index) => (
        <ReviewCapsuleCard
          key={review.id}
          review={review}
          index={index}
          themeColor={themeColor}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Mock 评论数据
// ============================================================================

export const MOCK_REVIEWS: ReviewData[] = [
  {
    id: "1",
    author: "数码发烧友",
    rating: 5,
    content: "这款手机的影像系统真的太强了，夜景拍摄细节保留非常到位，长焦端的表现也超出预期。",
    tags: ["影像强", "夜景好"],
    likes: 234,
    replies: 18,
    date: "2天前",
    isTopReview: true,
  },
  {
    id: "2",
    author: "科技测评君",
    rating: 4.5,
    content: "性能释放很激进，原神满帧运行无压力，但发热控制还有提升空间。",
    tags: ["性能强", "发热一般"],
    likes: 156,
    replies: 12,
    date: "3天前",
  },
  {
    id: "3",
    author: "日常使用者",
    rating: 4,
    content: "续航表现中规中矩，一天一充没问题，充电速度很快，30分钟就能充满。",
    tags: ["续航一般", "充电快"],
    likes: 89,
    replies: 6,
    date: "5天前",
  },
  {
    id: "4",
    author: "颜值党",
    rating: 5,
    content: "外观设计真的很精致，手感一流，配色也很高级，拿出去很有面子。",
    tags: ["颜值高", "手感好"],
    likes: 312,
    replies: 24,
    date: "1周前",
    isTopReview: true,
  },
  {
    id: "5",
    author: "性价比猎人",
    rating: 3.5,
    content: "价格有点贵，但综合体验确实不错，如果能在4000以下就更完美了。",
    tags: ["偏贵", "体验好"],
    likes: 67,
    replies: 15,
    date: "1周前",
  },
];
