"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "./particle-background";
import { Phone3DShowcase } from "./phone-3d-showcase";
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
import { Smartphone, BarChart3, TrendingUp, ShoppingCart, MessageSquare, Award } from "lucide-react";

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
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
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

  const [isLoaded, setIsLoaded] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showInfoModules, setShowInfoModules] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleColorChange = useCallback((color: { id: string; name: string; color: string }) => {
    setColorByName(color.name);
  }, [setColorByName]);

  // 动画变体
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const phoneVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const infoModuleVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, delay: delay * 0.1, ease: "easeOut" },
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
          tagline={tagline}
          releaseDate={releaseDate}
          startingPrice={startingPrice}
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
          dimensions={[
            { name: "性能", score: 9.2 },
            { name: "影像", score: 9.5 },
            { name: "屏幕", score: 9.0 },
            { name: "续航", score: 8.5 },
            { name: "质感", score: 8.8 },
            { name: "体验", score: 7.5 },
          ]}
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
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ==================== 顶部导航栏 ==================== */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isNavScrolled
            ? "bg-[#080c14]/80 backdrop-blur-[20px] border-b border-white/10"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {brand.charAt(0)}
              </div>
              <span className="text-white font-medium text-sm hidden sm:block">{brand}</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#overview" className="text-sm text-gray-300 hover:text-white transition-colors">概览</a>
              <a href="#specs" className="text-sm text-gray-300 hover:text-white transition-colors">参数</a>
              <a href="#reviews" className="text-sm text-gray-300 hover:text-white transition-colors">评价</a>
              <a href="#price" className="text-sm text-gray-300 hover:text-white transition-colors">价格</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                收藏
              </motion.button>
              <motion.button
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-shadow duration-200"
                style={{
                  backgroundColor: currentTheme.primary,
                  color: "#0a0a14",
                  boxShadow: `0 0 0 ${currentTheme.primary}40`,
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: `0 4px 20px ${currentTheme.primary}60`,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                立即购买
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

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
            <ParticleBackground themeColor={currentTheme.primary} density="medium" speed={0.3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 主内容区 ==================== */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 sm:pt-24 pb-32">
        
        {/* 
          响应式布局：
          - Mobile (<768px): 单列，手机在上，手风琴在下
          - Tablet (768-1279px): 上下布局，手机在上
          - Desktop (≥1280px): 左右分栏 40:60，左侧 sticky
        */}
        <div className="flex flex-col xl:grid xl:grid-cols-[40%_60%] xl:gap-12">
          
          {/* ==================== 手机展示区 ==================== */}
          <motion.section
            className={cn(
              "w-full",
              "xl:sticky xl:top-24 xl:h-[calc(100vh-6rem)]",
              "mb-8 xl:mb-0"
            )}
            variants={phoneVariants}
            initial="hidden"
            animate={showPhone ? "visible" : "hidden"}
          >
            <Phone3DShowcase
              brand={brand}
              model={model}
              onColorChange={handleColorChange}
              onFavoriteChange={(isFav) => console.log("Favorite:", isFav)}
              onShare={() => console.log("Share clicked")}
              onCompare={() => console.log("Compare clicked")}
            />
          </motion.section>

          {/* ==================== 信息架构区 ==================== */}
          <section className="w-full">
            
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
                    tagline={tagline}
                    releaseDate={releaseDate}
                    startingPrice={startingPrice}
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
                    dimensions={[
                      { name: "性能", score: 9.2 },
                      { name: "影像", score: 9.5 },
                      { name: "屏幕", score: 9.0 },
                      { name: "续航", score: 8.5 },
                      { name: "质感", score: 8.8 },
                      { name: "体验", score: 7.5 },
                    ]}
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
