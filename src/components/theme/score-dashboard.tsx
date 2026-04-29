"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// 综合评分仪表盘组件
// ============================================================================

interface ScoreDimension {
  name: string;
  score: number;
  maxScore?: number;
}

interface ScoreDashboardProps {
  /** 综合评分 */
  totalScore?: number;
  /** 满分 */
  maxScore?: number;
  /** 各维度评分 */
  dimensions?: ScoreDimension[];
  /** 评价用户数 */
  reviewCount?: number;
  /** 算法版本 */
  algorithmVersion?: string;
  /** 主题色 */
  themeColor?: string;
  /** 是否触发动画 */
  animateProgress?: boolean;
}

// 默认维度数据
const DEFAULT_DIMENSIONS: ScoreDimension[] = [
  { name: "性能", score: 9.7 },
  { name: "影像", score: 9.7 },
  { name: "屏幕", score: 9.8 },
  { name: "续航", score: 9.0 },
  { name: "质感", score: 9.6 },
  { name: "体验", score: 9.6 },
];

export function ScoreDashboard({
  totalScore = 9.7,
  maxScore = 10,
  dimensions = DEFAULT_DIMENSIONS,
  reviewCount = 100000,
  algorithmVersion = "v3.2",
  themeColor = "#00D9FF",
  animateProgress = true,
}: ScoreDashboardProps) {
  // 格式化用户数
  const formatReviewCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(0)} 万+`;
    }
    return count.toString();
  };

  // 计算环形进度
  const circumference = 2 * Math.PI * 70; // 半径70
  const progress = (totalScore / maxScore) * circumference;

  return (
    <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-6">
      {/* 标题 */}
      <motion.h3
        className="text-lg font-semibold text-white mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        综合评分
      </motion.h3>

      {/* 主要内容区 */}
      <div className="flex gap-8">
        {/* 左侧：环形评分 */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative w-40 h-40">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 160 160"
            >
              {/* 定义渐变 */}
              <defs>
                <linearGradient
                  id={`scoreGradient-${themeColor.replace("#", "")}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={themeColor} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={themeColor} />
                </linearGradient>
              </defs>

              {/* 背景圆环 */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />

              {/* 进度圆环 */}
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={`url(#scoreGradient-${themeColor.replace("#", "")})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: animateProgress ? circumference - progress : circumference }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              />
            </svg>

            {/* 中心分数 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-4xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {totalScore.toFixed(1)}
              </motion.span>
              <motion.span
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                /{maxScore}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* 右侧：维度进度条 */}
        <div className="flex-1 space-y-4">
          {dimensions.map((dim, index) => (
            <DimensionBar
              key={dim.name}
              dimension={dim}
              index={index}
              themeColor={themeColor}
              maxScore={maxScore}
              animateProgress={animateProgress}
            />
          ))}
        </div>
      </div>

      {/* 底部信息 */}
      <motion.div
        className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        基于 {formatReviewCount(reviewCount)} 用户评价 | 算法 {algorithmVersion}
      </motion.div>
    </div>
  );
}

// 单个维度进度条
function DimensionBar({
  dimension,
  index,
  themeColor,
  maxScore,
  animateProgress = true,
}: {
  dimension: ScoreDimension;
  index: number;
  themeColor: string;
  maxScore: number;
  animateProgress?: boolean;
}) {
  const percentage = (dimension.score / maxScore) * 100;

  // 根据分数决定颜色深浅
  const getBarColor = (score: number) => {
    if (score >= 9.5) return themeColor; // 高分：高亮
    if (score >= 9.0) return `${themeColor}CC`; // 较高分：稍淡
    if (score >= 8.0) return `${themeColor}99`; // 中等：淡化
    return `${themeColor}66`; // 低分：更淡
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
    >
      {/* 维度名称 */}
      <span className="text-sm text-gray-400 w-10 flex-shrink-0">
        {dimension.name}
      </span>

      {/* 分数 */}
      <span className="text-sm font-medium text-white w-10 text-right">
        {dimension.score.toFixed(1)}
      </span>

      {/* 进度条容器 */}
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: getBarColor(dimension.score),
          }}
          initial={{ width: 0 }}
          animate={{ width: animateProgress ? `${percentage}%` : 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>

      {/* 视觉指示 */}
      <div className="flex gap-0.5">
        {[...Array(8)].map((_, i) => {
          const threshold = (i + 1) * (maxScore / 8);
          const isFilled = dimension.score >= threshold;
          return (
            <div
              key={i}
              className={cn(
                "w-1.5 h-3 rounded-sm transition-all duration-300",
                isFilled ? "opacity-100" : "opacity-20"
              )}
              style={{
                backgroundColor: isFilled ? themeColor : "rgba(255,255,255,0.3)",
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function ScoreDashboardDemo() {
  const demoData = [
    {
      name: "三星 S25 Ultra",
      color: "#00D9FF",
      score: 9.7,
      dimensions: [
        { name: "性能", score: 9.7 },
        { name: "影像", score: 9.7 },
        { name: "屏幕", score: 9.8 },
        { name: "续航", score: 9.0 },
        { name: "质感", score: 9.6 },
        { name: "体验", score: 9.6 },
      ],
    },
    {
      name: "iPhone 16 Pro",
      color: "#C4B5A0",
      score: 9.5,
      dimensions: [
        { name: "性能", score: 9.9 },
        { name: "影像", score: 9.4 },
        { name: "屏幕", score: 9.7 },
        { name: "续航", score: 8.8 },
        { name: "质感", score: 9.8 },
        { name: "体验", score: 9.5 },
      ],
    },
    {
      name: "小米 15 Ultra",
      color: "#2D5016",
      score: 9.3,
      dimensions: [
        { name: "性能", score: 9.6 },
        { name: "影像", score: 9.8 },
        { name: "屏幕", score: 9.5 },
        { name: "续航", score: 9.2 },
        { name: "质感", score: 9.0 },
        { name: "体验", score: 9.1 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">综合评分仪表盘</h1>
          <p className="text-gray-400">
            左侧环形评分 + 右侧维度进度条，去除雷达图拥挤感
          </p>
        </motion.div>

        {/* 演示卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {demoData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <ScoreDashboard
                totalScore={item.score}
                dimensions={item.dimensions}
                themeColor={item.color}
                reviewCount={100000 + index * 50000}
              />
            </motion.div>
          ))}
        </div>

        {/* 设计说明 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">左侧环形评分</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                SVG 绘制，半径 70px
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                主题色渐变填充（透明到实色）
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                1.2s 动画绘制进度
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                中心显示分数 / 满分
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">右侧维度进度</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                6 个核心维度横向排列
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                进度条颜色根据分数变化
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                高分高亮，低分淡化
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                右侧 8 段视觉指示器
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
