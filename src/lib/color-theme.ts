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

// ============================================================================
// 模块一: 动态主题色系统优化 - 情绪属性分析与完整配色方案
// ============================================================================

/**
 * 色彩情绪属性
 */
export interface ColorEmotion {
  /** 冷暖属性: warm(暖) | cool(冷) | neutral(中性) */
  temperature: "warm" | "cool" | "neutral";
  /** 饱和度属性: saturated(饱和) | muted(淡雅) | monochrome(单色) */
  saturation: "saturated" | "muted" | "monochrome";
  /** 亮度属性: bright(明亮) | medium(中等) | dark(暗沉) */
  brightness: "bright" | "medium" | "dark";
  /** 情绪标签数组 */
  moodTags: string[];
}

/**
 * 完整配色方案
 */
export interface ColorScheme {
  /** 页面主色调 (用于按钮、强调文字) */
  primary: string;
  /** 次要色 (用于次级强调) */
  secondary: string;
  /** 高光色 (用于发光效果、边框) */
  highlight: string;
  /** 背景渐变起点 */
  backgroundFrom: string;
  /** 背景渐变终点 */
  backgroundTo: string;
  /** 点缀色 (用于小面积强调、图标) */
  accent: string;
  /** 文字主色 */
  textPrimary: string;
  /** 文字次要色 */
  textSecondary: string;
}

/**
 * 手机配色档案 (增强版)
 */
export interface PhoneColorScheme {
  /** 机型标识 */
  phoneId: string;
  brand: string;
  model: string;
  /** 机身颜色名称 */
  bodyColorName: string;
  /** 机身颜色HEX */
  bodyColor: string;
  /** 情绪属性 */
  emotion: ColorEmotion;
  /** 完整配色方案 */
  scheme: ColorScheme;
  /** CSS 变量对象 */
  cssVars: Record<string, string>;
}

/**
 * 分析色彩情绪属性
 * 
 * 冷暖判断基于色相:
 * - 暖色: 0-60° (红-黄), 300-360° (紫红)
 * - 冷色: 60-180° (黄绿-青), 180-300° (蓝-紫)
 * - 中性: 灰度或近灰度
 * 
 * 饱和度判断:
 * - saturated: S > 50%
 * - muted: 20% < S <= 50%
 * - monochrome: S <= 20%
 */
export function analyzeColorEmotion(hex: string): ColorEmotion {
  const hsb = hexToHsb(hex);
  if (!hsb) {
    return {
      temperature: "neutral",
      saturation: "monochrome",
      brightness: "medium",
      moodTags: ["经典", "稳重"],
    };
  }

  const { h, s, b } = hsb;

  // 冷暖判断
  let temperature: ColorEmotion["temperature"];
  if (s <= 15) {
    temperature = "neutral"; // 灰度/近灰度
  } else if ((h >= 0 && h < 60) || (h >= 300 && h <= 360)) {
    temperature = "warm";
  } else if ((h >= 60 && h < 180) || (h >= 180 && h < 300)) {
    temperature = "cool";
  } else {
    temperature = "neutral";
  }

  // 饱和度判断
  let saturation: ColorEmotion["saturation"];
  if (s > 50) {
    saturation = "saturated";
  } else if (s > 20) {
    saturation = "muted";
  } else {
    saturation = "monochrome";
  }

  // 亮度判断
  let brightness: ColorEmotion["brightness"];
  if (b > 70) {
    brightness = "bright";
  } else if (b > 40) {
    brightness = "medium";
  } else {
    brightness = "dark";
  }

  // 生成情绪标签
  const moodTags = generateMoodTags(temperature, saturation, brightness, h);

  return { temperature, saturation, brightness, moodTags };
}

/**
 * 根据色彩属性生成情绪标签
 */
function generateMoodTags(
  temp: ColorEmotion["temperature"],
  sat: ColorEmotion["saturation"],
  bright: ColorEmotion["brightness"],
  hue: number
): string[] {
  const tags: string[] = [];

  // 基于冷暖
  if (temp === "warm") tags.push("温暖", "活力");
  else if (temp === "cool") tags.push("冷静", "科技");
  else tags.push("经典", "稳重");

  // 基于饱和度
  if (sat === "saturated") tags.push("鲜明");
  else if (sat === "muted") tags.push("雅致");
  else tags.push("简约");

  // 基于亮度
  if (bright === "bright") tags.push("轻盈");
  else if (bright === "dark") tags.push("深邃");

  // 基于具体色相的细分
  if (hue >= 350 || hue < 15) tags.push("热情");
  else if (hue >= 15 && hue < 45) tags.push("活力");
  else if (hue >= 45 && hue < 75) tags.push("清新");
  else if (hue >= 75 && hue < 105) tags.push("自然");
  else if (hue >= 105 && hue < 150) tags.push("生机");
  else if (hue >= 150 && hue < 195) tags.push("宁静");
  else if (hue >= 195 && hue < 240) tags.push("智慧");
  else if (hue >= 240 && hue < 285) tags.push("神秘");
  else if (hue >= 285 && hue < 330) tags.push("优雅");

  return [...new Set(tags)]; // 去重
}

/**
 * 计算互补色 (用于点缀色)
 */
export function getComplementaryColor(hex: string): string {
  const hsb = hexToHsb(hex);
  if (!hsb) return "#FF6B35";

  const complementaryHue = (hsb.h + 180) % 360;
  return hsbToHex({
    h: complementaryHue,
    s: Math.min(100, hsb.s + 20),
    b: Math.min(100, hsb.b + 10),
  });
}

/**
 * 计算分裂互补色 (用于高光色)
 */
export function getSplitComplementary(hex: string): string[] {
  const hsb = hexToHsb(hex);
  if (!hsb) return ["#00D4AA", "#A855F7"];

  const hue1 = (hsb.h + 150) % 360;
  const hue2 = (hsb.h + 210) % 360;

  return [
    hsbToHex({ h: hue1, s: Math.min(100, hsb.s + 10), b: Math.min(100, hsb.b + 5) }),
    hsbToHex({ h: hue2, s: Math.min(100, hsb.s + 10), b: Math.min(100, hsb.b + 5) }),
  ];
}

/**
 * 生成背景渐变
 * 根据机身颜色智能生成和谐的渐变
 */
export function generateBackgroundGradient(
  bodyColor: string,
  emotion: ColorEmotion
): { from: string; to: string } {
  const hsb = hexToHsb(bodyColor);
  if (!hsb) {
    return { from: "#0f111a", to: "#080c14" };
  }

  const { temperature, brightness } = emotion;

  // 根据情绪调整背景策略
  if (brightness === "dark") {
    // 深色机身: 深空黑 + 边缘光
    const edgeHue = (hsb.h + 30) % 360;
    return {
      from: "#1a1a2e",
      to: hsbToHex({ h: edgeHue, s: 30, b: 15 }),
    };
  }

  if (temperature === "warm") {
    // 暖色机身: 暖灰渐变
    return {
      from: hsbToHex({ h: hsb.h, s: 8, b: 92 }),
      to: hsbToHex({ h: hsb.h, s: 12, b: 85 }),
    };
  }

  if (temperature === "cool") {
    // 冷色机身: 冰蓝/冷灰渐变
    return {
      from: hsbToHex({ h: hsb.h, s: 10, b: 95 }),
      to: hsbToHex({ h: hsb.h, s: 15, b: 88 }),
    };
  }

  // 中性色: 通用高级灰
  return {
    from: "#f8f9fa",
    to: "#e9ecef",
  };
}

/**
 * 生成完整配色方案
 */
export function generateCompleteColorScheme(bodyColor: string): ColorScheme {
  const emotion = analyzeColorEmotion(bodyColor);
  const hsb = hexToHsb(bodyColor) || { h: 0, s: 0, b: 50 };

  // 主色: 稍微提升饱和度用于UI强调
  const primary = hsbToHex({
    h: hsb.h,
    s: Math.min(100, hsb.s + 15),
    b: Math.min(100, hsb.b + 5),
  });

  // 次要色: 同色系较浅版本
  const secondary = hsbToHex({
    h: hsb.h,
    s: Math.max(0, hsb.s - 20),
    b: Math.min(100, hsb.b + 15),
  });

  // 高光色: 分裂互补色之一
  const splitComps = getSplitComplementary(bodyColor);
  const highlight = splitComps[0];

  // 背景渐变
  const bgGradient = generateBackgroundGradient(bodyColor, emotion);

  // 点缀色: 互补色
  const accent = getComplementaryColor(bodyColor);

  // 文字颜色: 根据背景亮度决定
  const isLightBackground = emotion.brightness === "bright";
  const textPrimary = isLightBackground ? "#1a1a2e" : "#f8f9fa";
  const textSecondary = isLightBackground ? "#495057" : "#adb5bd";

  return {
    primary,
    secondary,
    highlight,
    backgroundFrom: bgGradient.from,
    backgroundTo: bgGradient.to,
    accent,
    textPrimary,
    textSecondary,
  };
}

/**
 * 生成手机配色档案
 */
export function createPhoneColorScheme(
  phoneId: string,
  brand: string,
  model: string,
  bodyColorName: string,
  bodyColor: string
): PhoneColorScheme {
  const emotion = analyzeColorEmotion(bodyColor);
  const scheme = generateCompleteColorScheme(bodyColor);

  // 生成 CSS 变量
  const cssVars: Record<string, string> = {
    "--phone-primary": scheme.primary,
    "--phone-secondary": scheme.secondary,
    "--phone-highlight": scheme.highlight,
    "--phone-accent": scheme.accent,
    "--phone-bg-from": scheme.backgroundFrom,
    "--phone-bg-to": scheme.backgroundTo,
    "--phone-text-primary": scheme.textPrimary,
    "--phone-text-secondary": scheme.textSecondary,
    "--phone-emotion-temp": emotion.temperature,
    "--phone-emotion-sat": emotion.saturation,
    "--phone-emotion-bright": emotion.brightness,
  };

  return {
    phoneId,
    brand,
    model,
    bodyColorName,
    bodyColor,
    emotion,
    scheme,
    cssVars,
  };
}

// ============================================================================
// 三星 Galaxy S25 Ultra 配色映射示例
// ============================================================================

export interface PhoneColorMapping {
  bodyColorName: string;
  bodyColor: string;
  pagePrimary: string;
  backgroundGradient: string;
  accentColor: string;
  moodTags: string[];
}

export const GALAXY_S25_ULTRA_COLORS: PhoneColorMapping[] = [
  {
    bodyColorName: "钛灰",
    bodyColor: "#E8E4E0",
    pagePrimary: "#C5C0BC",
    backgroundGradient: "linear-gradient(180deg, #E8E4E0 0%, #C5C0BC 100%)",
    accentColor: "#FF6B35",
    moodTags: ["沉稳", "商务"],
  },
  {
    bodyColorName: "钛蓝",
    bodyColor: "#D6E4F0",
    pagePrimary: "#A8C8EC",
    backgroundGradient: "linear-gradient(180deg, #D6E4F0 0%, #A8C8EC 100%)",
    accentColor: "#00D4AA",
    moodTags: ["冷静", "科技"],
  },
  {
    bodyColorName: "钛黑",
    bodyColor: "#2A2A2A",
    pagePrimary: "#1A1A1A",
    backgroundGradient: "linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)",
    accentColor: "#A855F7",
    moodTags: ["神秘", "高端"],
  },
  {
    bodyColorName: "钛雾金",
    bodyColor: "#F5E6D3",
    pagePrimary: "#E8D5B7",
    backgroundGradient: "linear-gradient(180deg, #F5E6D3 0%, #E8D5B7 100%)",
    accentColor: "#FFD700",
    moodTags: ["奢华", "温暖"],
  },
];

/**
 * 根据机身颜色名称获取 S25 Ultra 配色方案
 */
export function getGalaxyS25UltraScheme(colorName: string): PhoneColorScheme | null {
  const mapping = GALAXY_S25_ULTRA_COLORS.find(
    (c) => c.bodyColorName === colorName
  );
  if (!mapping) return null;

  return createPhoneColorScheme(
    "s25-ultra",
    "Samsung",
    "Galaxy S25 Ultra",
    mapping.bodyColorName,
    mapping.bodyColor
  );
}

// ============================================================================
// 扩展品牌色映射 (支持更多机型配色)
// ============================================================================

/**
 * 机型特定配色配置
 * 用于存储特定机型不同机身颜色的配色方案
 */
export interface ModelColorConfig {
  brand: string;
  model: string;
  colors: {
    colorName: string;
    hex: string;
    isDefault?: boolean;
  }[];
}

/**
 * 预设机型配色数据库
 */
export const PHONE_MODEL_COLORS: Record<string, ModelColorConfig> = {
  "samsung-galaxy-s25-ultra": {
    brand: "Samsung",
    model: "Galaxy S25 Ultra",
    colors: [
      { colorName: "钛灰", hex: "#E8E4E0", isDefault: true },
      { colorName: "钛蓝", hex: "#D6E4F0" },
      { colorName: "钛黑", hex: "#2A2A2A" },
      { colorName: "钛雾金", hex: "#F5E6D3" },
    ],
  },
  "apple-iphone-16-pro": {
    brand: "Apple",
    model: "iPhone 16 Pro",
    colors: [
      { colorName: "沙漠钛金属", hex: "#C4B5A0", isDefault: true },
      { colorName: "原色钛金属", hex: "#A8A29E" },
      { colorName: "白色钛金属", hex: "#F5F5F0" },
      { colorName: "黑色钛金属", hex: "#2D2D2D" },
    ],
  },
  "xiaomi-15-ultra": {
    brand: "Xiaomi",
    model: "15 Ultra",
    colors: [
      { colorName: "经典黑银", hex: "#1A1A1A", isDefault: true },
      { colorName: "松柏绿", hex: "#2D5016" },
      { colorName: "白色", hex: "#FAFAFA" },
    ],
  },
};

/**
 * 根据机型ID获取配色配置
 */
export function getModelColorConfig(modelId: string): ModelColorConfig | null {
  return PHONE_MODEL_COLORS[modelId] || null;
}

/**
 * 获取机型的所有配色方案
 */
export function getAllColorSchemesForModel(
  modelId: string
): PhoneColorScheme[] {
  const config = getModelColorConfig(modelId);
  if (!config) return [];

  return config.colors.map((color) =>
    createPhoneColorScheme(
      modelId,
      config.brand,
      config.model,
      color.colorName,
      color.hex
    )
  );
}

// ============================================================================
// 动态应用规则 - 各层透明度与效果规范
// ============================================================================

/**
 * 动态主题应用规则
 * 
 * 应用层级规范:
 * - 背景层: 主色 15% 透明度 + 白色/黑色基底
 * - 卡片层: 主色 8% 透明度 + 背景模糊 20px
 * - 文字层: 主色 100% 用于标题, 60% 用于正文
 * - 高亮层: 辅色用于按钮、标签、进度条
 * - 光效层: 高光色用于粒子、波纹、边框发光
 */
export interface DynamicThemeRules {
  // 背景层
  background: {
    base: string;           // 基底颜色
    overlay: string;        // 主色 15% 透明度叠加
    gradient: string;       // 完整背景渐变
  };
  // 卡片层
  card: {
    background: string;     // 主色 8% 透明度
    blur: string;           // backdrop-filter 值
    border: string;         // 边框颜色
  };
  // 文字层
  text: {
    primary: string;        // 主色 100%
    secondary: string;      // 主色 60%
    tertiary: string;       // 主色 40%
  };
  // 高亮层
  highlight: {
    button: string;         // 辅色按钮背景
    buttonText: string;     // 按钮文字色
    tag: string;            // 标签背景
    tagText: string;        // 标签文字
    progress: string;       // 进度条颜色
  };
  // 光效层
  glow: {
    particle: string;       // 粒子颜色
    ripple: string;         // 波纹颜色
    border: string;         // 边框发光
    shadow: string;         // 阴影发光
  };
}

/**
 * 生成动态主题应用规则
 */
export function generateDynamicThemeRules(
  scheme: ColorScheme,
  isDarkMode: boolean = true
): DynamicThemeRules {
  const primaryRgb = hexToRgb(scheme.primary);
  const secondaryRgb = hexToRgb(scheme.secondary);
  const highlightRgb = hexToRgb(scheme.highlight);

  const primary = primaryRgb
    ? `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`
    : "128, 128, 128";
  const secondary = secondaryRgb
    ? `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`
    : "128, 128, 128";
  const highlight = highlightRgb
    ? `${highlightRgb.r}, ${highlightRgb.g}, ${highlightRgb.b}`
    : "128, 128, 128";

  // 判断基底颜色（根据背景亮度）
  const bgRgb = hexToRgb(scheme.backgroundFrom);
  const bgLuminance = bgRgb
    ? (0.299 * bgRgb.r + 0.587 * bgRgb.g + 0.114 * bgRgb.b) / 255
    : 0.5;
  const baseColor = bgLuminance > 0.5 ? "255, 255, 255" : "8, 12, 20";

  return {
    background: {
      base: `rgb(${baseColor})`,
      overlay: `rgba(${primary}, 0.15)`,
      gradient: `linear-gradient(180deg, ${scheme.backgroundFrom} 0%, ${scheme.backgroundTo} 100%)`,
    },
    card: {
      background: `rgba(${primary}, 0.08)`,
      blur: "blur(20px)",
      border: `1px solid rgba(${primary}, 0.12)`,
    },
    text: {
      primary: scheme.primary,
      secondary: `rgba(${primary}, 0.6)`,
      tertiary: `rgba(${primary}, 0.4)`,
    },
    highlight: {
      button: scheme.secondary,
      buttonText: isDarkMode ? scheme.backgroundFrom : "#ffffff",
      tag: `rgba(${secondary}, 0.2)`,
      tagText: scheme.secondary,
      progress: scheme.secondary,
    },
    glow: {
      particle: scheme.highlight,
      ripple: `rgba(${highlight}, 0.4)`,
      border: `rgba(${highlight}, 0.5)`,
      shadow: `0 0 20px rgba(${highlight}, 0.3), 0 0 40px rgba(${highlight}, 0.1)`,
    },
  };
}

/**
 * 生成动态主题 CSS 变量
 */
export function generateDynamicThemeCssVars(
  scheme: ColorScheme,
  isDarkMode: boolean = true
): Record<string, string> {
  const rules = generateDynamicThemeRules(scheme, isDarkMode);

  return {
    // 背景层
    "--dt-bg-base": rules.background.base,
    "--dt-bg-overlay": rules.background.overlay,
    "--dt-bg-gradient": rules.background.gradient,
    // 卡片层
    "--dt-card-bg": rules.card.background,
    "--dt-card-blur": rules.card.blur,
    "--dt-card-border": rules.card.border,
    // 文字层
    "--dt-text-primary": rules.text.primary,
    "--dt-text-secondary": rules.text.secondary,
    "--dt-text-tertiary": rules.text.tertiary,
    // 高亮层
    "--dt-highlight-button": rules.highlight.button,
    "--dt-highlight-button-text": rules.highlight.buttonText,
    "--dt-highlight-tag": rules.highlight.tag,
    "--dt-highlight-tag-text": rules.highlight.tagText,
    "--dt-highlight-progress": rules.highlight.progress,
    // 光效层
    "--dt-glow-particle": rules.glow.particle,
    "--dt-glow-ripple": rules.glow.ripple,
    "--dt-glow-border": rules.glow.border,
    "--dt-glow-shadow": rules.glow.shadow,
    // 过渡时间
    "--dt-transition-duration": "800ms",
    "--dt-transition-timing": "cubic-bezier(0.4, 0, 0.2, 1)",
  };
}

/**
 * 色彩呼吸动画关键帧 CSS
 * 用于粒子颜色的渐变过渡效果
 */
export function generateBreathingKeyframes(
  fromColor: string,
  toColor: string
): string {
  return `
@keyframes color-breathing {
  0%, 100% {
    color: ${fromColor};
    box-shadow: 0 0 10px ${fromColor}40;
  }
  50% {
    color: ${toColor};
    box-shadow: 0 0 20px ${toColor}60;
  }
}

@keyframes particle-color-shift {
  0% {
    background: ${fromColor};
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    background: ${toColor};
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    background: ${fromColor};
    opacity: 0.6;
    transform: scale(1);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 5px ${fromColor}40, 0 0 10px ${fromColor}20;
  }
  50% {
    box-shadow: 0 0 15px ${toColor}60, 0 0 30px ${toColor}30;
  }
}
`;
}

// ============================================================================
// 增强版配色档案（包含动态规则）
// ============================================================================

export interface EnhancedPhoneColorScheme extends PhoneColorScheme {
  dynamicRules: DynamicThemeRules;
  dynamicCssVars: Record<string, string>;
  breathingKeyframes: string;
}

/**
 * 创建增强版配色档案（包含动态规则）
 */
export function createEnhancedColorScheme(
  phoneId: string,
  brand: string,
  model: string,
  bodyColorName: string,
  bodyColor: string,
  isDarkMode: boolean = true
): EnhancedPhoneColorScheme {
  const baseScheme = createPhoneColorScheme(
    phoneId,
    brand,
    model,
    bodyColorName,
    bodyColor
  );

  const dynamicRules = generateDynamicThemeRules(baseScheme.scheme, isDarkMode);
  const dynamicCssVars = generateDynamicThemeCssVars(baseScheme.scheme, isDarkMode);
  const breathingKeyframes = generateBreathingKeyframes(
    baseScheme.scheme.highlight,
    baseScheme.scheme.accent
  );

  return {
    ...baseScheme,
    dynamicRules,
    dynamicCssVars: {
      ...baseScheme.cssVars,
      ...dynamicCssVars,
    },
    breathingKeyframes,
  };
}
