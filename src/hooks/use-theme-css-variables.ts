"use client";

import { useEffect, useCallback } from "react";

// ============================================================================
// CSS 变量动态更新 Hook
// 用于将动态主题色应用到 CSS 变量
// ============================================================================

interface ThemeColors {
  primary: string;
  secondary?: string;
  accent?: string;
}

/**
 * 更新 CSS 变量以反映当前主题色
 * @param colors - 主题色配置
 */
export function useThemeCssVariables(colors: ThemeColors) {
  const updateCssVariables = useCallback(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // 更新主色
    if (colors.primary) {
      root.style.setProperty("--theme-primary", colors.primary);
      root.style.setProperty(
        "--theme-primary-light",
        `${colors.primary}33` // 20% 透明度
      );
      root.style.setProperty(
        "--shadow-theme-glow",
        `0 0 20px ${colors.primary}33`
      );
    }

    // 更新辅色
    if (colors.secondary) {
      root.style.setProperty("--theme-secondary", colors.secondary);
    }

    // 更新点缀色
    if (colors.accent) {
      root.style.setProperty("--theme-accent", colors.accent);
    }
  }, [colors.primary, colors.secondary, colors.accent]);

  // 当颜色变化时更新 CSS 变量
  useEffect(() => {
    updateCssVariables();
  }, [updateCssVariables]);
}

/**
 * 设置单个 CSS 变量
 * @param name - 变量名（不需要 -- 前缀）
 * @param value - 变量值
 */
export function setCssVariable(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(`--${name}`, value);
}

/**
 * 获取 CSS 变量值
 * @param name - 变量名（不需要 -- 前缀）
 * @returns 变量值
 */
export function getCssVariable(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

/**
 * 批量设置 CSS 变量
 * @param variables - 变量对象
 */
export function setCssVariables(variables: Record<string, string>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(`--${name}`, value);
  });
}

/**
 * 重置 CSS 变量为默认值
 * @param names - 变量名数组（不需要 -- 前缀）
 */
export function resetCssVariables(names: string[]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  names.forEach((name) => {
    root.style.removeProperty(`--${name}`);
  });
}

// ============================================================================
// 预定义工具函数
// ============================================================================

/**
 * 生成带透明度的颜色值
 * @param hex - 十六进制颜色
 * @param alpha - 透明度 (0-1)
 * @returns rgba 颜色值
 */
export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 生成主题色相关的 CSS 变量对象
 * @param primaryColor - 主色
 * @returns CSS 变量对象
 */
export function generateThemeVariables(primaryColor: string): Record<string, string> {
  return {
    "theme-primary": primaryColor,
    "theme-primary-light": hexToRgba(primaryColor, 0.2),
    "theme-primary-lighter": hexToRgba(primaryColor, 0.1),
    "theme-glow-sm": `0 0 10px ${hexToRgba(primaryColor, 0.1)}`,
    "theme-glow-md": `0 0 20px ${hexToRgba(primaryColor, 0.2)}`,
    "theme-glow-lg": `0 0 40px ${hexToRgba(primaryColor, 0.3)}`,
    "shadow-theme-glow": `0 0 20px ${hexToRgba(primaryColor, 0.2)}`,
  };
}
