"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getHeroTransitionState,
  setHeroTransitionState,
  persistHeroState,
  clearPersistedHeroState,
  type HeroTransitionState,
  type HeroTransitionPhase,
} from "@/hooks/use-hero-transition";
import { PhoneSilhouette } from "@/components/ranking/phone-silhouette";

interface HeroOverlayProps {
  onTransitionComplete?: () => void;
}

export function HeroTransitionOverlay({ onTransitionComplete }: HeroOverlayProps) {
  const [state, setState] = useState<HeroTransitionState>(getHeroTransitionState());
  const [animationProgress, setAnimationProgress] = useState(0);
  const router = useRouter();
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const navigateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkState = () => {
      setState(getHeroTransitionState());
    };

    const interval = setInterval(checkState, 16);
    return () => clearInterval(interval);
  }, []);

  const animateExpansion = useCallback(() => {
    if (!state.sourceRect || state.phase !== "expanding") return;

    const duration = 350;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current || !state.sourceRect) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutExpo(progress);

      setAnimationProgress(eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAnimationProgress(1);
        setHeroTransitionState({
          ...state,
          phase: "expanded",
        });

        navigateTimeoutRef.current = setTimeout(() => {
          if (state.targetPhoneId) {
            persistHeroState(state);
            setHeroTransitionState({
              ...state,
              phase: "navigating",
            });
            router.push(`/phones/${state.targetPhoneId}`);
          }
        }, 50);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [state, router]);

  useEffect(() => {
    if (state.phase === "expanding" && state.sourceRect) {
      animateExpansion();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (navigateTimeoutRef.current) {
        clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, [state.phase, state.sourceRect, animateExpansion]);

  useEffect(() => {
    if (state.phase === "idle") {
      setAnimationProgress(0);
    }
  }, [state.phase]);

  if (state.phase === "idle" || !state.sourceRect || !state.phoneData) {
    return null;
  }

  const { sourceRect, phoneData, themeColor } = state;

  const targetWidth = typeof window !== "undefined" ? window.innerWidth : 375;
  const targetHeight = 280;
  const targetBorderRadius = "0px 0px 24px 24px";

  const currentTop = sourceRect.top + (0 - sourceRect.top) * animationProgress;
  const currentLeft = sourceRect.left + (0 - sourceRect.left) * animationProgress;
  const currentWidth = sourceRect.width + (targetWidth - sourceRect.width) * animationProgress;
  const currentHeight = sourceRect.height + (targetHeight - sourceRect.height) * animationProgress;

  const currentBorderRadius = animationProgress < 0.5
    ? `${24 - 24 * animationProgress * 2}px ${32 - 32 * animationProgress * 2}px ${32 - 32 * animationProgress * 2}px ${24 - 24 * animationProgress * 2}px`
    : `0px 0px ${24 * (animationProgress - 0.5) * 2}px ${24 * (animationProgress - 0.5) * 2}px`;

  const darkBgColor = generateDarkThemeColor(themeColor || "#00D9FF");
  const currentBgOpacity = 0.65 + 0.35 * animationProgress;

  const isTopThree = (phoneData.rank || 99) <= 3;
  const scoreStr = phoneData.score?.toFixed(1) || "0.0";
  const [scoreInt, scoreDecimal] = scoreStr.split(".");

  const contentOpacity = animationProgress > 0.6 ? (animationProgress - 0.6) / 0.4 : 0;
  const cardContentOpacity = 1 - animationProgress;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute overflow-hidden"
          style={{
            top: currentTop,
            left: currentLeft,
            width: currentWidth,
            height: currentHeight,
            borderRadius: currentBorderRadius,
            backgroundColor: darkBgColor,
            opacity: currentBgOpacity,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            transition: "border-radius 0.1s ease-out",
          }}
        >
          <div
            className="absolute inset-0 flex items-center"
            style={{ opacity: cardContentOpacity }}
          >
            <div className="flex items-center w-full h-full px-5">
              <div className="flex-shrink-0 w-[72px] flex items-center gap-2">
                {isTopThree ? (
                  <div className="rank-badge">
                    <div className="rank-badge-inner">{phoneData.rank}</div>
                  </div>
                ) : (
                  <div className="rank-badge-normal">{phoneData.rank}</div>
                )}
                <div className="silhouette-container">
                  <PhoneSilhouette
                    screenType={(phoneData.screenType || "flat") as "flat" | "curved" | "waterfall" | "foldable"}
                    themeColor={themeColor}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 px-3">
                <span className="text-xs text-white/60 font-ranking-cn">{phoneData.brand}</span>
                <h3 className="font-ranking-cn font-medium text-sm truncate">{phoneData.model}</h3>
                {phoneData.priceCny && (
                  <p className="text-xs font-ranking-num font-semibold" style={{ color: themeColor }}>
                    ¥{phoneData.priceCny.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 w-[80px] text-right">
                <div className="text-xl font-ranking-num font-bold" style={{ color: themeColor }}>
                  {scoreInt}
                  <span className="text-sm" style={{ color: themeColor, opacity: 0.6 }}>
                    .{scoreDecimal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 flex items-center px-4 pb-6 pt-12"
            style={{ opacity: contentOpacity }}
          >
            <div className="flex items-center gap-3 flex-shrink-0">
              {isTopThree ? (
                <div
                  className="rank-badge"
                  style={{
                    ["--badge-conic" as string]: `conic-gradient(from 0deg, ${themeColor}E6 0deg, ${themeColor} 90deg, ${themeColor}E6 180deg, ${themeColor} 270deg, ${themeColor}E6 360deg)`,
                  }}
                >
                  <div
                    className="rank-badge-inner"
                    style={{
                      background: `${themeColor}26`,
                      boxShadow: `inset 0 0 8px ${themeColor}33`,
                    }}
                  >
                    {phoneData.rank}
                  </div>
                </div>
              ) : (
                <div className="rank-badge-normal">{phoneData.rank}</div>
              )}
              <div className="silhouette-container" style={{ transform: "scale(2.5)" }}>
                <PhoneSilhouette
                  screenType={(phoneData.screenType || "flat") as "flat" | "curved" | "waterfall" | "foldable"}
                  themeColor={themeColor}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0 px-4">
              <span className="text-xs text-white/60 font-ranking-cn block mb-1">
                {phoneData.brand}
              </span>
              <h1 className="font-ranking-cn font-bold text-xl text-white truncate">
                {phoneData.model}
              </h1>
              {phoneData.priceCny && (
                <p className="text-sm font-ranking-num font-semibold mt-1" style={{ color: themeColor }}>
                  ¥{phoneData.priceCny.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-3xl font-ranking-num font-bold" style={{ color: themeColor }}>
                {scoreInt}
                <span className="text-lg" style={{ color: themeColor }}>
                  .{scoreDecimal}
                </span>
              </div>
              <div className="text-xs text-white/50 font-ranking-cn">
                {phoneData.scoreLabel || "评分"}
              </div>
            </div>
          </div>
        </div>

        {animationProgress > 0.3 && (
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: (animationProgress - 0.3) * 1.5 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

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

export default HeroTransitionOverlay;
