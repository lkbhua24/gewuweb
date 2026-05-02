"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PhoneInfoPanel } from "./phone-info-panel";
import { PhoneSpecsGrid } from "./phone-specs-grid";
import { ScoreDashboard } from "./score-dashboard";
import { PriceChart } from "./price-chart";
import { PriceComparisonMatrix } from "./price-comparison-matrix";
import { ReviewSentimentAnalysis } from "./review-sentiment-analysis";
import { PurchaseDecisionBar } from "./purchase-decision-bar";
import { MobileInfoAccordion } from "./mobile-info-accordion";
import { useDynamicTheme } from "@/hooks/use-dynamic-theme";
import { useThemeCssVariables } from "@/hooks/use-theme-css-variables";
import { cn } from "@/lib/utils";
import { Smartphone, BarChart3, TrendingUp, ShoppingCart, MessageSquare, Award, Heart, Share2, Scale } from "lucide-react";

const ParticleBackground = dynamic(
  () => import("./particle-background").then((mod) => ({ default: mod.ParticleBackground })),
  { ssr: false }
);

const Phone3DShowcase = dynamic(
  () => import("./phone-3d-showcase").then((mod) => ({ default: mod.Phone3DShowcase })),
  { ssr: false }
);

// ============================================================================
// 完整手机详情页 - 响应式适配
// 断点：
// - Desktop (≥1280px): 左右分栏 40:60
// - Tablet (768-1279px): 上下布局，手机模型置顶
// - Mobile (<768px): 单列布局，信息区折叠为手风琴
// ============================================================================

interface PhoneDetailPageProps {
  brand?: string;
  model?: string;
  tagline?: string;
  releaseDate?: string;
  startingPrice?: string;
}

// 动画时间配置
const TIMELINE = {
  background: 0,
  particles: 200,
  phoneModel: 400,
  infoPanel: 600,
  specsGrid: 700,
  scoreDashboard: 800,
  priceChart: 900,
  priceMatrix: 1000,
  reviews: 1100,
  progressBars: 1200,
};

// 视口进入动画变体
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function PhoneDetailPage({
  brand = "Samsung",
  model = "Galaxy S25 Ultra",
  tagline = "钛金属设计 · 2亿像素",
  releaseDate = "2025-01-22",
  startingPrice = "¥9,699 起",
}: PhoneDetailPageProps) {
  const { currentTheme, setColorByName } = useDynamicTheme();

  // 动态更新 CSS 变量
  useThemeCssVariables({
    primary: currentTheme.primary,
    secondary: currentTheme.secondary,
  });

  const isLoaded = true;
  const [showParticles, setShowParticles] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showInfoModules, setShowInfoModules] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompare, setIsCompare] = useState(false);

  // 右侧内容区域滚动容器的 ref
  const contentScrollRef = useRef<HTMLElement>(null);

  const scoreDimensions = useMemo(() => [
    { name: "性能", score: 9.2 },
    { name: "影像", score: 9.5 },
    { name: "屏幕", score: 9.0 },
    { name: "续航", score: 8.5 },
    { name: "质感", score: 8.8 },
    { name: "体验", score: 7.5 },
  ], []);

  // 页面加载时按时间线触发各模块
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowParticles(true), TIMELINE.particles),
      setTimeout(() => setShowPhone(true), TIMELINE.phoneModel),
      setTimeout(() => setShowInfoModules(true), TIMELINE.infoPanel),
      setTimeout(() => setAnimateChart(true), TIMELINE.priceChart),
      setTimeout(() => setAnimateProgress(true), TIMELINE.progressBars),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // 将页面滚轮事件传递给右侧内容区域
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1280) return;

      const contentEl = contentScrollRef.current;
      if (!contentEl) return;

      e.preventDefault();
      contentEl.scrollTop += e.deltaY;
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);

  const handleColorChange = useCallback((color: { id: string; name: string; color: string }) => {
    setColorByName(color.name);
  }, [setColorByName]);

  // 动画变体
  const backgroundVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const phoneVariants: Variants = {
    hidden: { opacity: 0, y: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const infoModuleVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, delay: delay * 0.1, ease: "easeOut" as const },
    }),
  };

  // 移动端手风琴数据
  const accordionItems = [
    {
      id: "overview",
      title: "产品概览",
      icon: Smartphone,
      content: (
        <PhoneInfoPanel
          brand={brand}
          model={model}
          slogan={tagline}
          releaseDate={releaseDate}
        />
      ),
    },
    {
      id: "specs",
      title: "核心参数",
      icon: BarChart3,
      content: <PhoneSpecsGrid themeColor={currentTheme.primary} />,
    },
    {
      id: "score",
      title: "综合评分",
      icon: Award,
      content: (
        <ScoreDashboard
          totalScore={8.9}
          themeColor={currentTheme.primary}
          animateProgress={animateProgress}
          dimensions={scoreDimensions}
        />
      ),
    },
    {
      id: "price",
      title: "价格走势",
      icon: TrendingUp,
      content: <PriceChart themeColor={currentTheme.primary} animateOnLoad={animateChart} />,
    },
    {
      id: "comparison",
      title: "多平台比价",
      icon: ShoppingCart,
      content: <PriceComparisonMatrix themeColor={currentTheme.primary} />,
    },
    {
      id: "reviews",
      title: "用户评价",
      icon: MessageSquare,
      content: <ReviewSentimentAnalysis themeColor={currentTheme.primary} />,
    },
  ];

  return (
    <div className="phone-detail-page relative min-h-screen overflow-x-hidden">
      {/* 注意：全局导航栏由 layout.tsx 中的 Header 组件提供 */}

      {/* ==================== 背景层 ==================== */}
      <motion.div
        className="fixed inset-0 z-0"
        variants={backgroundVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${currentTheme.primary}20, transparent),
            radial-gradient(ellipse 60% 40% at 80% 80%, ${currentTheme.secondary}15, transparent),
            linear-gradient(180deg, #080c14 0%, #0a0f18 50%, #080c14 100%)
          `,
        }}
      />

      <AnimatePresence>
        {showParticles && (
          <motion.div
            className="fixed inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ParticleBackground primaryColor={currentTheme.primary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 主内容区 ==================== */}
      <main className="relative z-20 xl:fixed xl:inset-0 xl:left-[210px] xl:top-0 xl:right-0 xl:bottom-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 h-full">

        {/*
          响应式布局：
          - Mobile (<768px): 单列，手机在上，手风琴在下
          - Tablet (768-1279px): 上下布局，手机在上
          - Desktop (≥1280px): 左右分栏 40:60，右侧可滚动
        */}
        <div className="flex flex-col xl:flex-row xl:gap-[58px] h-full">

          {/* ==================== 手机展示区（左侧） ==================== */}
          <motion.section
            className={cn(
              "w-full xl:w-[40%]",
              "xl:flex xl:flex-col xl:justify-center",
              "mb-8 xl:mb-0 z-10"
            )}
            variants={phoneVariants}
            initial="hidden"
            animate={showPhone ? "visible" : "hidden"}
          >
            <div className="xl:-ml-[20px]">
              <Phone3DShowcase
                brand={brand}
                model={model}
                onColorChange={handleColorChange}
              />
            </div>
          </motion.section>

          {/* ==================== 信息架构区（右侧滚动区） ==================== */}
          <div className="w-full xl:w-[60%] xl:flex-1 xl:h-full xl:overflow-hidden">
          <section
            ref={contentScrollRef}
            className="w-full xl:h-full xl:overflow-y-scroll phone-detail-content-scroll xl:pr-[17px] xl:-mr-[17px]"
          >
            {/* 右上角操作按钮 */}
            <motion.div
              className="hidden md:flex items-center justify-end gap-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.button
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                  isFavorite
                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                <span>收藏</span>
              </motion.button>
              <motion.button
                onClick={() => console.log("分享")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </motion.button>
              <motion.button
                onClick={() => setIsCompare(!isCompare)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                  isCompare
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Scale className="w-4 h-4" />
                <span>对比</span>
              </motion.button>
            </motion.div>

            {/* Desktop & Tablet: 直接展示所有模块 */}
            <div className="hidden md:block space-y-8">
              {/* 品牌标识 */}
              <motion.div
                id="overview"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUpVariants}
              >
                <motion.div
                  custom={0}
                  variants={infoModuleVariants}
                  initial="hidden"
                  animate={showInfoModules ? "visible" : "hidden"}
                >
                  <PhoneInfoPanel
                    brand={brand}
                    model={model}
                    slogan={tagline}
                    releaseDate={releaseDate}
                  />
                </motion.div>
              </motion.div>

              {/* 核心参数 */}
              <motion.div
                id="specs"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUpVariants}
              >
                <motion.div
                  custom={1}
                  variants={infoModuleVariants}
                  initial="hidden"
                  animate={showInfoModules ? "visible" : "hidden"}
                >
                  <PhoneSpecsGrid themeColor={currentTheme.primary} />
                </motion.div>
              </motion.div>

              {/* 综合评分 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUpVariants}
                style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }}
              >
                <motion.div
                  custom={2}
                  variants={infoModuleVariants}
                  initial="hidden"
                  animate={showInfoModules ? "visible" : "hidden"}
                >
                  <ScoreDashboard
                    totalScore={8.9}
                    themeColor={currentTheme.primary}
                    animateProgress={animateProgress}
                    dimensions={scoreDimensions}
                  />
                </motion.div>
              </motion.div>

              {/* 价格走势 */}
              <motion.div
                id="price"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUpVariants}
                style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
              >
                <motion.div
                  custom={3}
                  variants={infoModuleVariants}
                  initial="hidden"
                  animate={showInfoModules ? "visible" : "hidden"}
                >
                  <PriceChart themeColor={currentTheme.primary} animateOnLoad={animateChart} />
                </motion.div>
              </motion.div>

              {/* 多平台比价 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUpVariants}
                style={{ contentVisibility: "auto", containIntrinsicSize: "0 350px" }}
              >
                <motion.div
                  custom={4}
                  variants={infoModuleVariants}
                  initial="hidden"
                  animate={showInfoModules ? "visible" : "hidden"}
                >
                  <PriceComparisonMatrix themeColor={currentTheme.primary} />
                </motion.div>
              </motion.div>

              {/* 用户评价 */}
              <motion.div
                id="reviews"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUpVariants}
                style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
              >
                <motion.div
                  custom={5}
                  variants={infoModuleVariants}
                  initial="hidden"
                  animate={showInfoModules ? "visible" : "hidden"}
                >
                  <ReviewSentimentAnalysis themeColor={currentTheme.primary} />
                </motion.div>
              </motion.div>
            </div>

            {/* Mobile: 手风琴折叠布局 */}
            <div className="md:hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <MobileInfoAccordion items={accordionItems} themeColor={currentTheme.primary} />
              </motion.div>
            </div>
          </section>
          </div>
        </div>
        </div>
      </main>

      {/* ==================== 底部购买栏 ==================== */}
      <PurchaseDecisionBar
        phone={{
          model: `${brand} ${model}`,
          color: "钛蓝",
          colorCode: "#A8C8EC",
          variant: "12GB+512GB",
          price: 9699,
        }}
        themeColor={currentTheme.primary}
        onAddToCart={() => console.log("Added to cart")}
        onBuyNow={() => console.log("Buy now")}
        onFavorite={() => console.log("Favorite toggled")}
      />
    </div>
  );
}

export function PhoneDetailPageDemo() {
  return (
    <div className="min-h-screen bg-[#080c14]">
      <PhoneDetailPage />
    </div>
  );
}
