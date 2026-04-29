"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Calendar, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 模块四：右侧信息架构 - 品牌标识区
// ============================================================================

interface PhoneInfoPanelProps {
  /** 品牌名 */
  brand?: string;
  /** 型号名 */
  model?: string;
  /** 产品标语 */
  slogan?: string;
  /** 发布日期 */
  releaseDate?: string;
  /** 热度分数 (0-100) */
  heatScore?: number;
  /** 收藏状态 */
  isFavorite?: boolean;
  /** 收藏回调 */
  onFavorite?: (isFavorite: boolean) => void;
  /** 分享回调 */
  onShare?: () => void;
  /** 主题色 */
  themeColor?: string;
}

export function PhoneInfoPanel({
  brand = "SAMSUNG",
  model = "Galaxy S25 Ultra",
  slogan = "影像，由此不同",
  releaseDate = "2026.01.23",
  heatScore = 98.5,
  isFavorite: initialFavorite = false,
  onFavorite,
  onShare,
  themeColor = "#00D9FF",
}: PhoneInfoPanelProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isSharing, setIsSharing] = useState(false);

  const handleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavorite?.(newState);
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    // 尝试使用原生分享 API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brand} ${model}`,
          text: slogan,
          url: window.location.href,
        });
      } catch (err) {
        console.log("分享取消或失败");
      }
    }
    
    onShare?.();
    
    setTimeout(() => setIsSharing(false), 1000);
  };

  // 热度动画值
  const heatAnimation = {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  };

  return (
    <div className="space-y-6">
      {/* 品牌标识区 */}
      <div className="space-y-4">
        {/* 第一行：品牌 + 操作按钮 */}
        <div className="flex items-center justify-between">
          {/* 品牌 Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 品牌标志 */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{
                background: `linear-gradient(135deg, ${themeColor}30 0%, ${themeColor}10 100%)`,
                border: `1px solid ${themeColor}40`,
                color: themeColor,
              }}
            >
              {brand.charAt(0)}
            </div>
            <span
              className="text-sm font-semibold tracking-wider"
              style={{ color: themeColor }}
            >
              {brand}
            </span>
          </motion.div>

          {/* 操作按钮组 */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* 收藏按钮 */}
            <motion.button
              onClick={handleFavorite}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                "border backdrop-blur-sm",
                isFavorite
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              )}
              whileHover={{ scale: 1.02, boxShadow: isFavorite ? "0 4px 15px rgba(239, 68, 68, 0.3)" : `0 4px 15px ${themeColor}20` }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Heart
                className={cn("w-4 h-4 transition-all", isFavorite && "fill-current")}
              />
              <span>收藏</span>
            </motion.button>

            {/* 分享按钮 */}
            <motion.button
              onClick={handleShare}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                "border backdrop-blur-sm bg-white/5 border-white/10 text-gray-400",
                "hover:bg-white/10 hover:text-white",
                isSharing && "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
              )}
              whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${themeColor}20` }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Share2 className="w-4 h-4" />
              <span>{isSharing ? "已复制" : "分享"}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* 第二行：型号 */}
        <motion.h1
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {model}
        </motion.h1>

        {/* 第三行：标语 */}
        <motion.p
          className="text-lg"
          style={{ 
            color: themeColor,
            textShadow: `0 0 20px ${themeColor}30`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          "{slogan}"
        </motion.p>

        {/* 分隔线 */}
        <motion.div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, ${themeColor}50 0%, transparent 100%)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* 第四行：发布日期 + 热度 */}
        <motion.div
          className="flex items-center justify-between text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* 发布日期 */}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>发布日期：{releaseDate}</span>
          </div>

          {/* 热度 */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">热度</span>
            <motion.div
              animate={heatAnimation}
              className="relative"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              {/* 火焰光效 */}
              <div
                className="absolute inset-0 blur-md -z-10"
                style={{
                  background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)",
                }}
              />
            </motion.div>
            <span
              className="font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {heatScore.toFixed(1)}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function PhoneInfoPanelDemo() {
  const [currentTheme, setCurrentTheme] = useState("#00D9FF");

  const themes = [
    { name: "科技青", color: "#00D9FF" },
    { name: "钛蓝", color: "#A8C8EC" },
    { name: "钛灰", color: "#C5C0BC" },
    { name: "钛黑", color: "#1A1A1A" },
    { name: "钛雾金", color: "#E8D5B7" },
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
          <h1 className="text-3xl font-bold text-white">模块四：右侧信息架构重组</h1>
          <p className="text-gray-400">品牌标识区：品牌 + 型号 + 标语 + 操作按钮 + 发布信息</p>
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
              onClick={() => setCurrentTheme(theme.color)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                currentTheme === theme.color
                  ? "bg-white/20 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              )}
            >
              {theme.name}
            </button>
          ))}
        </motion.div>

        {/* 主展示区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：品牌标识区展示 */}
          <motion.div
            className="bg-white/5 rounded-3xl border border-white/10 p-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PhoneInfoPanel
              brand="SAMSUNG"
              model="Galaxy S25 Ultra"
              slogan="影像，由此不同"
              releaseDate="2026.01.23"
              heatScore={98.5}
              themeColor={currentTheme}
              onFavorite={(isFav) => console.log("收藏状态:", isFav)}
              onShare={() => console.log("分享")}
            />
          </motion.div>

          {/* 右侧：组件说明 */}
          <motion.div
            className="bg-white/5 rounded-3xl border border-white/10 p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">组件结构</h2>
                <div className="space-y-4">
                  <StructureItem
                    title="第一行：品牌标识 + 操作按钮"
                    items={[
                      "品牌 Logo（带主题色渐变背景）",
                      "品牌名称（大写字母）",
                      "收藏按钮（♡ 可切换状态）",
                      "分享按钮（⤴ 支持原生分享）",
                    ]}
                  />
                  <StructureItem
                    title="第二行：产品型号"
                    items={["大号粗体白色文字", "作为主要视觉焦点"]}
                  />
                  <StructureItem
                    title="第三行：产品标语"
                    items={["带引号的情感化文案", "主题色 + 发光效果"]}
                  />
                  <StructureItem
                    title="第四行：分隔线 + 元信息"
                    items={[
                      "渐变分隔线（主题色到透明）",
                      "发布日期（日历图标）",
                      "热度分数（火焰图标 + 动画）",
                    ]}
                  />
                </div>
              </div>

              <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                <p className="text-sm text-cyan-400">
                  提示：点击"分享"按钮会尝试调用系统原生分享 API，如果不支持则触发回调。
                  热度火焰图标有持续的呼吸动画效果。
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 多种品牌演示 */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white text-center">多品牌适配演示</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BrandDemo
              brand="Apple"
              model="iPhone 16 Pro"
              slogan="Pro. Beyond."
              themeColor="#C4B5A0"
              heatScore={99.2}
            />
            <BrandDemo
              brand="Xiaomi"
              model="15 Ultra"
              slogan="徕卡影像，巅峰之作"
              themeColor="#2D5016"
              heatScore={96.8}
            />
            <BrandDemo
              brand="OPPO"
              model="Find X8 Pro"
              slogan="未来影像，一触即达"
              themeColor="#1E40AF"
              heatScore={94.5}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 结构说明项
function StructureItem({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <h3 className="text-cyan-400 font-medium mb-2">{title}</h3>
      <ul className="space-y-1 text-sm text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 品牌演示卡片
function BrandDemo({
  brand,
  model,
  slogan,
  themeColor,
  heatScore,
}: {
  brand: string;
  model: string;
  slogan: string;
  themeColor: string;
  heatScore: number;
}) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <PhoneInfoPanel
        brand={brand}
        model={model}
        slogan={slogan}
        releaseDate="2026.01.23"
        heatScore={heatScore}
        themeColor={themeColor}
      />
    </div>
  );
}
