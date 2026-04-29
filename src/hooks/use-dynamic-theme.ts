"use client";

import { useMemo, useCallback, useEffect, useRef } from "react";
import {
  type ColorEmotion,
  type ColorScheme,
  type PhoneColorScheme,
  type DynamicThemeRules,
  type EnhancedPhoneColorScheme,
  createPhoneColorScheme,
  createEnhancedColorScheme,
  analyzeColorEmotion,
  generateCompleteColorScheme,
  getModelColorConfig,
  getAllColorSchemesForModel,
  getGalaxyS25UltraScheme,
  generateDynamicThemeCssVars,
  generateBreathingKeyframes,
} from "@/lib/color-theme";

// ============================================================================
// 动态主题 Hook - 支持情绪分析与完整配色方案
// ============================================================================

export interface UseDynamicThemeOptions {
  /** 机型ID (如 "samsung-galaxy-s25-ultra") */
  modelId?: string;
  /** 品牌名 */
  brand?: string;
  /** 型号名 */
  model?: string;
  /** 机身颜色名称 */
  bodyColorName?: string;
  /** 机身颜色HEX (直接指定时优先) */
  bodyColorHex?: string;
  /** 是否暗黑模式 (影响动态规则生成) */
  isDarkMode?: boolean;
  /** 是否启用平滑过渡 */
  enableTransition?: boolean;
  /** 过渡持续时间 (ms) */
  transitionDuration?: number;
}

export interface UseDynamicThemeReturn {
  /** 完整配色档案 */
  colorScheme: PhoneColorScheme;
  /** 增强版配色档案 (包含动态规则) */
  enhancedScheme: EnhancedPhoneColorScheme;
  /** 情绪属性 */
  emotion: ColorEmotion;
  /** 配色方案 */
  scheme: ColorScheme;
  /** 当前主题 (scheme 的别名，用于兼容) */
  currentTheme: ColorScheme;
  /** 动态应用规则 */
  dynamicRules: DynamicThemeRules;
  /** CSS变量对象 (包含动态规则变量) */
  cssVars: Record<string, string>;
  /** 呼吸动画关键帧 CSS */
  breathingKeyframes: string;
  /** 应用到元素的回调 (带平滑过渡) */
  applyToElement: (element: HTMLElement | null) => void;
  /** 生成样式对象 */
  getStyleObject: () => React.CSSProperties;
  /** 获取过渡样式 */
  getTransitionStyle: () => React.CSSProperties;
  /** 按名称设置颜色 */
  setColorByName: (colorName: string) => void;
}

/**
 * 动态主题 Hook
 * 
 * 根据手机机身颜色自动生成完整的页面配色方案，包含情绪分析和动态应用规则
 * 
 * @example
 * // 使用机型ID和颜色名称
 * const { colorScheme, cssVars, getTransitionStyle } = useDynamicTheme({
 *   modelId: "samsung-galaxy-s25-ultra",
 *   bodyColorName: "钛蓝",
 *   enableTransition: true
 * });
 * 
 * @example
 * // 直接使用HEX色值
 * const { scheme, emotion, enhancedScheme } = useDynamicTheme({
 *   brand: "Custom",
 *   model: "Phone",
 *   bodyColorName: "自定义",
 *   bodyColorHex: "#D6E4F0",
 *   isDarkMode: true
 * });
 * 
 * @example
 * // 应用到指定元素（带平滑过渡）
 * const ref = useRef<HTMLDivElement>(null);
 * const { applyToElement, breathingKeyframes } = useDynamicTheme({ 
 *   bodyColorHex: "#E8E4E0",
 *   enableTransition: true,
 *   transitionDuration: 800
 * });
 * useEffect(() => { applyToElement(ref.current); }, [applyToElement]);
 */
export function useDynamicTheme(
  options: UseDynamicThemeOptions = {}
): UseDynamicThemeReturn {
  const {
    modelId,
    brand = "Unknown",
    model = "Phone",
    bodyColorName = "默认",
    bodyColorHex,
    isDarkMode = true,
    enableTransition = true,
    transitionDuration = 800,
  } = options;

  // 计算基础颜色方案
  const colorScheme = useMemo<PhoneColorScheme>(() => {
    // 1. 如果提供了机型ID和颜色名称，尝试从预设获取
    if (modelId && !bodyColorHex) {
      // 特殊处理 S25 Ultra
      if (modelId === "samsung-galaxy-s25-ultra" && bodyColorName) {
        const scheme = getGalaxyS25UltraScheme(bodyColorName);
        if (scheme) return scheme;
      }

      // 从通用配置获取
      const config = getModelColorConfig(modelId);
      if (config) {
        const color = config.colors.find(
          (c) => c.colorName === bodyColorName || c.isDefault
        );
        if (color) {
          return createPhoneColorScheme(
            modelId,
            config.brand,
            config.model,
            color.colorName,
            color.hex
          );
        }
      }
    }

    // 2. 使用直接提供的HEX色值
    const effectiveColor = bodyColorHex || "#888888";
    return createPhoneColorScheme(
      modelId || "custom",
      brand,
      model,
      bodyColorName,
      effectiveColor
    );
  }, [modelId, brand, model, bodyColorName, bodyColorHex]);

  // 计算增强版配色方案（包含动态规则）
  const enhancedScheme = useMemo<EnhancedPhoneColorScheme>(() => {
    return createEnhancedColorScheme(
      colorScheme.phoneId,
      colorScheme.brand,
      colorScheme.model,
      colorScheme.bodyColorName,
      colorScheme.bodyColor,
      isDarkMode
    );
  }, [colorScheme, isDarkMode]);

  // 解构方便使用
  const { emotion, scheme, cssVars: baseCssVars } = colorScheme;
  const { dynamicRules, dynamicCssVars, breathingKeyframes } = enhancedScheme;

  // 合并所有 CSS 变量
  const cssVars = useMemo(() => {
    return {
      ...baseCssVars,
      ...dynamicCssVars,
      "--dt-transition-duration": `${transitionDuration}ms`,
    };
  }, [baseCssVars, dynamicCssVars, transitionDuration]);

  // 应用到元素的回调（带平滑过渡）
  const applyToElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;

      // 启用过渡效果
      if (enableTransition) {
        element.style.setProperty(
          "transition",
          `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
        );
      }

      // 应用所有 CSS 变量
      Object.entries(cssVars).forEach(([key, value]) => {
        element.style.setProperty(key, value);
      });

      // 清理过渡（可选：在变量应用后移除过渡以避免影响其他样式变化）
      if (enableTransition) {
        setTimeout(() => {
          element.style.removeProperty("transition");
        }, transitionDuration);
      }
    },
    [cssVars, enableTransition, transitionDuration]
  );

  // 生成 React 样式对象
  const getStyleObject = useCallback((): React.CSSProperties => {
    return {
      background: dynamicRules.background.gradient,
      color: dynamicRules.text.primary,
      "--phone-primary": scheme.primary,
      "--phone-secondary": scheme.secondary,
      "--phone-highlight": scheme.highlight,
      "--phone-accent": scheme.accent,
    } as React.CSSProperties;
  }, [dynamicRules, scheme]);

  // 获取过渡样式（用于包裹需要动画过渡的元素）
  const getTransitionStyle = useCallback((): React.CSSProperties => {
    if (!enableTransition) return {};
    return {
      transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    };
  }, [enableTransition, transitionDuration]);

  // 按名称设置颜色（当前为占位实现）
  const setColorByName = useCallback((colorName: string) => {
    // TODO: 实现颜色切换逻辑
    console.log("setColorByName called with:", colorName);
  }, []);

  return {
    colorScheme,
    enhancedScheme,
    emotion,
    scheme,
    currentTheme: scheme, // scheme 的别名，用于兼容
    dynamicRules,
    cssVars,
    breathingKeyframes,
    applyToElement,
    getStyleObject,
    getTransitionStyle,
    setColorByName,
  };
}

// ============================================================================
// 机型配色列表 Hook
// ============================================================================

export interface UseModelColorsOptions {
  modelId: string;
}

export interface UseModelColorsReturn {
  /** 所有配色方案 */
  colorSchemes: PhoneColorScheme[];
  /** 默认配色 */
  defaultScheme: PhoneColorScheme | null;
  /** 配色数量 */
  count: number;
  /** 根据颜色名称获取方案 */
  getSchemeByName: (name: string) => PhoneColorScheme | null;
}

/**
 * 获取机型的所有配色方案
 * 
 * @example
 * const { colorSchemes, defaultScheme } = useModelColors({
 *   modelId: "samsung-galaxy-s25-ultra"
 * });
 */
export function useModelColors(
  options: UseModelColorsOptions
): UseModelColorsReturn {
  const { modelId } = options;

  const colorSchemes = useMemo<PhoneColorScheme[]>(() => {
    return getAllColorSchemesForModel(modelId);
  }, [modelId]);

  const defaultScheme = useMemo<PhoneColorScheme | null>(() => {
    return colorSchemes.find((s) => s.bodyColorName.includes("默认")) ||
      colorSchemes[0] ||
      null;
  }, [colorSchemes]);

  const getSchemeByName = useCallback(
    (name: string): PhoneColorScheme | null => {
      return (
        colorSchemes.find((s) => s.bodyColorName === name) || null
      );
    },
    [colorSchemes]
  );

  return {
    colorSchemes,
    defaultScheme,
    count: colorSchemes.length,
    getSchemeByName,
  };
}

// ============================================================================
// 颜色对比 Hook
// ============================================================================

export interface ColorComparison {
  scheme: PhoneColorScheme;
  emotion: ColorEmotion;
}

export interface UseColorComparisonOptions {
  colors: { name: string; hex: string }[];
  brand?: string;
  model?: string;
}

export function useColorComparison(
  options: UseColorComparisonOptions
): ColorComparison[] {
  const { colors, brand = "Unknown", model = "Phone" } = options;

  return useMemo<ColorComparison[]>(() => {
    return colors.map((color, index) => {
      const scheme = createPhoneColorScheme(
        `compare-${index}`,
        brand,
        model,
        color.name,
        color.hex
      );
      return {
        scheme,
        emotion: scheme.emotion,
      };
    });
  }, [colors, brand, model]);
}

// ============================================================================
// 便捷导出
// ============================================================================

export type { ColorEmotion, ColorScheme, PhoneColorScheme };
export {
  analyzeColorEmotion,
  generateCompleteColorScheme,
  createPhoneColorScheme,
  getAllColorSchemesForModel,
  getGalaxyS25UltraScheme,
};
