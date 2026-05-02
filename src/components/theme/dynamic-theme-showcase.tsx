"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  useDynamicTheme,
  useModelColors,
  type ColorEmotion,
  type ColorScheme,
} from "@/hooks/use-dynamic-theme";
import { GALAXY_S25_ULTRA_COLORS, PHONE_MODEL_COLORS, type DynamicThemeRules } from "@/lib/color-theme";
import { cn } from "@/lib/utils";

// ============================================================================
// 动态主题系统展示组件 - 三星 S25 Ultra 配色映射演示
// ============================================================================

const TEMPERATURE_ICONS = {
  warm: "☀️",
  cool: "❄️",
  neutral: "⭕",
};

const TEMPERATURE_LABELS = {
  warm: "暖色调",
  cool: "冷色调",
  neutral: "中性调",
};

const SATURATION_LABELS = {
  saturated: "饱和",
  muted: "淡雅",
  monochrome: "单色",
};

export function DynamicThemeShowcase() {
  const [selectedModel, setSelectedModel] = useState<string>("samsung-galaxy-s25-ultra");
  const [selectedColor, setSelectedColor] = useState<string>("钛灰");
  const previewRef = useRef<HTMLDivElement>(null);

  // 使用动态主题 Hook（启用平滑过渡）
  const {
    colorScheme,
    enhancedScheme,
    emotion,
    scheme,
    dynamicRules,
    cssVars,
    breathingKeyframes,
    getStyleObject,
    getTransitionStyle,
    applyToElement,
  } = useDynamicTheme({
    modelId: selectedModel,
    bodyColorName: selectedColor,
    enableTransition: true,
    transitionDuration: 800,
    isDarkMode: true,
  });

  // 应用 CSS 变量到预览区域
  useEffect(() => {
    if (previewRef.current) {
      applyToElement(previewRef.current);
    }
  }, [applyToElement, selectedColor]);

  // 获取所有配色方案
  const { colorSchemes } = useModelColors({ modelId: selectedModel });

  // 当前模型配置
  const modelConfig = PHONE_MODEL_COLORS[selectedModel];

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      {/* 注入呼吸动画样式 */}
      <style>{breathingKeyframes}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题区域 */}
        <div className="text-center space-y-3">
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            模块一：动态主题色系统
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            色彩提取 → 情绪分析 → 动态配色方案生成 → 分层应用规则
          </motion.p>
          <motion.div
            className="flex justify-center gap-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
              切换颜色：800ms 平滑过渡
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
              色彩呼吸动效
            </span>
          </motion.div>
        </div>

        {/* 机型选择器 */}
        <motion.div
          className="flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Object.entries(PHONE_MODEL_COLORS).map(([id, config]) => (
            <button
              key={id}
              onClick={() => {
                setSelectedModel(id);
                setSelectedColor(config.colors.find((c) => c.isDefault)?.colorName || config.colors[0].colorName);
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedModel === id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              )}
            >
              {config.brand} {config.model}
            </button>
          ))}
        </motion.div>

        {/* 颜色选择器 */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {modelConfig?.colors.map((color) => (
            <button
              key={color.colorName}
              onClick={() => setSelectedColor(color.colorName)}
              className={cn(
                "group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all",
                selectedColor === color.colorName
                  ? "bg-white/10 ring-2 ring-cyan-500/50"
                  : "hover:bg-white/5"
              )}
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                style={{ backgroundColor: color.hex }}
              />
              <span
                className={cn(
                  "text-xs",
                  selectedColor === color.colorName ? "text-white" : "text-gray-500"
                )}
              >
                {color.colorName}
              </span>
            </button>
          ))}
        </motion.div>

        {/* 主展示区 - 左右分栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：预览区域（应用动态主题） */}
          <motion.div
            ref={previewRef}
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              ...getStyleObject(),
              ...getTransitionStyle(),
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-8 space-y-6">
              {/* 模拟手机详情页头部 - 使用动态规则 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 品牌 Logo - 使用光效层 */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{
                      background: dynamicRules.glow.particle,
                      color: dynamicRules.background.base,
                      boxShadow: dynamicRules.glow.shadow,
                    }}
                  >
                    S
                  </div>
                  <div>
                    {/* 标题 - 使用文字层 100% */}
                    <div style={{ color: dynamicRules.text.primary }} className="text-lg font-bold">
                      {modelConfig?.brand} {modelConfig?.model}
                    </div>
                    {/* 副标题 - 使用文字层 60% */}
                    <div style={{ color: dynamicRules.text.secondary }} className="text-sm">
                      {selectedColor}
                    </div>
                  </div>
                </div>
                {/* 价格标签 - 使用高亮层 */}
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: dynamicRules.highlight.tag,
                    color: dynamicRules.highlight.tagText,
                  }}
                >
                  ¥9,999
                </div>
              </div>

              {/* 模拟手机视觉区 - 使用背景层 + 光效层 */}
              <div
                className="aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: dynamicRules.background.overlay,
                  border: dynamicRules.card.border,
                  backdropFilter: dynamicRules.card.blur,
                }}
              >
                {/* 粒子效果背景 */}
                <ParticleBackground particleColor={dynamicRules.glow.particle} />
                
                {/* 手机模型 */}
                <motion.div
                  className="w-32 h-56 rounded-3xl relative z-10"
                  style={{
                    background: colorScheme.bodyColor,
                    boxShadow: dynamicRules.glow.shadow,
                  }}
                  animate={{
                    rotateY: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* 模拟操作按钮 - 使用高亮层 */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl font-medium transition-transform active:scale-95"
                  style={{
                    background: dynamicRules.highlight.button,
                    color: dynamicRules.highlight.buttonText,
                  }}
                >
                  立即购买
                </button>
                <button
                  className="px-4 py-3 rounded-xl font-medium border transition-all hover:opacity-80"
                  style={{
                    borderColor: dynamicRules.glow.border,
                    color: dynamicRules.text.primary,
                  }}
                >
                  收藏
                </button>
              </div>

              {/* 模拟参数 - 使用卡片层 */}
              <div className="grid grid-cols-3 gap-3">
                {["骁龙8 Gen4", "2亿像素", "5000mAh"].map((spec) => (
                  <div
                    key={spec}
                    className="p-3 rounded-xl text-center"
                    style={{
                      background: dynamicRules.card.background,
                      border: dynamicRules.card.border,
                      backdropFilter: dynamicRules.card.blur,
                    }}
                  >
                    <div style={{ color: dynamicRules.text.secondary }} className="text-xs">
                      核心参数
                    </div>
                    <div style={{ color: dynamicRules.text.primary }} className="text-sm font-medium">
                      {spec}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右侧：配色分析 */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* 情绪分析卡片 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">色彩情绪分析</h3>
              <EmotionAnalysis emotion={emotion} />
            </div>

            {/* 动态应用规则卡片 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">动态应用规则</h3>
              <DynamicRulesDisplay rules={dynamicRules} />
            </div>

            {/* CSS 变量预览 */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">CSS 变量</h3>
              <CssVarsPreview cssVars={cssVars} />
            </div>
          </motion.div>
        </div>

        {/* S25 Ultra 配色映射表 */}
        {selectedModel === "samsung-galaxy-s25-ultra" && (
          <motion.div
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              三星 Galaxy S25 Ultra 配色映射表
            </h3>
            <ColorMappingTable />
          </motion.div>
        )}

        {/* 所有配色预览 */}
        <motion.div
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {modelConfig?.brand} {modelConfig?.model} 所有配色预览
          </h3>
          <AllColorsPreview colorSchemes={colorSchemes} />
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// 粒子背景组件
// ============================================================================

function ParticleBackground({ particleColor }: { particleColor: string }) {
  const [mounted, setMounted] = useState(true);

  const particles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      left: `${(i * 7.7) % 100}%`,
      top: `${(i * 13.3) % 100}%`,
      duration: 3 + (i % 3),
      delay: (i % 5) * 0.4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {mounted && particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: particleColor,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 子组件
// ============================================================================

function EmotionAnalysis({ emotion }: { emotion: ColorEmotion }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 rounded-xl p-4">
        <div className="text-3xl mb-2">{TEMPERATURE_ICONS[emotion.temperature]}</div>
        <div className="text-sm text-gray-400">冷暖属性</div>
        <div className="text-lg font-medium text-white">
          {TEMPERATURE_LABELS[emotion.temperature]}
        </div>
      </div>
      <div className="bg-white/5 rounded-xl p-4">
        <div className="text-sm text-gray-400 mb-1">饱和度</div>
        <div className="text-lg font-medium text-white">
          {SATURATION_LABELS[emotion.saturation]}
        </div>
        <div className="text-sm text-gray-400 mt-2">亮度</div>
        <div className="text-lg font-medium text-white capitalize">
          {emotion.brightness === "bright" ? "明亮" : emotion.brightness === "medium" ? "中等" : "暗沉"}
        </div>
      </div>
      <div className="col-span-2 bg-white/5 rounded-xl p-4">
        <div className="text-sm text-gray-400 mb-2">情绪标签</div>
        <div className="flex flex-wrap gap-2">
          {emotion.moodTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DynamicRulesDisplay({ rules }: { rules: DynamicThemeRules }) {
  const layers = [
    {
      name: "背景层",
      desc: "主色 15% 透明度 + 基底",
      style: {
        background: rules.background.overlay,
      },
    },
    {
      name: "卡片层",
      desc: "主色 8% 透明度 + 模糊 20px",
      style: {
        background: rules.card.background,
        backdropFilter: rules.card.blur,
        border: rules.card.border,
      },
    },
    {
      name: "文字层",
      desc: "100% 标题 / 60% 正文",
      style: {
        color: rules.text.primary,
      },
      textSecondary: rules.text.secondary,
    },
    {
      name: "高亮层",
      desc: "辅色按钮、标签、进度条",
      style: {
        background: rules.highlight.button,
        color: rules.highlight.buttonText,
      },
    },
    {
      name: "光效层",
      desc: "高光色粒子、波纹、发光",
      style: {
        background: rules.glow.particle,
        boxShadow: rules.glow.shadow,
      },
    },
  ];

  return (
    <div className="space-y-3">
      {layers.map((layer) => (
        <div key={layer.name} className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-medium"
            style={layer.style}
          >
            {layer.name.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white">{layer.name}</div>
            <div className="text-xs text-gray-500">{layer.desc}</div>
          </div>
          {'textSecondary' in layer && layer.textSecondary && (
            <div
              className="text-xs px-2 py-1 rounded"
              style={{ color: layer.textSecondary }}
            >
              60%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CssVarsPreview({ cssVars }: { cssVars: Record<string, string> }) {
  // 只显示关键的动态主题变量
  const keyVars = Object.entries(cssVars).filter(([key]) =>
    key.startsWith("--dt-") || key.startsWith("--phone-")
  );

  return (
    <div className="bg-black/50 rounded-xl p-4 font-mono text-xs overflow-x-auto">
      <pre className="text-gray-400">
        {`:root {
${keyVars
  .map(([key, value]) => `  ${key}: ${value};`)
  .join("\n")}
}`}
      </pre>
    </div>
  );
}

function ColorMappingTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">机身颜色</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">页面主色调</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">背景渐变</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">点缀色</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">情绪标签</th>
          </tr>
        </thead>
        <tbody>
          {GALAXY_S25_ULTRA_COLORS.map((color) => (
            <tr key={color.bodyColorName} className="border-b border-white/5">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: color.bodyColor }}
                  />
                  <span className="text-white">{color.bodyColorName}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <code className="text-cyan-400">{color.pagePrimary}</code>
              </td>
              <td className="py-3 px-4">
                <div
                  className="h-6 rounded-lg w-24"
                  style={{ background: color.backgroundGradient }}
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color.accentColor }}
                  />
                  <code className="text-xs text-gray-400">{color.accentColor}</code>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1">
                  {color.moodTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AllColorsPreview({
  colorSchemes,
}: {
  colorSchemes: { bodyColorName: string; bodyColor: string; scheme: ColorScheme; emotion: ColorEmotion }[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {colorSchemes.map((scheme, index) => (
        <motion.div
          key={scheme.bodyColorName}
          className="rounded-2xl overflow-hidden border border-white/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* 配色预览 */}
          <div
            className="h-24 p-4"
            style={{
              background: `linear-gradient(135deg, ${scheme.scheme.backgroundFrom} 0%, ${scheme.scheme.backgroundTo} 100%)`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full border border-white/30"
                style={{ backgroundColor: scheme.bodyColor }}
              />
              <span style={{ color: scheme.scheme.textPrimary }} className="text-sm font-medium">
                {scheme.bodyColorName}
              </span>
            </div>
            <div
              className="inline-block px-2 py-0.5 rounded text-xs"
              style={{
                background: scheme.scheme.primary,
                color: scheme.scheme.backgroundFrom,
              }}
            >
              主色
            </div>
          </div>

          {/* 情绪标签 */}
          <div className="p-3 bg-white/5">
            <div className="flex flex-wrap gap-1">
              {scheme.emotion.moodTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs bg-white/10 text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>{TEMPERATURE_ICONS[scheme.emotion.temperature]}</span>
              <span>{SATURATION_LABELS[scheme.emotion.saturation]}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
