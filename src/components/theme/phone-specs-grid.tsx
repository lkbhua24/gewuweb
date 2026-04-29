"use client";

import { motion } from "framer-motion";
import { Smartphone, Cpu, Camera, Battery, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 核心参数速览组件 - 横向图标卡片
// ============================================================================

interface SpecItem {
  icon: React.ElementType;
  value: string;
  label: string;
}

interface PhoneSpecsGridProps {
  specs?: SpecItem[];
  themeColor?: string;
}

// 默认参数配置
const DEFAULT_SPECS: SpecItem[] = [
  { icon: Smartphone, value: '6.9"', label: "屏幕" },
  { icon: Cpu, value: "骁龙8", label: "至尊版" },
  { icon: Camera, value: "2亿", label: "像素" },
  { icon: Battery, value: "5000", label: "mAh" },
  { icon: Zap, value: "45W", label: "快充" },
];

export function PhoneSpecsGrid({
  specs = DEFAULT_SPECS,
  themeColor = "#00D9FF",
}: PhoneSpecsGridProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between gap-3">
        {specs.map((spec, index) => (
          <SpecCard
            key={spec.label}
            spec={spec}
            index={index}
            themeColor={themeColor}
          />
        ))}
      </div>
    </div>
  );
}

// 单个参数卡片
function SpecCard({
  spec,
  index,
  themeColor,
}: {
  spec: SpecItem;
  index: number;
  themeColor: string;
}) {
  const Icon = spec.icon;

  return (
    <motion.div
      className={cn(
        "flex-1 flex flex-col items-center gap-2 p-4 rounded-xl",
        "border backdrop-blur-sm cursor-pointer",
        "transition-all duration-300 ease-out"
      )}
      style={{
        backgroundColor: `${themeColor}08`, // 8% 主题色
        borderColor: `${themeColor}15`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        y: -4, // 上浮 4px
        boxShadow: `0 0 20px ${themeColor}30, 0 8px 30px ${themeColor}20`, // 主题色光晕 + 阴影
        borderColor: themeColor, // 1px 主题色边框
        borderWidth: "1px",
      }}
    >
      {/* 图标 */}
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: `${themeColor}15`,
          color: themeColor,
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>

      {/* 数值 */}
      <div className="text-center">
        <div className="text-lg font-bold text-white leading-tight">
          {spec.value}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">{spec.label}</div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function PhoneSpecsGridDemo() {
  const specsVariants = [
    {
      name: "三星 S25 Ultra",
      color: "#00D9FF",
      specs: [
        { icon: Smartphone, value: '6.9"', label: "屏幕" },
        { icon: Cpu, value: "骁龙8", label: "至尊版" },
        { icon: Camera, value: "2亿", label: "像素" },
        { icon: Battery, value: "5000", label: "mAh" },
        { icon: Zap, value: "45W", label: "快充" },
      ],
    },
    {
      name: "iPhone 16 Pro",
      color: "#C4B5A0",
      specs: [
        { icon: Smartphone, value: '6.3"', label: "屏幕" },
        { icon: Cpu, value: "A18", label: "Pro" },
        { icon: Camera, value: "4800", label: "万像素" },
        { icon: Battery, value: "3582", label: "mAh" },
        { icon: Zap, value: "27W", label: "快充" },
      ],
    },
    {
      name: "小米 15 Ultra",
      color: "#2D5016",
      specs: [
        { icon: Smartphone, value: '6.73"', label: "屏幕" },
        { icon: Cpu, value: "骁龙8", label: "至尊版" },
        { icon: Camera, value: "徕卡", label: "影像" },
        { icon: Battery, value: "5300", label: "mAh" },
        { icon: Zap, value: "90W", label: "快充" },
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
          <h1 className="text-3xl font-bold text-white">核心参数速览</h1>
          <p className="text-gray-400">5 个核心参数横向排列，图标 + 数字 + 标签</p>
        </motion.div>

        {/* 主展示 */}
        <motion.div
          className="bg-white/5 rounded-3xl border border-white/10 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-8">
            {specsVariants.map((variant, index) => (
              <div key={variant.name} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">{variant.name}</h2>
                <PhoneSpecsGrid specs={variant.specs} themeColor={variant.color} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* 设计规范 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">设计规范</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>5 个核心参数横向排列，等宽分布</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>每个卡片包含：图标 + 数值 + 标签</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>卡片背景：8% 主题色透明度</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>圆角：12px（rounded-xl）</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">交互动效</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>悬停时卡片上浮 4px</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>阴影加深并带有主题色光晕</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>边框颜色加深</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5" />
                <span>图标轻微放大（scale 1.1）</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* 入场动画说明 */}
        <motion.div
          className="bg-cyan-500/10 rounded-2xl border border-cyan-500/20 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-cyan-400">
            提示：卡片有依次入场的动画效果，每个卡片比前一个延迟 0.1s。
            悬停任意卡片查看上浮和阴影效果。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
