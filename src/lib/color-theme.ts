/**
 * 一机一色 - 动态主题色彩系统
 * Color Theme System for Phone-Specific Aura Colors
 *
 * 核心流程:
 * 1. 从手机官方主视觉/机身配色提取 HEX 主色
 * 2. 转换为 HSB 模式
 * 3. 饱和度(S)降低至原色的 20%-30%
 * 4. 亮度(B)提升至 92%-98%
 * 5. 输出为"氛围色(Aura Color)"，用于底层晕染
 */

// ============================================================================
// 类型定义
// ============================================================================

export interface HSBColor {
  h: number; // Hue: 0-360
  s: number; // Saturation: 0-100
  b: number; // Brightness: 0-100
}

export interface AuraColorConfig {
  saturationRatio: number; // 饱和度比例: 0.2 - 0.3 (默认 0.25)
  brightnessTarget: number; // 亮度目标值: 92 - 98 (默认 96)
  opacity: number; // 透明度: 0-1 (默认 0.15)
}

export interface AuraTheme {
  auraColor: string; // rgba() 格式的氛围色
  auraGradient: string; // 渐变背景
  glowColor: string; // 发光色
  borderGlow: string; // 边框发光
  softBackground: string; // 柔和背景
}

export interface PhoneColorProfile {
  brand: string;
  model: string;
  primaryHex: string; // 官方主色
  auraTheme: AuraTheme;
}

// ============================================================================
// HEX ↔ RGB 转换
// ============================================================================

/**
 * 将 HEX 颜色字符串解析为 RGB 对象
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "").trim();

  // 处理 3 位简写形式 (#RGB)
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }

  // 处理 6 位标准形式 (#RRGGBB)
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }

  return null;
}

/**
 * 将 RGB 对象转换为 HEX 字符串
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============================================================================
// RGB ↔ HSB 转换
// ============================================================================

/**
 * 将 RGB 转换为 HSB (HSV)
 */
export function rgbToHsb(r: number, g: number, b: number): HSBColor {
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

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const brightness = Math.round(max * 100);

  return { h, s, b: brightness };
}

/**
 * 将 HSB 转换为 RGB
 */
export function hsbToRgb(h: number, s: number, b: number): { r: number; g: number; b: number } {
  const sNorm = s / 100;
  const bNorm = b / 100;

  const c = bNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bNorm - c;

  let r = 0, g = 0, bl = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; bl = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; bl = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; bl = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; bl = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; bl = c;
  } else {
    r = c; g = 0; bl = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((bl + m) * 255),
  };
}

// ============================================================================
// HEX ↔ HSB 便捷转换
// ============================================================================

/**
 * HEX 直接转 HSB
 */
export function hexToHsb(hex: string): HSBColor | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsb(rgb.r, rgb.g, rgb.b);
}

/**
 * HSB 转 HEX
 */
export function hsbToHex(hsb: HSBColor): string {
  const rgb = hsbToRgb(hsb.h, hsb.s, hsb.b);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// ============================================================================
// 氛围色 (Aura Color) 生成核心逻辑
// ============================================================================

/**
 * 生成氛围色配置
 * 规则:
 * - 饱和度(S): 降低至原色的 20%-30%
 * - 亮度(B): 提升至 92%-98%
 */
export function generateAuraColor(
  primaryHex: string,
  config: Partial<AuraColorConfig> = {}
): string {
  const {
    saturationRatio = 0.25,
    brightnessTarget = 96,
  } = config;

  const hsb = hexToHsb(primaryHex);
  if (!hsb) return "rgba(240, 245, 250, 0.15)"; // 默认 fallback

  // 应用转换规则
  const auraHsb: HSBColor = {
    h: hsb.h, // 保持色相不变
    s: Math.min(100, Math.round(hsb.s * saturationRatio)), // S 降低至 20%-30%
    b: Math.min(100, brightnessTarget), // B 提升至 92%-98%
  };

  const rgb = hsbToRgb(auraHsb.h, auraHsb.s, auraHsb.b);
  const opacity = config.opacity ?? 0.15;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * 生成完整的主题包
 */
export function generateAuraTheme(
  primaryHex: string,
  config: Partial<AuraColorConfig> = {}
): AuraTheme {
  const hsb = hexToHsb(primaryHex);
  if (!hsb) {
    return getDefaultAuraTheme();
  }

  const {
    saturationRatio = 0.25,
    brightnessTarget = 96,
    opacity = 0.15,
  } = config;

  // 基础氛围色
  const auraHsb: HSBColor = {
    h: hsb.h,
    s: Math.min(100, Math.round(hsb.s * saturationRatio)),
    b: Math.min(100, brightnessTarget),
  };

  const auraRgb = hsbToRgb(auraHsb.h, auraHsb.s, auraHsb.b);
  const auraColor = `rgba(${auraRgb.r}, ${auraRgb.g}, ${auraRgb.b}, ${opacity})`;

  // 发光色 (更高透明度)
  const glowRgb = hsbToRgb(auraHsb.h, Math.min(100, auraHsb.s * 1.5), auraHsb.b);
  const glowColor = `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.4)`;

  // 边框发光
  const borderGlow = `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.3)`;

  // 柔和背景
  const softBgRgb = hsbToRgb(auraHsb.h, Math.min(100, auraHsb.s * 0.8), Math.min(100, auraHsb.b + 2));
  const softBackground = `rgba(${softBgRgb.r}, ${softBgRgb.g}, ${softBgRgb.b}, 0.08)`;

  // 渐变: 从氛围色到更浅的变体
  const lighterRgb = hsbToRgb(
    auraHsb.h,
    Math.max(0, auraHsb.s - 5),
    Math.min(100, auraHsb.b + 2)
  );
  const auraGradient = `linear-gradient(135deg, ${auraColor} 0%, rgba(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}, ${opacity * 0.6}) 100%)`;

  return {
    auraColor,
    auraGradient,
    glowColor,
    borderGlow,
    softBackground,
  };
}

/**
 * 默认主题 (当颜色解析失败时使用)
 */
export function getDefaultAuraTheme(): AuraTheme {
  return {
    auraColor: "rgba(200, 220, 240, 0.15)",
    auraGradient: "linear-gradient(135deg, rgba(200, 220, 240, 0.15) 0%, rgba(220, 230, 245, 0.08) 100%)",
    glowColor: "rgba(150, 200, 240, 0.4)",
    borderGlow: "rgba(150, 200, 240, 0.3)",
    softBackground: "rgba(200, 220, 240, 0.08)",
  };
}

// ============================================================================
// 手机色彩数据库 (示例数据)
// ============================================================================

/**
 * 主流手机品牌的官方主色映射
 */
export const PHONE_BRAND_COLORS: Record<string, string> = {
  // Apple
  "apple": "#555555",
  "iphone": "#555555",

  // Samsung
  "samsung": "#1428A0",
  "galaxy": "#1428A0",

  // Xiaomi
  "xiaomi": "#FF6900",
  "redmi": "#FF6900",
  "poco": "#FFD700",

  // OPPO
  "oppo": "#009B77",
  "oneplus": "#F50514",
  "realme": "#FFD100",

  // vivo
  "vivo": "#415FFF",
  "iqoo": "#FF4500",

  // Huawei
  "huawei": "#CF0A2C",
  "honor": "#00BFFF",

  // Google
  "google": "#4285F4",
  "pixel": "#4285F4",

  // Sony
  "sony": "#000000",
  "xperia": "#000000",

  // Motorola
  "motorola": "#E1140A",

  // Nothing
  "nothing": "#000000",

  // Meizu
  "meizu": "#00C4FF",

  // Nubia
  "nubia": "#FF0000",
  "redmagic": "#FF0000",

  // ASUS
  "asus": "#00539B",
  "rog": "#FF0022",

  // ZTE
  "zte": "#0085D0",
};

/**
 * 根据品牌和型号获取主色
 */
export function getPhonePrimaryColor(brand: string, _model?: string): string {
  const normalizedBrand = brand.toLowerCase().trim();

  // 直接匹配品牌
  if (PHONE_BRAND_COLORS[normalizedBrand]) {
    return PHONE_BRAND_COLORS[normalizedBrand];
  }

  // 尝试部分匹配
  for (const [key, color] of Object.entries(PHONE_BRAND_COLORS)) {
    if (normalizedBrand.includes(key) || key.includes(normalizedBrand)) {
      return color;
    }
  }

  // 默认灰色
  return "#888888";
}

/**
 * 生成手机色彩档案
 */
export function createPhoneColorProfile(
  brand: string,
  model: string,
  customHex?: string
): PhoneColorProfile {
  const primaryHex = customHex || getPhonePrimaryColor(brand, model);
  const auraTheme = generateAuraTheme(primaryHex);

  return {
    brand,
    model,
    primaryHex,
    auraTheme,
  };
}

// ============================================================================
// CSS 变量生成 (用于注入到 DOM)
// ============================================================================

/**
 * 生成 CSS 变量字符串
 */
export function generateAuraCssVars(theme: AuraTheme): Record<string, string> {
  return {
    "--aura-color": theme.auraColor,
    "--aura-gradient": theme.auraGradient,
    "--aura-glow": theme.glowColor,
    "--aura-border-glow": theme.borderGlow,
    "--aura-soft-bg": theme.softBackground,
  };
}

/**
 * 将主题应用到元素 (客户端使用)
 */
export function applyAuraThemeToElement(
  element: HTMLElement,
  theme: AuraTheme
): void {
  const vars = generateAuraCssVars(theme);
  Object.entries(vars).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

// ============================================================================
// 预设主题包 (方便直接使用)
// ============================================================================

export const PRESET_AURA_THEMES: Record<string, AuraTheme> = {
  // 科技蓝 (默认)
  "tech-blue": generateAuraTheme("#00D9FF", { saturationRatio: 0.22, brightnessTarget: 96 }),

  // 活力橙 (小米系)
  "energetic-orange": generateAuraTheme("#FF6900", { saturationRatio: 0.25, brightnessTarget: 95 }),

  // 自然绿 (OPPO)
  "nature-green": generateAuraTheme("#009B77", { saturationRatio: 0.2, brightnessTarget: 96 }),

  // 热情红 (华为/一加)
  "passion-red": generateAuraTheme("#CF0A2C", { saturationRatio: 0.22, brightnessTarget: 95 }),

  // 梦幻紫
  "dream-purple": generateAuraTheme("#A855F7", { saturationRatio: 0.25, brightnessTarget: 96 }),

  // 钛金属银
  "titanium-silver": generateAuraTheme("#C0C5CE", { saturationRatio: 0.15, brightnessTarget: 98 }),

  // 陶瓷白
  "ceramic-white": generateAuraTheme("#F5F5F0", { saturationRatio: 0.1, brightnessTarget: 98 }),

  // 深空黑
  "deep-black": generateAuraTheme("#1A1A2E", { saturationRatio: 0.2, brightnessTarget: 94 }),
};

// ============================================================================
// 辅助函数: 判断颜色亮度 (用于决定文字颜色)
// ============================================================================

/**
 * 计算颜色的相对亮度
 */
export function getColorLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * 判断是否应该使用深色文字 (亮度 > 0.5)
 */
export function shouldUseDarkText(hex: string): boolean {
  return getColorLuminance(hex) > 0.5;
}

// ============================================================================
// 辅助函数: 颜色变体生成
// ============================================================================

/**
 * 生成颜色的浅色调
 */
export function generateLightVariant(hex: string, percent: number = 80): string {
  const hsb = hexToHsb(hex);
  if (!hsb) return hex;

  const lightHsb: HSBColor = {
    h: hsb.h,
    s: Math.max(0, Math.round(hsb.s * (1 - percent / 100))),
    b: Math.min(100, hsb.b + Math.round((100 - hsb.b) * (percent / 100))),
  };

  return hsbToHex(lightHsb);
}

/**
 * 生成颜色的深色调
 */
export function generateDarkVariant(hex: string, percent: number = 30): string {
  const hsb = hexToHsb(hex);
  if (!hsb) return hex;

  const darkHsb: HSBColor = {
    h: hsb.h,
    s: Math.min(100, Math.round(hsb.s * (1 + percent / 100))),
    b: Math.max(0, Math.round(hsb.b * (1 - percent / 100))),
  };

  return hsbToHex(darkHsb);
}

// ============================================================================
// 排行榜色彩应用矩阵 - Ranking Color Application Matrix
// ============================================================================

export interface RankingColorMatrix {
  // 1. 胶囊底层渐变起点 (5% opacity, normal, 左侧)
  capsuleGradientStart: string;
  // 2. 胶囊底层渐变终点 (12% opacity, normal, 右侧)
  capsuleGradientEnd: string;
  // 3. TOP3 徽章背景 (15% opacity, normal, 圆形内)
  top3BadgeBackground: string;
  // 4. TOP3 徽章描边 (80%-100% opacity, normal, 流光动画)
  top3BadgeStroke: string;
  // 5. 价格文字 (100% opacity, normal, 高饱和原色)
  priceText: string;
  // 6. 当前榜单核心参数值 (100% opacity, normal, 高饱和原色)
  coreParamValue: string;
  // 7. 分数小数点后数字 (100% opacity, normal, 高饱和原色)
  scoreDecimal: string;
  // 8. Tab 下划线 (100% opacity, normal, 取当前榜首机型主题色)
  tabUnderline: string;
}

/**
 * 生成排行榜色彩应用矩阵
 *
 * 应用位置规范:
 * | 应用位置 | 不透明度 | 混合模式 | 备注 |
 * |---------|---------|---------|------|
 * | 胶囊底层渐变起点 | 5% | normal | 左侧 |
 * | 胶囊底层渐变终点 | 12% | normal | 右侧 |
 * | TOP3 徽章背景 | 15% | normal | 圆形内 |
 * | TOP3 徽章描边 | 80%-100% | normal | 流光动画 |
 * | 价格文字 | 100% | normal | 高饱和原色 |
 * | 当前榜单核心参数值 | 100% | normal | 高饱和原色 |
 * | 分数小数点后数字 | 100% | normal | 高饱和原色 |
 * | Tab 下划线 | 100% | normal | 取当前榜首机型主题色 |
 */
export function generateRankingColorMatrix(primaryHex: string): RankingColorMatrix {
  const rgb = hexToRgb(primaryHex);
  if (!rgb) {
    return getDefaultRankingColorMatrix();
  }

  const { r, g, b } = rgb;

  return {
    // 1. 胶囊底层渐变起点: 5% opacity
    capsuleGradientStart: `rgba(${r}, ${g}, ${b}, 0.05)`,
    // 2. 胶囊底层渐变终点: 12% opacity
    capsuleGradientEnd: `rgba(${r}, ${g}, ${b}, 0.12)`,
    // 3. TOP3 徽章背景: 15% opacity
    top3BadgeBackground: `rgba(${r}, ${g}, ${b}, 0.15)`,
    // 4. TOP3 徽章描边: 80%-100% opacity (使用高饱和原色)
    top3BadgeStroke: `rgba(${r}, ${g}, ${b}, 0.9)`,
    // 5. 价格文字: 100% opacity, 高饱和原色
    priceText: primaryHex,
    // 6. 当前榜单核心参数值: 100% opacity, 高饱和原色
    coreParamValue: primaryHex,
    // 7. 分数小数点后数字: 100% opacity, 高饱和原色
    scoreDecimal: primaryHex,
    // 8. Tab 下划线: 100% opacity, 取当前榜首机型主题色
    tabUnderline: primaryHex,
  };
}

/**
 * 默认排行榜色彩矩阵
 */
export function getDefaultRankingColorMatrix(): RankingColorMatrix {
  const defaultColor = "0, 217, 255";
  const defaultHex = "#00D9FF";

  return {
    capsuleGradientStart: `rgba(${defaultColor}, 0.05)`,
    capsuleGradientEnd: `rgba(${defaultColor}, 0.12)`,
    top3BadgeBackground: `rgba(${defaultColor}, 0.15)`,
    top3BadgeStroke: `rgba(${defaultColor}, 0.9)`,
    priceText: defaultHex,
    coreParamValue: defaultHex,
    scoreDecimal: defaultHex,
    tabUnderline: defaultHex,
  };
}

/**
 * 生成排行榜 CSS 变量
 */
export function generateRankingCssVars(matrix: RankingColorMatrix): Record<string, string> {
  return {
    "--ranking-capsule-start": matrix.capsuleGradientStart,
    "--ranking-capsule-end": matrix.capsuleGradientEnd,
    "--ranking-badge-bg": matrix.top3BadgeBackground,
    "--ranking-badge-stroke": matrix.top3BadgeStroke,
    "--ranking-price": matrix.priceText,
    "--ranking-param": matrix.coreParamValue,
    "--ranking-score-decimal": matrix.scoreDecimal,
    "--ranking-tab-underline": matrix.tabUnderline,
  };
}

/**
 * 获取品牌主色并生成排行榜矩阵 (便捷函数)
 */
export function getRankingMatrixForPhone(brand: string, customHex?: string): RankingColorMatrix {
  const primaryHex = customHex || getPhonePrimaryColor(brand);
  return generateRankingColorMatrix(primaryHex);
}

/**
 * 获取当前榜单榜首的主题色
 */
export function getLeaderboardThemeColor(rankings: { brand: string; primaryColor?: string }[]): string {
  if (rankings.length === 0) return "#00D9FF";
  const leader = rankings[0];
  return leader.primaryColor || getPhonePrimaryColor(leader.brand);
}

// ============================================================================
// 色彩秩序约束 - 3:7 法则 + 连续相近色降饱和
// ============================================================================

export interface ColorOrderConfig {
  /** 主题色最大视觉占比 (默认 0.3 = 30%) */
  maxThemeRatio: number;
  /** 深灰/毛玻璃最小占比 (默认 0.7 = 70%) */
  minNeutralRatio: number;
  /** 连续相近色判定阈值 (色相角度差，默认 30度) */
  similarHueThreshold: number;
  /** 第2、3款降饱和目标 (默认 0.1 = 10%) */
  desaturateTarget: number;
}

const DEFAULT_COLOR_ORDER_CONFIG: ColorOrderConfig = {
  maxThemeRatio: 0.3,
  minNeutralRatio: 0.7,
  similarHueThreshold: 30,
  desaturateTarget: 0.1,
};

/**
 * 计算两个颜色的色相差异
 */
export function getHueDifference(hex1: string, hex2: string): number {
  const hsb1 = hexToHsb(hex1);
  const hsb2 = hexToHsb(hex2);
  if (!hsb1 || !hsb2) return 360;

  const diff = Math.abs(hsb1.h - hsb2.h);
  return Math.min(diff, 360 - diff);
}

/**
 * 判断两个颜色是否相近
 */
export function areColorsSimilar(hex1: string, hex2: string, threshold: number = 30): boolean {
  return getHueDifference(hex1, hex2) <= threshold;
}

/**
 * 对连续相近色进行降饱和处理
 *
 * 规则：若连续多个机型主题色相近，第2、3款自动降低饱和度至10%
 */
export function applyColorOrderConstraint(
  colors: string[],
  config: Partial<ColorOrderConfig> = {}
): string[] {
  const cfg = { ...DEFAULT_COLOR_ORDER_CONFIG, ...config };

  if (colors.length === 0) return [];

  const result: string[] = [colors[0]];
  let similarStreak = 1;

  for (let i = 1; i < colors.length; i++) {
    const prevColor = result[i - 1];
    const currentColor = colors[i];

    if (areColorsSimilar(prevColor, currentColor, cfg.similarHueThreshold)) {
      similarStreak++;
      if (similarStreak >= 2 && similarStreak <= 3) {
        // 第2、3款降低饱和度至10%
        const hsb = hexToHsb(currentColor);
        if (hsb) {
          const desaturated: HSBColor = {
            h: hsb.h,
            s: Math.round(hsb.s * cfg.desaturateTarget),
            b: hsb.b,
          };
          result.push(hsbToHex(desaturated));
          continue;
        }
      }
    } else {
      similarStreak = 1;
    }

    result.push(currentColor);
  }

  return result;
}

/**
 * 计算色彩在胶囊卡片中的视觉占比
 *
 * 基于色彩应用矩阵各位置的面积权重估算
 */
export function calculateColorCoverage(matrix: RankingColorMatrix): number {
  // 各位置的视觉权重（基于面积和透明度）
  const weights = {
    capsuleGradient: 0.5,   // 底层渐变覆盖整个卡片，但透明度低
    badge: 0.08,            // 徽章面积小
    price: 0.05,            // 价格文字面积很小
    score: 0.07,            // 分数面积较小
  };

  // 提取不透明度
  const startOpacity = extractOpacity(matrix.capsuleGradientStart);
  const endOpacity = extractOpacity(matrix.capsuleGradientEnd);
  const avgGradientOpacity = (startOpacity + endOpacity) / 2;

  const badgeOpacity = extractOpacity(matrix.top3BadgeBackground);

  // 计算加权视觉占比
  const coverage =
    avgGradientOpacity * weights.capsuleGradient +
    badgeOpacity * weights.badge +
    1.0 * weights.price +  // 价格文字100%不透明
    1.0 * weights.score;   // 分数100%不透明

  return Math.min(coverage, 1.0);
}

/**
 * 从 rgba 字符串提取不透明度
 */
function extractOpacity(rgba: string): number {
  const match = rgba.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1.0;
}

/**
 * 生成符合 3:7 法则的色彩矩阵
 *
 * 如果计算出的视觉占比超过30%，自动降低底层渐变的不透明度
 */
export function generateConstrainedMatrix(
  primaryHex: string,
  config: Partial<ColorOrderConfig> = {}
): RankingColorMatrix {
  const cfg = { ...DEFAULT_COLOR_ORDER_CONFIG, ...config };
  const matrix = generateRankingColorMatrix(primaryHex);

  const coverage = calculateColorCoverage(matrix);

  if (coverage > cfg.maxThemeRatio) {
    // 需要降低底层渐变的不透明度以符合 3:7 法则
    const scale = cfg.maxThemeRatio / coverage;
    const rgb = hexToRgb(primaryHex);
    if (rgb) {
      const { r, g, b } = rgb;
      return {
        ...matrix,
        capsuleGradientStart: `rgba(${r}, ${g}, ${b}, ${Math.max(0.02, 0.05 * scale)})`,
        capsuleGradientEnd: `rgba(${r}, ${g}, ${b}, ${Math.max(0.05, 0.12 * scale)})`,
      };
    }
  }

  return matrix;
}

// ============================================================================
// 多配色机型处理
// ============================================================================

/**
 * 获取机型的当前有效颜色
 *
 * 优先级：
 * 1. 用户选中的配色 (selectedColorId)
 * 2. 默认主销色 (isDefault)
 * 3. 品牌主色
 */
export function getPhoneEffectiveColor(
  brand: string,
  colorOptions?: { id: string; hex: string; isDefault?: boolean }[],
  selectedColorId?: string
): string {
  // 1. 用户选中的配色
  if (selectedColorId && colorOptions) {
    const selected = colorOptions.find((c) => c.id === selectedColorId);
    if (selected) return selected.hex;
  }

  // 2. 默认主销色
  if (colorOptions && colorOptions.length > 0) {
    const defaultColor = colorOptions.find((c) => c.isDefault);
    if (defaultColor) return defaultColor.hex;
    return colorOptions[0].hex;
  }

  // 3. 品牌主色
  return getPhonePrimaryColor(brand);
}

/**
 * 批量处理排行榜颜色（含连续相近色降饱和）
 */
export function processRankingColors(
  phones: { brand: string; colorOptions?: { id: string; hex: string; isDefault?: boolean }[]; selectedColorId?: string }[],
  config?: Partial<ColorOrderConfig>
): string[] {
  // 1. 获取每个机型的有效颜色
  const rawColors = phones.map((phone) =>
    getPhoneEffectiveColor(phone.brand, phone.colorOptions, phone.selectedColorId)
  );

  // 2. 应用连续相近色降饱和
  return applyColorOrderConstraint(rawColors, config);
}
