"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ============================================================================
// Hero 转场动画状态管理
// ============================================================================

export type HeroTransitionPhase = "idle" | "expanding" | "expanded" | "navigating" | "complete" | "returning";

export interface HeroTransitionState {
  phase: HeroTransitionPhase;
  sourceRect: DOMRect | null;
  targetPhoneId: string | null;
  themeColor: string;
  phoneData: {
    brand: string;
    model: string;
    priceCny: number | null;
    score: number;
    scoreLabel: string;
    rank: number;
    screenType: string;
    imageUrl?: string | null;
  } | null;
}

interface HeroTransitionContext {
  state: HeroTransitionState;
  startTransition: (params: {
    element: HTMLElement;
    phoneId: string;
    themeColor: string;
    phoneData: HeroTransitionState["phoneData"];
    targetUrl: string;
  }) => void;
  startReturnTransition: (params: {
    phoneId: string;
    sourceRect: DOMRect;
    returnUrl?: string;
  }) => void;
  resetTransition: () => void;
}

// SessionStorage key for cross-page state persistence
const HERO_STORAGE_KEY = "hero-transition-state";
const HERO_RETURN_KEY = "hero-return-state";

// 全局状态（用于跨组件通信）
let globalState: HeroTransitionState = {
  phase: "idle",
  sourceRect: null,
  targetPhoneId: null,
  themeColor: "",
  phoneData: null,
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((cb) => cb());
}

export function getHeroTransitionState(): HeroTransitionState {
  return globalState;
}

export function setHeroTransitionState(state: HeroTransitionState) {
  globalState = state;
  notifyListeners();
}

// ============================================================================
// SessionStorage 持久化（用于跨页面保持状态）
// ============================================================================

interface PersistedHeroState {
  targetPhoneId: string | null;
  themeColor: string;
  phoneData: HeroTransitionState["phoneData"];
  timestamp: number;
}

interface PersistedReturnState {
  phoneId: string;
  sourceRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  timestamp: number;
}

export function persistHeroState(state: HeroTransitionState) {
  if (typeof window === "undefined") return;
  const data: PersistedHeroState = {
    targetPhoneId: state.targetPhoneId,
    themeColor: state.themeColor,
    phoneData: state.phoneData,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(data));
}

export function loadPersistedHeroState(): PersistedHeroState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(HERO_STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as PersistedHeroState;
    // 超过 5 秒的状态视为过期
    if (Date.now() - data.timestamp > 5000) {
      sessionStorage.removeItem(HERO_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearPersistedHeroState() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(HERO_STORAGE_KEY);
  }
}

// ============================================================================
// 返回状态持久化
// ============================================================================

export function persistReturnState(phoneId: string, sourceRect: DOMRect) {
  if (typeof window === "undefined") return;
  const data: PersistedReturnState = {
    phoneId,
    sourceRect: {
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
    },
    timestamp: Date.now(),
  };
  sessionStorage.setItem(HERO_RETURN_KEY, JSON.stringify(data));
}

export function loadPersistedReturnState(): PersistedReturnState | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(HERO_RETURN_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as PersistedReturnState;
    if (Date.now() - data.timestamp > 5000) {
      sessionStorage.removeItem(HERO_RETURN_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearPersistedReturnState() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(HERO_RETURN_KEY);
  }
}

// ============================================================================
// useHeroTransition Hook
// ============================================================================

export function useHeroTransition(): HeroTransitionContext {
  const router = useRouter();
  const [state, setState] = useState<HeroTransitionState>(globalState);
  const animationRef = useRef<number | null>(null);
  const navigateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const resetTransition = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
    }
    clearPersistedHeroState();
    clearPersistedReturnState();
    setHeroTransitionState({
      phase: "idle",
      sourceRect: null,
      targetPhoneId: null,
      themeColor: "",
      phoneData: null,
    });
  }, []);

  const startTransition = useCallback(
    (params: {
      element: HTMLElement;
      phoneId: string;
      themeColor: string;
      phoneData: HeroTransitionState["phoneData"];
      targetUrl: string;
    }) => {
      const { element, phoneId, themeColor, phoneData, targetUrl } = params;

      // 获取源元素的位置信息
      const rect = element.getBoundingClientRect();

      // 设置初始状态
      const newState: HeroTransitionState = {
        phase: "expanding",
        sourceRect: rect,
        targetPhoneId: phoneId,
        themeColor,
        phoneData,
      };
      setHeroTransitionState(newState);
      persistHeroState(newState);

      // 阶段一：expanding (0ms - 300ms)
      // 在 300ms 后进入 expanded 状态，然后执行导航
      navigateTimeoutRef.current = setTimeout(() => {
        setHeroTransitionState({
          ...globalState,
          phase: "expanded",
        });

        // 短暂延迟后导航到详情页
        navigateTimeoutRef.current = setTimeout(() => {
          setHeroTransitionState({
            ...globalState,
            phase: "navigating",
          });

          // 使用 Next.js router 导航
          router.push(targetUrl);
        }, 50);
      }, 300);
    },
    [router]
  );

  const startReturnTransition = useCallback(
    (params: {
      phoneId: string;
      sourceRect: DOMRect;
      returnUrl?: string;
    }) => {
      const { phoneId, sourceRect, returnUrl = "/ranking" } = params;

      // 保存返回状态
      persistReturnState(phoneId, sourceRect);

      // 设置返回动画状态
      setHeroTransitionState({
        ...globalState,
        phase: "returning",
        targetPhoneId: phoneId,
        sourceRect,
      });

      // 导航回来源页面
      navigateTimeoutRef.current = setTimeout(() => {
        router.push(returnUrl);
      }, 50);
    },
    [router]
  );

  return {
    state,
    startTransition,
    startReturnTransition,
    resetTransition,
  };
}

// ============================================================================
// 辅助函数：计算阶段一动画的目标样式
// ============================================================================

export interface HeroAnimationStyles {
  // 位置和尺寸
  top: number;
  left: number;
  width: number;
  height: number;
  // 圆角
  borderRadius: string;
  // 背景色
  backgroundColor: string;
  // 变换
  transform: string;
}

/**
 * 计算从胶囊到详情页头部的动画目标值
 */
export function calculateHeroTargetStyles(
  sourceRect: DOMRect,
  themeColor: string
): HeroAnimationStyles {
  // 目标：填满屏幕宽度，高度 280px
  const targetWidth = window.innerWidth;
  const targetHeight = 280;
  const targetTop = 0; // 顶部对齐
  const targetLeft = 0; // 左侧对齐

  // 圆角变化：从 24px/32px 非对称圆角 → 顶部 0px，底部 24px
  const targetBorderRadius = "0px 0px 24px 24px";

  // 背景色：主题色深浓版本（HSB: 原色饱和度 60%，亮度 25%）
  const darkThemeColor = generateDarkThemeColor(themeColor);

  return {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: targetHeight,
    borderRadius: targetBorderRadius,
    backgroundColor: darkThemeColor,
    transform: "none",
  };
}

/**
 * 生成主题色的深浓版本
 * HSB: 保持色相，饱和度 60%，亮度 25%
 */
function generateDarkThemeColor(hex: string): string {
  // 简单的 HEX 转 RGB
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // RGB 转 HSB
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

  // 目标：饱和度 60%，亮度 25%
  const targetS = 60;
  const targetB = 25;

  // HSB 转 RGB
  const sNorm = targetS / 100;
  const bNorm_target = targetB / 100;

  const c = bNorm_target * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bNorm_target - c;

  let r2 = 0,
    g2 = 0,
    b2 = 0;

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

/**
 * 计算动画进度对应的插值
 */
export function interpolateHeroStyles(
  sourceRect: DOMRect,
  targetStyles: HeroAnimationStyles,
  progress: number
): HeroAnimationStyles {
  const eased = easeOutCubic(progress);

  return {
    top: sourceRect.top + (targetStyles.top - sourceRect.top) * eased,
    left: sourceRect.left + (targetStyles.left - sourceRect.left) * eased,
    width: sourceRect.width + (targetStyles.width - sourceRect.width) * eased,
    height: sourceRect.height + (targetStyles.height - sourceRect.height) * eased,
    borderRadius: targetStyles.borderRadius, // 圆角在 CSS 中过渡
    backgroundColor: targetStyles.backgroundColor,
    transform: `scale(${1 + (0 - 0) * eased})`,
  };
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
