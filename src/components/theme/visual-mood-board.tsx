"use client";

import { motion } from "framer-motion";
import { ParticleBackground } from "./particle-background";
import { useDynamicTheme } from "@/hooks/use-dynamic-theme";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Droplets, 
  Layers, 
  CircleDot, 
  Hexagon, 
  Wind,
  GlassWater,
  Gauge
} from "lucide-react";

// ============================================================================
// 视觉情绪板组件
// 展示所有核心视觉元素：
// - 极光流动背景
// - 液态金属质感
// - 淡彩渐变卡片
// - 微粒子光效
// - 玻璃拟态导航
// - 环形进度条
// 
// 关键词：轻盈、通透、流动、精准、有温度
// ============================================================================

const MOOD_KEYWORDS = [
  { word: "轻盈", icon: Wind, desc: "如羽毛般无负担的视觉体验" },
  { word: "通透", icon: GlassWater, desc: "玻璃拟态的层次与深度" },
  { word: "流动", icon: Droplets, desc: "极光般的动态光效" },
  { word: "精准", icon: Gauge, desc: "数据可视化的精确表达" },
  { word: "有温度", icon: Sparkles, desc: "人文关怀的微交互设计" },
];

export function VisualMoodBoard() {
  const { scheme } = useDynamicTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080c14]">
      {/* 背景层：极光流动 */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 20% 40%, ${scheme.primary}15 0%, transparent 50%),
            radial-gradient(ellipse 100% 60% at 80% 60%, ${scheme.secondary}10 0%, transparent 40%),
            radial-gradient(ellipse 80% 100% at 50% 100%, ${scheme.primary}08 0%, transparent 50%),
            linear-gradient(180deg, #080c14 0%, #0a1020 50%, #080c14 100%)
          `,
        }}
      />

      {/* 微粒子光效 */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-60">
        <ParticleBackground themeColor={scheme.primary} density="high" speed={0.2} />
      </div>

      {/* 主内容 */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20">
        {/* 标题区 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            视觉情绪板
          </h1>
          <p className="text-lg text-gray-400">
            Visual Mood Board · 流光科技 · 色彩觉醒
          </p>
        </motion.div>

        {/* 关键词展示 */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {MOOD_KEYWORDS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.word}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-full",
                  "border backdrop-blur-md transition-all duration-500"
                )}
                style={{
                  backgroundColor: `${scheme.primary}10`,
                  borderColor: `${scheme.primary}30`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px ${scheme.primary}30`,
                }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: scheme.primary }}
                />
                <div>
                  <span className="text-white font-medium">{item.word}</span>
                  <span className="text-gray-500 text-sm ml-2 hidden sm:inline">
                    {item.desc}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 视觉元素网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. 极光流动背景 */}
          <MoodCard
            title="极光流动背景"
            subtitle="Aurora Flow Background"
            themeColor={scheme.primary}
            delay={0.4}
          >
            <div className="relative h-32 rounded-xl overflow-hidden">
              <div 
                className="absolute inset-0 animate-pulse"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      ${scheme.primary}40 0%, 
                      ${scheme.secondary}30 50%, 
                      transparent 100%
                    )
                  `,
                  filter: "blur(40px)",
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse at 30% 20%, ${scheme.primary}60 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 80%, ${scheme.secondary}40 0%, transparent 50%)
                  `,
                }}
              />
            </div>
          </MoodCard>

          {/* 2. 液态金属质感 */}
          <MoodCard
            title="液态金属质感"
            subtitle="Liquid Metal Texture"
            themeColor={scheme.primary}
            delay={0.5}
          >
            <div className="flex items-center justify-center h-32">
              <div 
                className="w-24 h-24 rounded-2xl relative overflow-hidden"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(255,255,255,0.4) 0%, 
                      rgba(255,255,255,0.1) 30%,
                      rgba(192,197,206,0.3) 50%,
                      rgba(255,255,255,0.1) 70%,
                      rgba(255,255,255,0.3) 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.5),
                    0 8px 32px rgba(0,0,0,0.3),
                    0 0 0 1px rgba(255,255,255,0.1)
                  `,
                }}
              >
                {/* 金属光泽流动 */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </MoodCard>

          {/* 3. 淡彩渐变卡片 */}
          <MoodCard
            title="淡彩渐变卡片"
            subtitle="Pastel Gradient Card"
            themeColor={scheme.primary}
            delay={0.6}
          >
            <div className="flex gap-3 h-32 items-center justify-center">
              {[0.3, 0.5, 0.7].map((opacity, i) => (
                <motion.div
                  key={i}
                  className="w-16 h-20 rounded-xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        ${scheme.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, 
                        ${scheme.secondary}${Math.round(opacity * 0.6 * 255).toString(16).padStart(2, '0')} 100%
                      )
                    `,
                    backdropFilter: "blur(10px)",
                  }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </MoodCard>

          {/* 4. 微粒子光效 */}
          <MoodCard
            title="微粒子光效"
            subtitle="Particle Light Effect"
            themeColor={scheme.primary}
            delay={0.7}
          >
            <div className="relative h-32 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: scheme.primary,
                    boxShadow: `0 0 6px ${scheme.primary}`,
                  }}
                  animate={{
                    x: [0, Math.cos(i * 30 * Math.PI / 180) * 40],
                    y: [0, Math.sin(i * 30 * Math.PI / 180) * 40],
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
              <Hexagon 
                className="w-12 h-12 opacity-30" 
                style={{ color: scheme.primary }}
              />
            </div>
          </MoodCard>

          {/* 5. 玻璃拟态导航 */}
          <MoodCard
            title="玻璃拟态导航"
            subtitle="Glassmorphism Navigation"
            themeColor={scheme.primary}
            delay={0.8}
          >
            <div className="h-32 flex flex-col items-center justify-center gap-3">
              <div 
                className="w-full max-w-[200px] px-4 py-3 rounded-2xl flex items-center justify-between"
                style={{
                  backgroundColor: `${scheme.primary}15`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${scheme.primary}30`,
                  boxShadow: `0 4px 24px ${scheme.primary}10`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${scheme.primary}30` }}
                  >
                    <CircleDot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">导航</span>
                </div>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: scheme.primary }}
                />
              </div>
            </div>
          </MoodCard>

          {/* 6. 环形进度条 */}
          <MoodCard
            title="环形进度条"
            subtitle="Circular Progress"
            themeColor={scheme.primary}
            delay={0.9}
          >
            <div className="h-32 flex items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  {/* 背景圆环 */}
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  {/* 进度圆环 */}
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={scheme.primary}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={214}
                    strokeDashoffset={214}
                    animate={{ strokeDashoffset: 40 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      filter: `drop-shadow(0 0 8px ${scheme.primary})`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">82%</span>
                </div>
              </div>
            </div>
          </MoodCard>
        </div>

        {/* 底部说明 */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div 
            className="inline-block px-8 py-4 rounded-2xl"
            style={{
              backgroundColor: `${scheme.primary}10`,
              border: `1px solid ${scheme.primary}20`,
            }}
          >
            <p className="text-gray-400 text-sm">
              以上视觉元素已全面应用于手机详情页设计
            </p>
            <p className="text-white mt-1">
              每一个像素都承载着对「轻盈、通透、流动、精准、有温度」的追求
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// 情绪卡片组件
// ============================================================================

interface MoodCardProps {
  title: string;
  subtitle: string;
  themeColor: string;
  delay: number;
  children: React.ReactNode;
}

function MoodCard({ title, subtitle, themeColor, delay, children }: MoodCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative p-6 rounded-3xl overflow-hidden",
        "border backdrop-blur-sm transition-all duration-500"
      )}
      style={{
        backgroundColor: `${themeColor}08`,
        borderColor: `${themeColor}15`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{
        borderColor: `${themeColor}40`,
        boxShadow: `0 0 40px ${themeColor}15`,
      }}
    >
      {/* 悬停光效 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${themeColor}20 0%, transparent 70%)`,
        }}
      />

      {/* 内容 */}
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function VisualMoodBoardDemo() {
  return (
    <div className="min-h-screen bg-[#080c14]">
      <VisualMoodBoard />
    </div>
  );
}
