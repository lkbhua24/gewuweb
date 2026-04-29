"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneAuraShowcase } from "@/components/theme/phone-aura-showcase";
import { DynamicThemeShowcase } from "@/components/theme/dynamic-theme-showcase";
import { ParticleShowcase } from "@/components/theme/particle-showcase";
import { Phone3DShowcaseDemo } from "@/components/theme/phone-3d-showcase";
import { PhoneInfoPanelDemo } from "@/components/theme/phone-info-panel";
import { PhoneSpecsGridDemo } from "@/components/theme/phone-specs-grid";
import { ScoreDashboardDemo } from "@/components/theme/score-dashboard";
import { PriceChartDemo } from "@/components/theme/price-chart";
import { PriceComparisonMatrixDemo } from "@/components/theme/price-comparison-matrix";
import { ReviewSentimentAnalysisDemo } from "@/components/theme/review-sentiment-analysis";
import { PurchaseDecisionBarDemo } from "@/components/theme/purchase-decision-bar";
import { PhoneDetailPageDemo } from "@/components/theme/phone-detail-page";
import { VisualMoodBoardDemo } from "@/components/theme/visual-mood-board";
import { cn } from "@/lib/utils";

// ============================================================================
// 主题系统演示总览页面
// ============================================================================

const MODULES = [
  {
    id: "mood-board",
    name: "情绪板",
    title: "视觉情绪板",
    description: "极光流动 · 液态金属 · 淡彩渐变 · 微粒子光效",
  },
  {
    id: "full-page",
    name: "完整页面",
    title: "完整手机详情页",
    description: "整合所有模块 + 时间线动画",
  },
  {
    id: "info-panel",
    name: "模块四",
    title: "信息架构重组",
    description: "品牌标识区 + 右侧信息区",
  },
  {
    id: "purchase-decision",
    name: "购买决策",
    title: "购买决策入口",
    description: "底部购买栏 + 降价提醒 + 以旧换新",
  },
  {
    id: "review-sentiment",
    name: "评价分析",
    title: "用户评价情感分析",
    description: "关键词云 + 精选评价",
  },
  {
    id: "price-matrix",
    name: "比价矩阵",
    title: "多平台比价矩阵",
    description: "全网渠道价格对比",
  },
  {
    id: "price-chart",
    name: "价格走势",
    title: "价格走势折线图",
    description: "官方价 + 二手均价趋势",
  },
  {
    id: "score-dashboard",
    name: "评分仪表",
    title: "综合评分仪表盘",
    description: "环形评分 + 维度进度条",
  },
  {
    id: "specs-grid",
    name: "核心参数",
    title: "核心参数速览",
    description: "横向图标卡片展示 5 个核心参数",
  },
  {
    id: "phone-3d",
    name: "模块三",
    title: "3D 手机展示区",
    description: "空间布局：3D 模型 + 颜色选择器 + 快捷操作",
  },
  {
    id: "particle",
    name: "模块二",
    title: "Canvas 粒子波纹背景",
    description: "三层视觉架构：动态渐变网格 + 粒子星云 + 光晕脉冲",
  },
  {
    id: "dynamic-theme",
    name: "模块一",
    title: "动态主题色系统",
    description: "色彩提取 → 情绪分析 → 动态配色方案生成",
  },
  {
    id: "aura",
    name: "原有",
    title: "Aura 主题系统",
    description: "基础氛围色晕染效果",
  },
];

export default function ThemeDemoPage() {
  const [activeModule, setActiveModule] = useState("info-panel");

  return (
    <div className="min-h-screen bg-[#080c14]">
      {/* 模块导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">主题系统演示</h1>
            <div className="flex items-center gap-2">
              {MODULES.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    activeModule === module.id
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                      : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
                  )}
                >
                  {module.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 模块内容 */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {activeModule === "mood-board" && (
            <motion.div
              key="mood-board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VisualMoodBoardDemo />
            </motion.div>
          )}

          {activeModule === "full-page" && (
            <motion.div
              key="full-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PhoneDetailPageDemo />
            </motion.div>
          )}

          {activeModule === "info-panel" && (
            <motion.div
              key="info-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PhoneInfoPanelDemo />
            </motion.div>
          )}

          {activeModule === "purchase-decision" && (
            <motion.div
              key="purchase-decision"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PurchaseDecisionBarDemo />
            </motion.div>
          )}

          {activeModule === "review-sentiment" && (
            <motion.div
              key="review-sentiment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewSentimentAnalysisDemo />
            </motion.div>
          )}

          {activeModule === "price-matrix" && (
            <motion.div
              key="price-matrix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PriceComparisonMatrixDemo />
            </motion.div>
          )}

          {activeModule === "price-chart" && (
            <motion.div
              key="price-chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PriceChartDemo />
            </motion.div>
          )}

          {activeModule === "score-dashboard" && (
            <motion.div
              key="score-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScoreDashboardDemo />
            </motion.div>
          )}

          {activeModule === "specs-grid" && (
            <motion.div
              key="specs-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PhoneSpecsGridDemo />
            </motion.div>
          )}

          {activeModule === "phone-3d" && (
            <motion.div
              key="phone-3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Phone3DShowcaseDemo />
            </motion.div>
          )}

          {activeModule === "particle" && (
            <motion.div
              key="particle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ParticleShowcase />
            </motion.div>
          )}

          {activeModule === "dynamic-theme" && (
            <motion.div
              key="dynamic-theme"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DynamicThemeShowcase />
            </motion.div>
          )}

          {activeModule === "aura" && (
            <motion.div
              key="aura"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  原有 Aura 主题系统
                </h2>
                <PhoneAuraShowcase />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
