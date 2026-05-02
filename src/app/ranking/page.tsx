"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Trophy, Flame, MessageCircle, Battery, Camera, Cpu, Monitor, Gem, Sparkles, Coins, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RANKING_CATEGORIES, type RankingType, type PhoneRanking } from "@/types/ranking";
import {
  getPhonePrimaryColor,
  generateRankingColorMatrix,
  generateRankingCssVars,
  processRankingColors,
} from "@/lib/color-theme";
import { RankingCard } from "@/components/ranking/ranking-card";
import { cn } from "@/lib/utils";
import { getHeroTransitionState, setHeroTransitionState, loadPersistedReturnState, clearPersistedReturnState } from "@/hooks/use-hero-transition";

// ============================================================================
// Mock 数据 - 包含多配色选项
// ============================================================================

export const MOCK_RANKINGS: Record<RankingType, PhoneRanking[]> = {
  comprehensive: [
    {
      id: "1", rank: 1, brand: "Apple", model: "iPhone 16 Pro Max", imageUrl: null, priceCny: 9999, screenType: "flat", materialType: "titanium",
      colorOptions: [
        { id: "natural", name: "原色钛", hex: "#9A9A9A", isDefault: true },
        { id: "blue", name: "沙漠钛", hex: "#C4A882" },
        { id: "white", name: "白色钛", hex: "#F5F5F0" },
        { id: "black", name: "黑色钛", hex: "#2A2A2A" },
      ],
      scores: { overall: 9.8, heat: 9.9, discussion: 9.7, battery: 8.5, camera: 9.6, performance: 9.9, screen: 9.5, buildQuality: 9.8, appearance: 9.7, valueForMoney: 7.5, userExperience: 9.8 }
    },
    {
      id: "2", rank: 2, brand: "Samsung", model: "Galaxy S25 Ultra", imageUrl: null, priceCny: 9699, screenType: "waterfall",
      colorOptions: [
        { id: "blue", name: "钛川蓝", hex: "#4A90D9", isDefault: true },
        { id: "black", name: "钛影黑", hex: "#1A1A2E" },
        { id: "gray", name: "钛雾灰", hex: "#7A8B99" },
        { id: "coral", name: "钛慕橙", hex: "#FF7F50" },
      ],
      scores: { overall: 9.7, heat: 9.5, discussion: 9.3, battery: 9.0, camera: 9.7, performance: 9.7, screen: 9.8, buildQuality: 9.6, appearance: 9.5, valueForMoney: 7.8, userExperience: 9.6 }
    },
    {
      id: "3", rank: 3, brand: "Xiaomi", model: "小米 15 Ultra", imageUrl: null, priceCny: 5999, screenType: "curved", materialType: "ceramic",
      colorOptions: [
        { id: "black", name: "黑色", hex: "#1A1A1A", isDefault: true },
        { id: "white", name: "白色", hex: "#F8F8F8" },
        { id: "silver", name: "亮银版", hex: "#C0C0C0" },
      ],
      scores: { overall: 9.5, heat: 9.6, discussion: 9.4, battery: 8.8, camera: 9.8, performance: 9.6, screen: 9.4, buildQuality: 9.3, appearance: 9.4, valueForMoney: 9.2, userExperience: 9.4 }
    },
    {
      id: "4", rank: 4, brand: "Huawei", model: "Mate X6 Fold", imageUrl: null, priceCny: 12999, screenType: "foldable",
      colorOptions: [
        { id: "black", name: "曜石黑", hex: "#0D0D0D", isDefault: true },
        { id: "red", name: "瑞红", hex: "#CF0A2C" },
        { id: "blue", name: "深海蓝", hex: "#1E3A5F" },
      ],
      scores: { overall: 9.4, heat: 9.3, discussion: 9.5, battery: 9.2, camera: 9.5, performance: 9.0, screen: 9.3, buildQuality: 9.7, appearance: 9.6, valueForMoney: 7.9, userExperience: 9.5 }
    },
    {
      id: "5", rank: 5, brand: "OPPO", model: "Find X8 Pro", imageUrl: null, priceCny: 5299, screenType: "curved",
      colorOptions: [
        { id: "black", name: "星野黑", hex: "#0F0F23", isDefault: true },
        { id: "blue", name: "漫步云端", hex: "#E8F4FD" },
      ],
      scores: { overall: 9.3, heat: 9.2, discussion: 9.0, battery: 9.1, camera: 9.4, performance: 9.4, screen: 9.2, buildQuality: 9.2, appearance: 9.3, valueForMoney: 9.0, userExperience: 9.3 }
    },
    {
      id: "6", rank: 6, brand: "vivo", model: "X200 Pro", imageUrl: null, priceCny: 4999, screenType: "curved",
      colorOptions: [
        { id: "blue", name: "宝石蓝", hex: "#1E40AF", isDefault: true },
        { id: "orange", name: "钛色", hex: "#FF8C42" },
        { id: "white", name: "白月光", hex: "#FAFAFA" },
      ],
      scores: { overall: 9.2, heat: 9.1, discussion: 8.9, battery: 9.0, camera: 9.5, performance: 9.3, screen: 9.1, buildQuality: 9.1, appearance: 9.2, valueForMoney: 9.1, userExperience: 9.2 }
    },
    {
      id: "7", rank: 7, brand: "OnePlus", model: "一加 13", imageUrl: null, priceCny: 4499, screenType: "curved",
      colorOptions: [
        { id: "black", name: "黑曜秘境", hex: "#0A0A0A", isDefault: true },
        { id: "blue", name: "蓝调时刻", hex: "#3B82F6" },
      ],
      scores: { overall: 9.1, heat: 9.0, discussion: 8.8, battery: 8.9, camera: 9.0, performance: 9.5, screen: 9.3, buildQuality: 9.0, appearance: 9.1, valueForMoney: 9.3, userExperience: 9.1 }
    },
    {
      id: "8", rank: 8, brand: "Honor", model: "Magic V3", imageUrl: null, priceCny: 8999, screenType: "foldable",
      colorOptions: [
        { id: "black", name: "绒黑色", hex: "#1C1C1E", isDefault: true },
        { id: "green", name: "苔原绿", hex: "#4A6741" },
        { id: "white", name: "祁连雪", hex: "#F0F0F0" },
      ],
      scores: { overall: 9.0, heat: 8.9, discussion: 8.7, battery: 9.3, camera: 9.1, performance: 9.2, screen: 9.0, buildQuality: 9.1, appearance: 9.0, valueForMoney: 8.7, userExperience: 9.0 }
    },
    {
      id: "9", rank: 9, brand: "Google", model: "Pixel 9 Pro", imageUrl: null, priceCny: 7999, screenType: "flat",
      colorOptions: [
        { id: "pink", name: "粉晶", hex: "#FFB6C1", isDefault: true },
        { id: "green", name: "翡翠", hex: "#50C878" },
        { id: "gray", name: "石英", hex: "#D4D4D4" },
      ],
      scores: { overall: 8.9, heat: 8.5, discussion: 8.6, battery: 8.0, camera: 9.3, performance: 8.8, screen: 8.9, buildQuality: 8.8, appearance: 8.7, valueForMoney: 7.5, userExperience: 9.2 }
    },
    {
      id: "10", rank: 10, brand: "Realme", model: "GT7 Pro", imageUrl: null, priceCny: 3599, screenType: "flat",
      colorOptions: [
        { id: "orange", name: "火星", hex: "#FF6B35", isDefault: true },
        { id: "white", name: "星迹钛", hex: "#C8C8C8" },
      ],
      scores: { overall: 8.8, heat: 8.8, discussion: 8.5, battery: 9.2, camera: 8.5, performance: 9.4, screen: 8.8, buildQuality: 8.6, appearance: 8.7, valueForMoney: 9.5, userExperience: 8.8 }
    },
  ],
  system: [
    { id: "1", rank: 1, brand: "Apple", model: "iPhone 16 Pro Max", imageUrl: null, priceCny: 9999, screenType: "flat", scores: { overall: 9.8, heat: 9.9, discussion: 9.7, battery: 8.5, camera: 9.6, performance: 9.9, screen: 9.5, buildQuality: 9.8, appearance: 9.7, valueForMoney: 7.5, userExperience: 9.8 } },
    { id: "4", rank: 2, brand: "Huawei", model: "Mate 70 Pro+", imageUrl: null, priceCny: 8499, screenType: "curved", scores: { overall: 9.4, heat: 9.3, discussion: 9.5, battery: 9.2, camera: 9.5, performance: 9.0, screen: 9.3, buildQuality: 9.7, appearance: 9.6, valueForMoney: 7.9, userExperience: 9.5 } },
    { id: "2", rank: 3, brand: "Samsung", model: "Galaxy S25 Ultra", imageUrl: null, priceCny: 9699, screenType: "curved", scores: { overall: 9.7, heat: 9.5, discussion: 9.3, battery: 9.0, camera: 9.7, performance: 9.7, screen: 9.8, buildQuality: 9.6, appearance: 9.5, valueForMoney: 7.8, userExperience: 9.6 } },
    { id: "9", rank: 4, brand: "Google", model: "Pixel 9 Pro", imageUrl: null, priceCny: 7999, screenType: "flat", scores: { overall: 8.9, heat: 8.5, discussion: 8.6, battery: 8.0, camera: 9.3, performance: 8.8, screen: 8.9, buildQuality: 8.8, appearance: 8.7, valueForMoney: 7.5, userExperience: 9.2 } },
    { id: "3", rank: 5, brand: "Xiaomi", model: "小米 15 Ultra", imageUrl: null, priceCny: 5999, screenType: "curved", scores: { overall: 9.5, heat: 9.6, discussion: 9.4, battery: 8.8, camera: 9.8, performance: 9.6, screen: 9.4, buildQuality: 9.3, appearance: 9.4, valueForMoney: 9.2, userExperience: 9.4 } },
  ],
  battery: [
    { id: "8", rank: 1, brand: "Honor", model: "Magic7 Pro", imageUrl: null, priceCny: 5699, screenType: "curved", scores: { overall: 9.0, heat: 8.9, discussion: 8.7, battery: 9.3, camera: 9.1, performance: 9.2, screen: 9.0, buildQuality: 9.1, appearance: 9.0, valueForMoney: 8.7, userExperience: 9.0 } },
    { id: "10", rank: 2, brand: "Realme", model: "GT7 Pro", imageUrl: null, priceCny: 3599, screenType: "flat", scores: { overall: 8.8, heat: 8.8, discussion: 8.5, battery: 9.2, camera: 8.5, performance: 9.4, screen: 8.8, buildQuality: 8.6, appearance: 8.7, valueForMoney: 9.5, userExperience: 8.8 } },
    { id: "4", rank: 3, brand: "Huawei", model: "Mate 70 Pro+", imageUrl: null, priceCny: 8499, screenType: "curved", scores: { overall: 9.4, heat: 9.3, discussion: 9.5, battery: 9.2, camera: 9.5, performance: 9.0, screen: 9.3, buildQuality: 9.7, appearance: 9.6, valueForMoney: 7.9, userExperience: 9.5 } },
    { id: "5", rank: 4, brand: "OPPO", model: "Find X8 Pro", imageUrl: null, priceCny: 5299, screenType: "curved", scores: { overall: 9.3, heat: 9.2, discussion: 9.0, battery: 9.1, camera: 9.4, performance: 9.4, screen: 9.2, buildQuality: 9.2, appearance: 9.3, valueForMoney: 9.0, userExperience: 9.3 } },
    { id: "6", rank: 5, brand: "vivo", model: "X200 Pro", imageUrl: null, priceCny: 4999, screenType: "curved", scores: { overall: 9.2, heat: 9.1, discussion: 8.9, battery: 9.0, camera: 9.5, performance: 9.3, screen: 9.1, buildQuality: 9.1, appearance: 9.2, valueForMoney: 9.1, userExperience: 9.2 } },
  ],
  camera: [
    { id: "3", rank: 1, brand: "Xiaomi", model: "小米 15 Ultra", imageUrl: null, priceCny: 5999, screenType: "curved", scores: { overall: 9.5, heat: 9.6, discussion: 9.4, battery: 8.8, camera: 9.8, performance: 9.6, screen: 9.4, buildQuality: 9.3, appearance: 9.4, valueForMoney: 9.2, userExperience: 9.4 } },
    { id: "2", rank: 2, brand: "Samsung", model: "Galaxy S25 Ultra", imageUrl: null, priceCny: 9699, screenType: "curved", scores: { overall: 9.7, heat: 9.5, discussion: 9.3, battery: 9.0, camera: 9.7, performance: 9.7, screen: 9.8, buildQuality: 9.6, appearance: 9.5, valueForMoney: 7.8, userExperience: 9.6 } },
    { id: "6", rank: 3, brand: "vivo", model: "X200 Pro", imageUrl: null, priceCny: 4999, screenType: "curved", scores: { overall: 9.2, heat: 9.1, discussion: 8.9, battery: 9.0, camera: 9.5, performance: 9.3, screen: 9.1, buildQuality: 9.1, appearance: 9.2, valueForMoney: 9.1, userExperience: 9.2 } },
    { id: "4", rank: 4, brand: "Huawei", model: "Mate 70 Pro+", imageUrl: null, priceCny: 8499, screenType: "curved", scores: { overall: 9.4, heat: 9.3, discussion: 9.5, battery: 9.2, camera: 9.5, performance: 9.0, screen: 9.3, buildQuality: 9.7, appearance: 9.6, valueForMoney: 7.9, userExperience: 9.5 } },
    { id: "1", rank: 5, brand: "Apple", model: "iPhone 16 Pro Max", imageUrl: null, priceCny: 9999, screenType: "flat", scores: { overall: 9.8, heat: 9.9, discussion: 9.7, battery: 8.5, camera: 9.6, performance: 9.9, screen: 9.5, buildQuality: 9.8, appearance: 9.7, valueForMoney: 7.5, userExperience: 9.8 } },
  ],
  performance: [
    { id: "1", rank: 1, brand: "Apple", model: "iPhone 16 Pro Max", imageUrl: null, priceCny: 9999, screenType: "flat", scores: { overall: 9.8, heat: 9.9, discussion: 9.7, battery: 8.5, camera: 9.6, performance: 9.9, screen: 9.5, buildQuality: 9.8, appearance: 9.7, valueForMoney: 7.5, userExperience: 9.8 } },
    { id: "2", rank: 2, brand: "Samsung", model: "Galaxy S25 Ultra", imageUrl: null, priceCny: 9699, screenType: "curved", scores: { overall: 9.7, heat: 9.5, discussion: 9.3, battery: 9.0, camera: 9.7, performance: 9.7, screen: 9.8, buildQuality: 9.6, appearance: 9.5, valueForMoney: 7.8, userExperience: 9.6 } },
    { id: "3", rank: 3, brand: "Xiaomi", model: "小米 15 Ultra", imageUrl: null, priceCny: 5999, screenType: "curved", scores: { overall: 9.5, heat: 9.6, discussion: 9.4, battery: 8.8, camera: 9.8, performance: 9.6, screen: 9.4, buildQuality: 9.3, appearance: 9.4, valueForMoney: 9.2, userExperience: 9.4 } },
    { id: "10", rank: 4, brand: "Realme", model: "GT7 Pro", imageUrl: null, priceCny: 3599, screenType: "flat", scores: { overall: 8.8, heat: 8.8, discussion: 8.5, battery: 9.2, camera: 8.5, performance: 9.4, screen: 8.8, buildQuality: 8.6, appearance: 8.7, valueForMoney: 9.5, userExperience: 8.8 } },
    { id: "7", rank: 5, brand: "OnePlus", model: "一加 13", imageUrl: null, priceCny: 4499, screenType: "curved", scores: { overall: 9.1, heat: 9.0, discussion: 8.8, battery: 8.9, camera: 9.0, performance: 9.5, screen: 9.3, buildQuality: 9.0, appearance: 9.1, valueForMoney: 9.3, userExperience: 9.1 } },
  ],
  screen: [
    { id: "2", rank: 1, brand: "Samsung", model: "Galaxy S25 Ultra", imageUrl: null, priceCny: 9699, screenType: "curved", scores: { overall: 9.7, heat: 9.5, discussion: 9.3, battery: 9.0, camera: 9.7, performance: 9.7, screen: 9.8, buildQuality: 9.6, appearance: 9.5, valueForMoney: 7.8, userExperience: 9.6 } },
    { id: "7", rank: 2, brand: "OnePlus", model: "一加 13", imageUrl: null, priceCny: 4499, screenType: "curved", scores: { overall: 9.1, heat: 9.0, discussion: 8.8, battery: 8.9, camera: 9.0, performance: 9.5, screen: 9.3, buildQuality: 9.0, appearance: 9.1, valueForMoney: 9.3, userExperience: 9.1 } },
    { id: "1", rank: 3, brand: "Apple", model: "iPhone 16 Pro Max", imageUrl: null, priceCny: 9999, screenType: "flat", scores: { overall: 9.8, heat: 9.9, discussion: 9.7, battery: 8.5, camera: 9.6, performance: 9.9, screen: 9.5, buildQuality: 9.8, appearance: 9.7, valueForMoney: 7.5, userExperience: 9.8 } },
    { id: "3", rank: 4, brand: "Xiaomi", model: "小米 15 Ultra", imageUrl: null, priceCny: 5999, screenType: "curved", scores: { overall: 9.5, heat: 9.6, discussion: 9.4, battery: 8.8, camera: 9.8, performance: 9.6, screen: 9.4, buildQuality: 9.3, appearance: 9.4, valueForMoney: 9.2, userExperience: 9.4 } },
    { id: "4", rank: 5, brand: "Huawei", model: "Mate 70 Pro+", imageUrl: null, priceCny: 8499, screenType: "curved", scores: { overall: 9.4, heat: 9.3, discussion: 9.5, battery: 9.2, camera: 9.5, performance: 9.0, screen: 9.3, buildQuality: 9.7, appearance: 9.6, valueForMoney: 7.9, userExperience: 9.5 } },
  ],
  value: [
    { id: "10", rank: 1, brand: "Realme", model: "GT7 Pro", imageUrl: null, priceCny: 3599, screenType: "flat", scores: { overall: 8.8, heat: 8.8, discussion: 8.5, battery: 9.2, camera: 8.5, performance: 9.4, screen: 8.8, buildQuality: 8.6, appearance: 8.7, valueForMoney: 9.5, userExperience: 8.8 } },
    { id: "7", rank: 2, brand: "OnePlus", model: "一加 13", imageUrl: null, priceCny: 4499, screenType: "curved", scores: { overall: 9.1, heat: 9.0, discussion: 8.8, battery: 8.9, camera: 9.0, performance: 9.5, screen: 9.3, buildQuality: 9.0, appearance: 9.1, valueForMoney: 9.3, userExperience: 9.1 } },
    { id: "3", rank: 3, brand: "Xiaomi", model: "小米 15 Ultra", imageUrl: null, priceCny: 5999, screenType: "curved", scores: { overall: 9.5, heat: 9.6, discussion: 9.4, battery: 8.8, camera: 9.8, performance: 9.6, screen: 9.4, buildQuality: 9.3, appearance: 9.4, valueForMoney: 9.2, userExperience: 9.4 } },
    { id: "6", rank: 4, brand: "vivo", model: "X200 Pro", imageUrl: null, priceCny: 4999, screenType: "curved", scores: { overall: 9.2, heat: 9.1, discussion: 8.9, battery: 9.0, camera: 9.5, performance: 9.3, screen: 9.1, buildQuality: 9.1, appearance: 9.2, valueForMoney: 9.1, userExperience: 9.2 } },
    { id: "5", rank: 5, brand: "OPPO", model: "Find X8 Pro", imageUrl: null, priceCny: 5299, screenType: "curved", scores: { overall: 9.3, heat: 9.2, discussion: 9.0, battery: 9.1, camera: 9.4, performance: 9.4, screen: 9.2, buildQuality: 9.2, appearance: 9.3, valueForMoney: 9.0, userExperience: 9.3 } },
  ],
};

const SCORE_ICONS = {
  overall: Trophy,
  heat: Flame,
  discussion: MessageCircle,
  battery: Battery,
  camera: Camera,
  performance: Cpu,
  screen: Monitor,
  buildQuality: Gem,
  appearance: Sparkles,
  valueForMoney: Coins,
  userExperience: Star,
};

const SCORE_LABELS: Record<keyof PhoneRanking["scores"], string> = {
  overall: "综合评分",
  heat: "热度值",
  discussion: "讨论值",
  battery: "续航",
  camera: "影像",
  performance: "性能",
  screen: "屏幕",
  buildQuality: "外观质感",
  appearance: "颜值",
  valueForMoney: "性价比",
  userExperience: "综合体验",
};

// ============================================================================
// 主页面组件
// ============================================================================

export default function RankingPage() {
  const [activeCategory, setActiveCategory] = useState<RankingType>("comprehensive");
  const [displayCategory, setDisplayCategory] = useState<RankingType>("comprehensive");
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [rankings, setRankings] = useState(MOCK_RANKINGS);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  const currentRankings = rankings[displayCategory];
  const currentCategoryInfo = RANKING_CATEGORIES.find((c) => c.id === displayCategory);

  const handleCategoryChange = useCallback((category: RankingType) => {
    if (category === activeCategory) return;

    setIsContentVisible(false);

    setTimeout(() => {
      setActiveCategory(category);
      setDisplayCategory(category);
      requestAnimationFrame(() => {
        setIsContentVisible(true);
      });
    }, 180);
  }, [activeCategory]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    setVisibleItems(new Set());

    const rafId = requestAnimationFrame(() => {
      const items = container.querySelectorAll("[data-animate-item]");
      if (items.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute("data-animate-index") || "0", 10);
              setVisibleItems((prev) => new Set([...prev, index]));
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px" }
      );

      items.forEach((item) => observer.observe(item));

      return () => {
        observer.disconnect();
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [displayCategory, currentRankings.length]);

  // 获取每个机型的有效颜色，并应用连续相近色降饱和
  const processedColors = useMemo(() => {
    return processRankingColors(currentRankings);
  }, [currentRankings]);

  // 获取当前榜首的品牌主色（用于Tab下划线）
  const leaderColor = useMemo(() => {
    if (currentRankings.length === 0) return "#00D9FF";
    return getPhonePrimaryColor(currentRankings[0].brand);
  }, [currentRankings]);

  // 生成当前榜单的色彩矩阵
  const colorMatrix = useMemo(() => {
    return generateRankingColorMatrix(leaderColor);
  }, [leaderColor]);

  // 生成 CSS 变量
  const cssVars = useMemo(() => {
    return generateRankingCssVars(colorMatrix);
  }, [colorMatrix]);

  // 处理配色切换
  const handleColorSelect = useCallback((phoneId: string, colorId: string) => {
    setRankings((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((phone) =>
        phone.id === phoneId ? { ...phone, selectedColorId: colorId } : phone
      ),
    }));
  }, [activeCategory]);

  // 检测当前是否有 Hero 转场中的卡片
  const transitioningPhoneId = getHeroTransitionState().targetPhoneId;

  // 检测是否有返回状态（从详情页返回）
  const initialReturnState = useMemo(() => loadPersistedReturnState(), []);
  const [returnPhoneId, setReturnPhoneId] = useState<string | null>(
    initialReturnState?.phoneId || null
  );

  // 清理返回状态
  useEffect(() => {
    if (initialReturnState) {
      const timer = setTimeout(() => {
        setReturnPhoneId(null);
        clearPersistedReturnState();
        // 重置全局状态
        const current = getHeroTransitionState();
        if (current.phase === "returning") {
          // 通过重新设置状态来触发重新渲染
          setHeroTransitionState({
            phase: "idle",
            sourceRect: null,
            targetPhoneId: null,
            themeColor: "",
            phoneData: null,
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialReturnState]);

  return (
    <div className="ranking-page-bg font-ranking-cn" style={cssVars}>
      {/* 全局容器 */}
      <main className="ranking-container py-6">
        {/* 页面头部 */}
        <div className="mb-6 px-[4%] sm:px-0">
          <h1 className="text-2xl font-bold mb-2 font-ranking-cn">手机排行榜</h1>
          <p className="text-sm text-muted-foreground font-ranking-cn">
            基于多维度评分的手机排行，一机一色，动态主题
          </p>
        </div>

        {/* Tab 栏 */}
        <div className="mb-6 px-[4%] sm:px-0">
          <Tabs value={activeCategory} onValueChange={(v) => handleCategoryChange(v as RankingType)}>
            <TabsList
              variant="line"
              className="w-full justify-start flex-wrap ranking-tab-height h-auto gap-2 bg-transparent"
            >
              {RANKING_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2 font-ranking-cn ranking-layer-interactive data-[active=true]:after:bg-[var(--ranking-tab-underline)]"
                  style={{
                    ["--ranking-tab-underline" as string]: colorMatrix.tabUnderline,
                  }}
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* 当前分类信息 */}
        <div
          className={cn(
            "mb-4 px-[4%] sm:px-0 transition-all duration-300",
            isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold font-ranking-cn">{currentCategoryInfo?.label}</h2>
            <Badge variant="secondary" className="text-xs font-ranking-cn ranking-glass">
              实时更新
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-ranking-cn">
            {currentCategoryInfo?.description}
          </p>
        </div>

        {/* 排行榜列表 */}
        <div
          ref={listRef}
          className={cn(
            "flex flex-col ranking-card-gap px-[4%] sm:px-0 transition-all duration-300 ease-out",
            isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
        >
          {currentRankings.map((phone, index) => (
            <RankingCard
              key={phone.id}
              phone={phone}
              currentCategory={activeCategory}
              themeColor={processedColors[index] || getPhonePrimaryColor(phone.brand)}
              index={index}
              isVisible={visibleItems.has(index)}
              staggerDelay={50}
              onColorSelect={handleColorSelect}
              isPlaceholder={transitioningPhoneId === phone.id && returnPhoneId !== phone.id}
            />
          ))}
        </div>

        {/* 评分维度说明 */}
        <div className="mt-8 mx-[4%] sm:mx-0 p-4 rounded-xl ranking-glass">
          <h3 className="text-sm font-medium mb-3 font-ranking-cn">评分维度说明</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(SCORE_LABELS).map(([key, label]) => {
              const Icon = SCORE_ICONS[key as keyof typeof SCORE_ICONS];
              return (
                <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground font-ranking-cn">
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
