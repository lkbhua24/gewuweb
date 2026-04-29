"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 用户评价情感分析组件
// ============================================================================

interface Keyword {
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  count: number;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  color: string;
  isVerified: boolean;
  likes: number;
}

interface ReviewSentimentAnalysisProps {
  recommendRate?: number;
  totalReviews?: number;
  keywords?: Keyword[];
  featuredReviews?: Review[];
  themeColor?: string;
}

// 默认关键词数据
const DEFAULT_KEYWORDS: Keyword[] = [
  { text: "屏幕顶级", sentiment: "positive", count: 2341 },
  { text: "拍照强大", sentiment: "positive", count: 1856 },
  { text: "续航持久", sentiment: "positive", count: 1523 },
  { text: "手感棒", sentiment: "positive", count: 1287 },
  { text: "系统流畅", sentiment: "positive", count: 967 },
  { text: "充电快", sentiment: "positive", count: 834 },
  { text: "音质好", sentiment: "positive", count: 756 },
  { text: "外观美", sentiment: "positive", count: 689 },
];

// 默认评价数据
const DEFAULT_REVIEWS: Review[] = [
  {
    id: "1",
    rating: 5,
    title: "影像天花板",
    content: "2亿像素不是噱头，夜景纯净度惊人，长焦解析力堪比单反。AI算法加持下，成片率极高，随手一拍就是大片。",
    author: "数码发烧友",
    color: "钛蓝",
    isVerified: true,
    likes: 328,
  },
  {
    id: "2",
    rating: 5,
    title: "屏幕素质无敌",
    content: "峰值亮度3000nit，户外阳光下依然清晰可见。LTPO自适应刷新率省电明显，一天重度使用没问题。",
    author: "科技博主小王",
    color: "钛灰",
    isVerified: true,
    likes: 256,
  },
  {
    id: "3",
    rating: 4,
    title: "质感一流，略有遗憾",
    content: "钛金属边框手感确实高级，做工精致。但价格偏高，如果能有更多配色选择就更完美了。",
    author: "手机控",
    color: "钛雾金",
    isVerified: true,
    likes: 189,
  },
];

export function ReviewSentimentAnalysis({
  recommendRate = 98.5,
  totalReviews = 12000,
  keywords = DEFAULT_KEYWORDS,
  featuredReviews = DEFAULT_REVIEWS,
  themeColor = "#00D9FF",
}: ReviewSentimentAnalysisProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const currentReview = featuredReviews[currentReviewIndex];

  // 格式化评价数量
  const formatReviewCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toLocaleString();
  };

  // 获取情感颜色
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#22c55e";
      case "neutral":
        return "#f59e0b";
      case "negative":
        return "#ef4444";
      default:
        return themeColor;
    }
  };

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">用户评价</h3>
        </div>

        {/* 推荐度 */}
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold">{recommendRate}%</span>
          <span className="text-sm text-gray-400">推荐</span>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-px bg-white/10 mb-6" />

      {/* 关键词云 */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">关键词云</h4>
        <div className="flex flex-wrap gap-2">
          {keywords.slice(0, 8).map((keyword, index) => (
            <motion.div
              key={keyword.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-all hover:scale-105"
              style={{
                backgroundColor: `${getSentimentColor(keyword.sentiment)}15`,
                borderColor: `${getSentimentColor(keyword.sentiment)}30`,
                color: getSentimentColor(keyword.sentiment),
              }}
            >
              {keyword.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 精选评价 */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">精选评价</h4>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 rounded-xl border border-white/10 p-4"
            >
              {/* 评价头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {renderStars(currentReview.rating)}
                  <span className="font-medium text-white">
                    {currentReview.title}
                  </span>
                </div>
                {currentReview.isVerified && (
                  <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                    已购
                  </span>
                )}
              </div>

              {/* 评价内容 */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                "{currentReview.content}"
              </p>

              {/* 评价底部 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{currentReview.author}</span>
                  <span className="text-gray-600">|</span>
                  <span style={{ color: themeColor }}>{currentReview.color}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-400">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="text-xs">{currentReview.likes}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 评价切换按钮 */}
          {featuredReviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {featuredReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentReviewIndex === index
                      ? "w-6"
                      : "hover:bg-white/30"
                  )}
                  style={{
                    backgroundColor:
                      currentReviewIndex === index
                        ? themeColor
                        : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 查看全部按钮 */}
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all group">
        <span className="text-sm">
          查看全部 {formatReviewCount(totalReviews)}+ 评价
        </span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function ReviewSentimentAnalysisDemo() {
  const [themeColor, setThemeColor] = useState("#00D9FF");

  const themes = [
    { name: "科技青", color: "#00D9FF" },
    { name: "钛蓝", color: "#A8C8EC" },
    { name: "钛灰", color: "#C5C0BC" },
    { name: "钛黑", color: "#1A1A1A" },
    { name: "钛雾金", color: "#E8D5B7" },
  ];

  // 不同主题的关键词和评价
  const getDataByTheme = (color: string) => {
    const keywords: Record<string, Keyword[]> = {
      "#C4B5A0": [
        { text: "A18芯片强", sentiment: "positive", count: 2156 },
        { text: "拍照真实", sentiment: "positive", count: 1890 },
        { text: "iOS流畅", sentiment: "positive", count: 1654 },
        { text: "手感高级", sentiment: "positive", count: 1432 },
        { text: "续航还行", sentiment: "neutral", count: 987 },
      ],
      "#2D5016": [
        { text: "徕卡影像", sentiment: "positive", count: 2134 },
        { text: "充电飞快", sentiment: "positive", count: 1876 },
        { text: "性价比高", sentiment: "positive", count: 1654 },
        { text: "屏幕护眼", sentiment: "positive", count: 1345 },
        { text: "系统简洁", sentiment: "positive", count: 1123 },
      ],
    };

    const reviews: Record<string, Review[]> = {
      "#C4B5A0": [
        {
          id: "1",
          rating: 5,
          title: "A18 Pro 真的强",
          content: "性能释放非常激进，重度游戏也不发烫。视频拍摄能力依然是行业标杆，防抖效果惊人。",
          author: "果粉小王",
          color: "沙漠钛金属",
          isVerified: true,
          likes: 456,
        },
      ],
      "#2D5016": [
        {
          id: "1",
          rating: 5,
          title: "徕卡色彩绝了",
          content: "徕卡经典模式下照片质感非常出色，有德味。90W充电半小时充满，续航也很给力。",
          author: "摄影爱好者",
          color: "经典黑银",
          isVerified: true,
          likes: 389,
        },
      ],
    };

    return {
      keywords: keywords[color] || DEFAULT_KEYWORDS,
      reviews: reviews[color] || DEFAULT_REVIEWS,
    };
  };

  const themeData = getDataByTheme(themeColor);

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题 */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">用户评价情感分析</h1>
          <p className="text-gray-400">关键词云 + 精选评价 + 推荐度展示</p>
        </motion.div>

        {/* 主题切换 */}
        <motion.div
          className="flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {themes.map((theme) => (
            <button
              key={theme.color}
              onClick={() => setThemeColor(theme.color)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                themeColor === theme.color
                  ? "bg-white/20 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              )}
            >
              {theme.name}
            </button>
          ))}
        </motion.div>

        {/* 情感分析组件 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ReviewSentimentAnalysis
            themeColor={themeColor}
            keywords={themeData.keywords}
            featuredReviews={themeData.reviews}
          />
        </motion.div>

        {/* 设计说明 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">关键词云</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                展示高频情感关键词
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                正面评价绿色标签
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                悬停可交互放大
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                最多显示 8 个关键词
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">精选评价</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                星级评分 + 标题 + 摘要
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                用户头像/名称/已购颜色
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                点赞数展示
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                支持多评价轮播切换
              </li>
            </ul>
          </div>
        </motion.div>

        {/* 功能总结 */}
        <motion.div
          className="bg-cyan-500/10 rounded-2xl border border-cyan-500/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">功能总结</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">98.5%</div>
              <div className="text-gray-400">推荐度</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">1.2万+</div>
              <div className="text-gray-400">总评价数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">8</div>
              <div className="text-gray-400">关键词</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">3+</div>
              <div className="text-gray-400">精选评价</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 动画包装组件
import { AnimatePresence } from "framer-motion";
