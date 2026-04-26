"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type AuraTheme,
  type AuraColorConfig,
  generateAuraTheme,
  getPhonePrimaryColor,
  generateAuraCssVars,
  getDefaultAuraTheme,
  PRESET_AURA_THEMES,
} from "@/lib/color-theme";

// ============================================================================
// 一机一色 Hook - 动态主题色彩系统
// ============================================================================

export interface UseAuraThemeOptions {
  brand?: string;
  model?: string;
  customHex?: string;
  config?: Partial<AuraColorConfig>;
  applyToBody?: boolean;
}

export interface UseAuraThemeReturn {
  theme: AuraTheme;
  cssVars: Record<string, string>;
  primaryHex: string;
  isReady: boolean;
  applyToElement: (element: HTMLElement | null) => void;
}

/**
 * 一机一色 Hook
 *
 * 根据手机品牌/型号或自定义 HEX 色值，动态生成氛围色主题
 *
 * @example
 * // 根据品牌自动生成
 * const { theme, cssVars } = useAuraTheme({ brand: "xiaomi", model: "14 Pro" });
 *
 * @example
 * // 使用自定义颜色
 * const { theme, cssVars } = useAuraTheme({ customHex: "#FF6900" });
 *
 * @example
 * // 应用到指定元素
 * const ref = useRef<HTMLDivElement>(null);
 * const { applyToElement } = useAuraTheme({ brand: "huawei" });
 * useEffect(() => { applyToElement(ref.current); }, [ref, applyToElement]);
 */
export function useAuraTheme(options: UseAuraThemeOptions = {}): UseAuraThemeReturn {
  const { brand, model, customHex, config, applyToBody = false } = options;

  const [isReady, setIsReady] = useState(false);

  // 计算主色
  const primaryHex = useMemo(() => {
    if (customHex) return customHex;
    if (brand) return getPhonePrimaryColor(brand, model);
    return "#888888";
  }, [brand, model, customHex]);

  // 生成主题
  const theme = useMemo(() => {
    try {
      return generateAuraTheme(primaryHex, config);
    } catch {
      return getDefaultAuraTheme();
    }
  }, [primaryHex, config]);

  // 生成 CSS 变量
  const cssVars = useMemo(() => {
    return generateAuraCssVars(theme);
  }, [theme]);

  // 应用到元素的回调
  const applyToElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      Object.entries(cssVars).forEach(([key, value]) => {
        element.style.setProperty(key, value);
      });
    },
    [cssVars]
  );

  // 可选: 自动应用到 body
  useEffect(() => {
    if (applyToBody && typeof document !== "undefined") {
      const body = document.body;
      Object.entries(cssVars).forEach(([key, value]) => {
        body.style.setProperty(key, value);
      });

      setIsReady(true);

      return () => {
        Object.keys(cssVars).forEach((key) => {
          body.style.removeProperty(key);
        });
      };
    } else {
      setIsReady(true);
    }
  }, [cssVars, applyToBody]);

  return {
    theme,
    cssVars,
    primaryHex,
    isReady,
    applyToElement,
  };
}

// ============================================================================
// 预设主题 Hook (用于快速切换预设)
// ============================================================================

export type PresetThemeKey = keyof typeof PRESET_AURA_THEMES;

export function usePresetAuraTheme(
  presetKey: PresetThemeKey,
  applyToBody: boolean = false
): UseAuraThemeReturn {
  const theme = PRESET_AURA_THEMES[presetKey] || getDefaultAuraTheme();

  const [isReady, setIsReady] = useState(false);

  const cssVars = useMemo(() => generateAuraCssVars(theme), [theme]);

  const applyToElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      Object.entries(cssVars).forEach(([key, value]) => {
        element.style.setProperty(key, value);
      });
    },
    [cssVars]
  );

  useEffect(() => {
    if (applyToBody && typeof document !== "undefined") {
      const body = document.body;
      Object.entries(cssVars).forEach(([key, value]) => {
        body.style.setProperty(key, value);
      });

      setIsReady(true);

      return () => {
        Object.keys(cssVars).forEach((key) => {
          body.style.removeProperty(key);
        });
      };
    } else {
      setIsReady(true);
    }
  }, [cssVars, applyToBody]);

  return {
    theme,
    cssVars,
    primaryHex: "#888888",
    isReady,
    applyToElement,
  };
}

// ============================================================================
// 手机详情页专用 Hook (支持从数据中提取颜色)
// ============================================================================

export interface PhoneData {
  brand: string;
  model: string;
  primaryColor?: string | null;
}

export function usePhoneAuraTheme(
  phone: PhoneData | null | undefined,
  config?: Partial<AuraColorConfig>
): UseAuraThemeReturn {
  return useAuraTheme({
    brand: phone?.brand,
    model: phone?.model,
    customHex: phone?.primaryColor || undefined,
    config,
    applyToBody: false,
  });
}

// ============================================================================
// 批量主题 Hook (用于列表/对比场景)
// ============================================================================

export interface PhoneThemeMap {
  [phoneId: string]: AuraTheme;
}

export function useBatchAuraThemes(phones: PhoneData[]): PhoneThemeMap {
  return useMemo(() => {
    const map: PhoneThemeMap = {};
    phones.forEach((phone) => {
      const hex = phone.primaryColor || getPhonePrimaryColor(phone.brand, phone.model);
      map[`${phone.brand}-${phone.model}`] = generateAuraTheme(hex, {
        saturationRatio: 0.25,
        brightnessTarget: 96,
        opacity: 0.12,
      });
    });
    return map;
  }, [phones]);
}
