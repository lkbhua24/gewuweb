export type ScreenType = "flat" | "curved" | "waterfall" | "foldable";

export type MaterialType = "default" | "titanium" | "ceramic";

/** 机身材质颜色选项 */
export interface PhoneColorOption {
  id: string;
  name: string;
  hex: string;
  isDefault?: boolean;
}

export interface PhoneRanking {
  id: string;
  rank: number;
  brand: string;
  model: string;
  imageUrl: string | null;
  priceCny: number | null;
  /** 屏幕类型：直屏、微曲面、瀑布屏、折叠屏 */
  screenType: ScreenType;
  /** 机身材质：默认、钛金属、陶瓷 */
  materialType?: MaterialType;
  /** 可选配色列表 */
  colorOptions?: PhoneColorOption[];
  /** 当前选中的配色ID */
  selectedColorId?: string;
  scores: {
    overall: number;
    heat: number;
    discussion: number;
    battery: number;
    camera: number;
    performance: number;
    screen: number;
    buildQuality: number;
    appearance: number;
    valueForMoney: number;
    userExperience: number;
  };
  /** 综合榜：短板提示 */
  weakPoint?: string;
  /** 性能榜：跑分（万位，如 218 代表 218万） */
  benchmark?: number;
  /** 性能榜：芯片型号 */
  chipset?: string;
  /** 性能榜：散热方案 */
  cooling?: string;
  /** 影像榜：主摄 CMOS 型号 */
  mainSensor?: string;
  /** 影像榜：焦段覆盖 */
  focalLength?: string;
  /** 续航榜：续航时长（小时） */
  batteryLife?: number;
  /** 续航榜：充电功率（W） */
  chargingPower?: number;
  /** 续航榜：电池容量（mAh） */
  batteryCapacity?: number;
  /** 屏幕榜：峰值亮度（nit） */
  peakBrightness?: number;
  /** 屏幕榜：调光方式 */
  dimming?: string;
  /** 性价比榜：同价位排名描述 */
  priceTierRank?: string;
  /** 性价比榜：降价幅度（元） */
  priceDrop?: number;
}

export type RankingType = 
  | "comprehensive"
  | "system"
  | "battery"
  | "camera"
  | "performance"
  | "screen"
  | "value";

export interface RankingCategory {
  id: RankingType;
  label: string;
  description: string;
  /** 页面副标题：一句话算法说明 */
  subtitle: string;
  scoreKey: keyof PhoneRanking["scores"];
}

export const RANKING_CATEGORIES: RankingCategory[] = [
  {
    id: "comprehensive",
    label: "综合",
    description: "综合各项维度的总体评分排行",
    subtitle: "基于 10 项维度加权综合算法",
    scoreKey: "overall",
  },
  {
    id: "system",
    label: "系统",
    description: "基于系统流畅度和功能体验的排行",
    subtitle: "基于系统流畅度与用户口碑加权算法",
    scoreKey: "userExperience",
  },
  {
    id: "battery",
    label: "续航",
    description: "基于电池容量和续航表现的排行",
    subtitle: "基于续航时长与充电速度加权算法",
    scoreKey: "battery",
  },
  {
    id: "camera",
    label: "影像",
    description: "基于拍照和录像能力的排行",
    subtitle: "基于 DXOMARK / 实拍样张加权算法",
    scoreKey: "camera",
  },
  {
    id: "performance",
    label: "性能",
    description: "基于处理器性能和使用流畅度的排行",
    subtitle: "基于 AnTuTu / Geekbench 6 加权算法",
    scoreKey: "performance",
  },
  {
    id: "screen",
    label: "屏幕",
    description: "基于屏幕显示质量的排行",
    subtitle: "基于亮度 / 色准 / 护眼指标加权算法",
    scoreKey: "screen",
  },
  {
    id: "value",
    label: "性价比",
    description: "基于性能与价格比的排行",
    subtitle: "基于性能得分与价格比值算法",
    scoreKey: "valueForMoney",
  },
];
