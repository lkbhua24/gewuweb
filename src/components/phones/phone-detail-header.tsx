"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  loadPersistedHeroState,
  clearPersistedHeroState,
  useHeroTransition,
} from "@/hooks/use-hero-transition";
import { useEdgeSwipe } from "@/hooks/use-edge-swipe";
import { PhoneSilhouette } from "@/components/ranking/phone-silhouette";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/phone-utils";

// ============================================================================
// 手机详情页头部组件
// 接收 Hero 转场状态，渲染动画后的头部
// 支持返回手势：边缘右滑或点击返回按钮
// ============================================================================

interface PhoneDetailHeaderProps {
  phoneId: string;
}

export function PhoneDetailHeader({ phoneId }: PhoneDetailHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startReturnTransition } = useHeroTransition();

  // 获取来源页面，默认为排行榜
  const from = searchParams.get("from") || "ranking";
  const returnUrl = from === "phones" ? "/phones" : "/ranking";

  // 使用 useMemo 计算初始 heroData
  const initialHeroData = useMemo(() => {
    const persisted = loadPersistedHeroState();
    if (persisted && persisted.targetPhoneId === phoneId) {
      return persisted;
    }
    return null;
  }, [phoneId]);

  const [heroData, setHeroData] = useState(initialHeroData);
  const [isAnimating, setIsAnimating] = useState(!!initialHeroData);
  const [isReturning, setIsReturning] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // 清理持久化状态
  useEffect(() => {
    if (initialHeroData) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        clearPersistedHeroState();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialHeroData]);

  const phoneData = heroData?.phoneData;
  const themeColor = heroData?.themeColor || "#00D9FF";

  // 生成深浓主题色
  const darkBgColor = phoneData ? generateDarkThemeColor(themeColor) : "#080c14";

  const scoreStr = phoneData?.score?.toFixed(1) || "0.0";
  const [scoreInt, scoreDecimal] = scoreStr.split(".");
  const isTopThree = (phoneData?.rank || 99) <= 3;

  // 处理返回
  const handleReturn = useCallback(() => {
    if (isReturning) return;
    setIsReturning(true);

    // 获取当前头部位置作为返回动画的起点
    const headerRect = headerRef.current?.getBoundingClientRect();
    if (headerRect && from === "ranking") {
      // 只有从排行榜进入时才使用 Hero 转场动画返回
      startReturnTransition({
        phoneId,
        sourceRect: headerRect,
        returnUrl,
      });
    } else {
      // 没有头部位置或从手机库进入，直接返回
      router.push(returnUrl);
    }
  }, [isReturning, phoneId, startReturnTransition, router, returnUrl, from]);

  // 边缘滑动手势
  useEdgeSwipe({
    enabled: !isReturning,
    onSwipe: handleReturn,
    threshold: 80,
    edgeWidth: 30,
  });

  // 返回动画：头部收缩
  useEffect(() => {
    if (!isReturning) return;

    // 头部收缩动画
    controls.start({
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
    });
  }, [isReturning, controls]);

  return (
    <div className="relative" ref={headerRef}>
      {/* 头部背景区域 - 与转场动画目标一致 */}
      <motion.div
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: darkBgColor,
          borderRadius: "0px 0px 24px 24px",
          minHeight: 280,
        }}
        initial={false}
        animate={controls}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={handleReturn}
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            返回
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Heart className="size-4 text-white/60" />
            </button>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Share2 className="size-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* 头部内容 */}
        <div className="flex items-center px-4 pb-6 pt-2">
          {/* 左侧：排名 + 轮廓图 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* 排名徽章 */}
            <motion.div
              className={isTopThree ? "rank-badge" : "rank-badge-normal"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isTopThree ? 1 : 0.6, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={isTopThree ? {
                ["--badge-conic" as string]: `conic-gradient(from 0deg, ${themeColor}E6 0deg, ${themeColor} 90deg, ${themeColor}E6 180deg, ${themeColor} 270deg, ${themeColor}E6 360deg)`,
              } : {}}
            >
              {isTopThree && (
                <div
                  className="rank-badge-inner"
                  style={{
                    background: `${themeColor}26`,
                    boxShadow: `inset 0 0 8px ${themeColor}33`,
                  }}
                >
                  {phoneData?.rank || 0}
                </div>
              )}
              {!isTopThree && (phoneData?.rank || 0)}
            </motion.div>

            {/* 侧视轮廓图 */}
            <motion.div
              className="silhouette-container"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <PhoneSilhouette
                screenType={(phoneData?.screenType || "flat") as "flat" | "curved" | "waterfall" | "foldable"}
                themeColor={themeColor}
              />
            </motion.div>
          </div>

          {/* 中央：品牌/型号/价格 */}
          <motion.div
            className="flex-1 min-w-0 px-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <span className="text-xs text-white/60 font-ranking-cn block mb-1">
              {phoneData?.brand || "品牌"}
            </span>
            <h1 className="font-ranking-cn font-bold text-xl text-white truncate leading-tight">
              {phoneData?.model || `手机型号 #${phoneId}`}
            </h1>
            {phoneData?.priceCny && (
              <p className="text-sm font-ranking-num font-semibold mt-1" style={{ color: themeColor }}>
                {formatPrice(phoneData.priceCny)}
              </p>
            )}
          </motion.div>

          {/* 右侧：分数 */}
          <motion.div
            className="flex-shrink-0 text-right"
            initial={{ x: -20, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="text-3xl font-ranking-num font-bold" style={{ color: themeColor }}>
              {scoreInt}
              <span className="text-lg" style={{ color: themeColor }}>
                .{scoreDecimal}
              </span>
            </div>
            <div className="text-xs text-white/50 font-ranking-cn">
              {phoneData?.scoreLabel || "评分"}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * 生成主题色的深浓版本
 * HSB: 保持色相，饱和度 60%，亮度 25%
 */
function generateDarkThemeColor(hex: string): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const targetS = 60;
  const targetB = 25;

  const sNorm = targetS / 100;
  const bNorm_target = targetB / 100;

  const c = bNorm_target * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bNorm_target - c;

  let r2 = 0, g2 = 0, b2 = 0;

  if (h >= 0 && h < 60) {
    r2 = c; g2 = x; b2 = 0;
  } else if (h >= 60 && h < 120) {
    r2 = x; g2 = c; b2 = 0;
  } else if (h >= 120 && h < 180) {
    r2 = 0; g2 = c; b2 = x;
  } else if (h >= 180 && h < 240) {
    r2 = 0; g2 = x; b2 = c;
  } else if (h >= 240 && h < 300) {
    r2 = x; g2 = 0; b2 = c;
  } else {
    r2 = c; g2 = 0; b2 = x;
  }

  const finalR = Math.round((r2 + m) * 255);
  const finalG = Math.round((g2 + m) * 255);
  const finalB = Math.round((b2 + m) * 255);

  return `rgb(${finalR}, ${finalG}, ${finalB})`;
}
