/**
 * 手机库数据接口约定
 * 前端期望后端返回的数据结构
 */

export type PhoneStatus = "released" | "upcoming";
export type PhoneCategory = "旗舰机" | "中端机" | "入门机" | "性能机" | "影像旗舰" | "小屏旗舰" | "折叠屏" | "性价比" | "游戏手机";

export interface PhoneSpecs {
  chip: string;          // "A18 Pro"
  screen: string;        // "6.9英寸 OLED"
  battery: string;       // "4685mAh"
  charging: string;      // "40W"
  camera: string;        // "48MP+12MP+12MP"
  os: string;            // "iOS 18"
}

export interface Phone {
  id: string;
  brand: string;           // "Apple"
  brandCN: string;         // "苹果"
  model: string;           // "iPhone 16 Pro Max"
  category: PhoneCategory; // "旗舰机" | "中端机" | "入门机"
  price: number;           // 9999
  priceNote?: string;      // "首发价" | "均价"
  releaseDate: string;     // ISO 日期 "2026-04-20"
  status: PhoneStatus;     // "released" | "upcoming"
  heatScore: number;       // 0-100
  isEditorsPick?: boolean; // true 时覆盖热度为"编辑精选"
  tags: string[];          // ["长续航", "影像旗舰"]
  specs: PhoneSpecs;
  heatTrend: number[];     // 近7天热度数组，长度7，用于Hero和热度条
  outlineSVG: string;      // 手机轮廓SVG path数据或完整SVG字符串
}

// 热度等级映射
export type HeatLevel = "cold" | "discussing" | "hot" | "boom" | "editor";

/**
 * 将热度分数映射到热度等级
 */
export function mapHeatScoreToLevel(score: number, isEditorsPick?: boolean): HeatLevel {
  if (isEditorsPick) return "editor";
  if (score >= 76) return "boom";
  if (score >= 51) return "hot";
  if (score >= 31) return "discussing";
  return "cold";
}

// 手机轮廓类型（用于SVG渲染）
export type PhoneOutlineType = "flat" | "curved" | "triple-camera" | "quad-camera" | "foldable";

/**
 * 从 outlineSVG 推断手机轮廓类型
 * 用于向后兼容渲染
 */
export function inferOutlineType(svg: string): PhoneOutlineType {
  if (svg.includes("triple") || svg.includes("三摄")) return "triple-camera";
  if (svg.includes("quad") || svg.includes("四摄")) return "quad-camera";
  if (svg.includes("fold") || svg.includes("折叠")) return "foldable";
  if (svg.includes("curve") || svg.includes("曲面")) return "curved";
  return "flat";
}

// 对比用简化手机数据
export interface PhoneCompareItem {
  id: string;
  brand: string;
  model: string;
  price: number;
  specs: Pick<PhoneSpecs, "chip" | "screen" | "battery">;
  outlineType: PhoneOutlineType;
}
