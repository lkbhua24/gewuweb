"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, Smartphone, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneCard } from "./phone-card";
import { EmptyPhoneState } from "./empty-phone-state";
import { PhoneCardSkeletonGrid } from "./phone-card-skeleton";
import { CompareProvider, useCompare } from "./compare-context";
import { CompareBar } from "./compare-bar";
import { ComparePanel } from "./compare-panel";
import { CompareFloatingCard } from "./compare-floating-card";

import type { Phone, PhoneStatus, HeatLevel, PhoneOutlineType } from "@/types/phone-library";

// 向后兼容的类型别名
type PhoneType = PhoneOutlineType;

// 从热度分数计算热度等级
function mapHeatScoreToLevel(score: number, isEditorsPick?: boolean): HeatLevel {
  if (isEditorsPick) return "editor";
  if (score >= 76) return "boom";
  if (score >= 51) return "hot";
  if (score >= 31) return "discussing";
  return "cold";
}

type PriceRange = "all" | "under2000" | "2000-4000" | "4000-6000" | "over6000";
type ReleaseTime = "all" | "7days" | "30days" | "2025";

const BRAND_OPTIONS = [
  "Apple", "Xiaomi", "Huawei", "Samsung", "OPPO", "vivo",
  "OnePlus", "iQOO", "Honor", "Meizu", "其他"
];

const KNOWN_BRANDS = new Set([
  "Apple", "Xiaomi", "Huawei", "Samsung", "OPPO", "vivo",
  "OnePlus", "iQOO", "Honor", "Meizu", "Redmi", "realme", "Nubia"
]);

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "under2000", label: "< ¥2,000" },
  { value: "2000-4000", label: "¥2,000 - 4,000" },
  { value: "4000-6000", label: "¥4,000 - 6,000" },
  { value: "over6000", label: "> ¥6,000" },
];

const CHIP_OPTIONS = ["骁龙", "天玑", "Apple", "麒麟", "其他"];

const KNOWN_CHIPS = new Set(["骁龙", "天玑", "Apple", "麒麟"]);

const RELEASE_OPTIONS: { value: ReleaseTime; label: string }[] = [
  { value: "7days", label: "最近7天" },
  { value: "30days", label: "最近30天" },
  { value: "2025", label: "2025年" },
];

const FEATURE_OPTIONS = [
  "长续航", "直屏党", "影像旗舰", "小屏旗舰", "游戏手机", "折叠屏"
];

// 品牌中英文映射
const BRAND_CN_MAP: Record<string, string> = {
  "Apple": "苹果",
  "Xiaomi": "小米",
  "Huawei": "华为",
  "Samsung": "三星",
  "OPPO": "OPPO",
  "vivo": "vivo",
  "OnePlus": "一加",
  "iQOO": "iQOO",
  "Honor": "荣耀",
  "Meizu": "魅族",
  "Redmi": "Redmi",
  "realme": "真我",
  "Nubia": "努比亚",
};

// 根据发布日期判断状态
function getStatus(releaseDate: string): PhoneStatus {
  return new Date(releaseDate) > new Date() ? "upcoming" : "released";
}

// 生成热度趋势数据（模拟近7天热度）
function generateHeatTrend(baseScore: number): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const variation = Math.random() * 10 - 5;
    return Math.max(0, Math.min(100, Math.round(baseScore + variation)));
  });
}

// 生成手机轮廓SVG（使用类型推断）
function generateOutlineSVG(phoneType: PhoneOutlineType): string {
  const paths: Record<PhoneOutlineType, string> = {
    flat: "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    curved: "M35 10 h90 a15 15 0 0 1 15 15 v130 a15 15 0 0 1 -15 15 h-90 a15 15 0 0 1 -15 -15 v-130 a15 15 0 0 1 15 -15 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    "triple-camera": "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M125 30 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M100 35 a10 10 0 1 1 0 20 a10 10 0 0 1 0 -20 z M125 60 a10 10 0 1 1 0 20 a10 10 0 0 1 0 -20 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    "quad-camera": "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M100 30 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M130 30 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M100 60 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M130 60 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    foldable: "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z M80 75 v2",
  };
  return paths[phoneType];
}

// 原始数据（用于转换）
import type { PhoneCategory } from "@/types/phone-library";

const rawPhonesData = [
  { id: "1", brand: "Apple", model: "iPhone 16 Pro Max", price: 9999, category: "旗舰机" as PhoneCategory, releaseDate: "2024-09-20", tags: ["影像旗舰"], heatScore: 88, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "A18 Pro", screen: "6.9英寸 OLED", battery: "4685mAh", charging: "40W", camera: "48MP+12MP+12MP", os: "iOS 18" } },
  { id: "2", brand: "Apple", model: "iPhone 16 Pro", price: 7999, category: "旗舰机" as PhoneCategory, releaseDate: "2024-09-20", tags: ["影像旗舰"], heatScore: 72, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "A18 Pro", screen: "6.3英寸 OLED", battery: "3582mAh", charging: "40W", camera: "48MP+12MP+12MP", os: "iOS 18" } },
  { id: "3", brand: "Xiaomi", model: "小米 15 Ultra", price: 5999, category: "旗舰机" as PhoneCategory, releaseDate: "2025-02-27", tags: ["影像旗舰", "长续航"], heatScore: 92, isEditorsPick: false, phoneType: "quad-camera" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.73英寸 OLED", battery: "6000mAh", charging: "90W", camera: "50MP+50MP+50MP", os: "HyperOS 2" } },
  { id: "4", brand: "Xiaomi", model: "小米 15 Pro", price: 4999, category: "旗舰机" as PhoneCategory, releaseDate: "2024-10-29", tags: ["长续航"], heatScore: 68, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.73英寸 OLED", battery: "5400mAh", charging: "120W", camera: "50MP+50MP+50MP", os: "HyperOS 2" } },
  { id: "5", brand: "Samsung", model: "Galaxy S25 Ultra", price: 9699, category: "旗舰机" as PhoneCategory, releaseDate: "2025-01-23", tags: ["影像旗舰"], heatScore: 45, isEditorsPick: false, phoneType: "quad-camera" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.9英寸 OLED", battery: "5000mAh", charging: "45W", camera: "200MP+50MP+10MP+10MP", os: "One UI 7" } },
  { id: "6", brand: "Samsung", model: "Galaxy S25+", price: 7999, category: "旗舰机" as PhoneCategory, releaseDate: "2025-01-23", tags: [], heatScore: 38, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.7英寸 OLED", battery: "4900mAh", charging: "45W", camera: "50MP+12MP+10MP", os: "One UI 7" } },
  { id: "7", brand: "Huawei", model: "Mate 70 Pro+", price: 8499, category: "旗舰机" as PhoneCategory, releaseDate: "2024-11-26", tags: ["影像旗舰"], heatScore: 74, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "麒麟9020", screen: "6.9英寸 OLED", battery: "5700mAh", charging: "100W", camera: "50MP+48MP+40MP", os: "HarmonyOS NEXT" } },
  { id: "8", brand: "Huawei", model: "Mate 70 Pro", price: 6999, category: "旗舰机" as PhoneCategory, releaseDate: "2024-11-26", tags: ["影像旗舰"], heatScore: 42, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "麒麟9000S", screen: "6.9英寸 OLED", battery: "5500mAh", charging: "88W", camera: "50MP+48MP+40MP", os: "HarmonyOS NEXT" } },
  { id: "9", brand: "OnePlus", model: "一加 13", price: 4499, category: "旗舰机" as PhoneCategory, releaseDate: "2024-11-01", tags: ["长续航"], heatScore: 48, isEditorsPick: false, phoneType: "curved" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.82英寸 OLED", battery: "6000mAh", charging: "100W", camera: "50MP+50MP+50MP", os: "ColorOS 15" } },
  { id: "10", brand: "OnePlus", model: "一加 13T", price: 3499, category: "性能机" as PhoneCategory, releaseDate: "2025-04-25", tags: ["小屏旗舰", "长续航"], heatScore: 35, isEditorsPick: false, phoneType: "flat" as PhoneOutlineType, specs: { chip: "骁龙8 Gen3", screen: "6.3英寸 OLED", battery: "5500mAh", charging: "80W", camera: "50MP+8MP", os: "ColorOS 15" } },
  { id: "11", brand: "OPPO", model: "Find X8 Pro", price: 5299, category: "影像旗舰" as PhoneCategory, releaseDate: "2024-10-24", tags: ["影像旗舰", "长续航"], heatScore: 65, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "天玑9400", screen: "6.78英寸 OLED", battery: "5910mAh", charging: "80W", camera: "50MP+50MP+50MP", os: "ColorOS 15" } },
  { id: "12", brand: "OPPO", model: "Find X8", price: 4199, category: "旗舰机" as PhoneCategory, releaseDate: "2024-10-24", tags: [], heatScore: 40, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "天玑9400", screen: "6.59英寸 OLED", battery: "5630mAh", charging: "80W", camera: "50MP+50MP", os: "ColorOS 15" } },
  { id: "13", brand: "vivo", model: "X200 Ultra", price: 5999, category: "影像旗舰" as PhoneCategory, releaseDate: "2025-04-20", tags: ["影像旗舰", "长续航"], heatScore: 44, isEditorsPick: false, phoneType: "quad-camera" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.8英寸 OLED", battery: "5500mAh", charging: "90W", camera: "50MP+50MP+200MP", os: "OriginOS 5" } },
  { id: "14", brand: "vivo", model: "X200 Pro", price: 4999, category: "影像旗舰" as PhoneCategory, releaseDate: "2024-10-14", tags: ["影像旗舰", "长续航"], heatScore: 70, isEditorsPick: false, phoneType: "triple-camera" as PhoneOutlineType, specs: { chip: "天玑9400", screen: "6.78英寸 OLED", battery: "6000mAh", charging: "90W", camera: "50MP+50MP+200MP", os: "OriginOS 5" } },
  { id: "15", brand: "Redmi", model: "K80 Pro", price: 3299, category: "性能机" as PhoneCategory, releaseDate: "2024-11-27", tags: ["游戏手机", "长续航"], heatScore: 46, isEditorsPick: false, phoneType: "flat" as PhoneOutlineType, specs: { chip: "骁龙8 Gen3", screen: "6.67英寸 OLED", battery: "6000mAh", charging: "120W", camera: "50MP+8MP+2MP", os: "HyperOS 2" } },
  { id: "16", brand: "Redmi", model: "K80", price: 2499, category: "性价比" as PhoneCategory, releaseDate: "2024-11-27", tags: ["长续航"], heatScore: 62, isEditorsPick: false, phoneType: "flat" as PhoneOutlineType, specs: { chip: "骁龙8 Gen2", screen: "6.67英寸 OLED", battery: "6550mAh", charging: "90W", camera: "50MP+8MP", os: "HyperOS 2" } },
  { id: "17", brand: "realme", model: "GT7 Pro", price: 3599, category: "性能机" as PhoneCategory, releaseDate: "2024-11-04", tags: ["游戏手机", "长续航"], heatScore: 41, isEditorsPick: false, phoneType: "curved" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.78英寸 OLED", battery: "6500mAh", charging: "120W", camera: "50MP+8MP", os: "realme UI 6" } },
  { id: "18", brand: "iQOO", model: "13", price: 3999, category: "游戏手机" as PhoneCategory, releaseDate: "2024-10-30", tags: ["游戏手机", "长续航"], heatScore: 39, isEditorsPick: false, phoneType: "flat" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.82英寸 OLED", battery: "6150mAh", charging: "120W", camera: "50MP+50MP", os: "OriginOS 5" } },
  { id: "19", brand: "Honor", model: "Magic7 Pro", price: 5699, category: "旗舰机" as PhoneCategory, releaseDate: "2024-10-30", tags: ["影像旗舰", "长续航"], heatScore: 43, isEditorsPick: false, phoneType: "curved" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.8英寸 OLED", battery: "5850mAh", charging: "100W", camera: "50MP+50MP+50MP", os: "MagicOS 9" } },
  { id: "20", brand: "Nubia", model: "Z70 Ultra", price: 4599, category: "影像旗舰" as PhoneCategory, releaseDate: "2025-05-15", tags: ["影像旗舰", "长续航"], heatScore: 37, isEditorsPick: false, phoneType: "flat" as PhoneOutlineType, specs: { chip: "骁龙8至尊版", screen: "6.8英寸 OLED", battery: "6000mAh", charging: "80W", camera: "50MP+50MP+50MP", os: "MyOS 15" } },
  { id: "21", brand: "Meizu", model: "21 Pro", price: 3999, category: "旗舰机" as PhoneCategory, releaseDate: "2024-03-01", tags: ["直屏党"], heatScore: 18, isEditorsPick: false, phoneType: "flat" as PhoneOutlineType, specs: { chip: "骁龙8 Gen3", screen: "6.79英寸 OLED", battery: "5050mAh", charging: "80W", camera: "50MP+13MP+10MP", os: "Flyme 11" } },
  { id: "22", brand: "Huawei", model: "Mate X6", price: 12999, category: "折叠屏" as PhoneCategory, releaseDate: "2024-11-26", tags: ["折叠屏", "影像旗舰"], heatScore: 67, isEditorsPick: true, phoneType: "foldable" as PhoneOutlineType, specs: { chip: "麒麟9100", screen: "7.93英寸 折叠", battery: "5200mAh", charging: "66W", camera: "50MP+48MP+40MP", os: "HarmonyOS NEXT" } },
  { id: "23", brand: "Samsung", model: "Galaxy Z Fold6", price: 13999, category: "折叠屏" as PhoneCategory, releaseDate: "2024-07-24", tags: ["折叠屏"], heatScore: 36, isEditorsPick: false, phoneType: "foldable" as PhoneOutlineType, specs: { chip: "骁龙8 Gen3", screen: "7.6英寸 折叠", battery: "4400mAh", charging: "25W", camera: "50MP+12MP+10MP", os: "One UI 7" } },
  { id: "24", brand: "vivo", model: "X200 Pro mini", price: 4299, category: "小屏旗舰" as PhoneCategory, releaseDate: "2024-10-14", tags: ["小屏旗舰", "影像旗舰"], heatScore: 49, isEditorsPick: false, phoneType: "curved" as PhoneOutlineType, specs: { chip: "天玑9400", screen: "6.31英寸 OLED", battery: "5700mAh", charging: "90W", camera: "50MP+50MP+50MP", os: "OriginOS 5" } },
];

// 转换为新接口格式的静态数据
const allPhones: Phone[] = rawPhonesData.map((p) => ({
  ...p,
  brandCN: BRAND_CN_MAP[p.brand] || p.brand,
  priceNote: "均价",
  status: getStatus(p.releaseDate),
  heatTrend: generateHeatTrend(p.heatScore),
  outlineSVG: generateOutlineSVG(p.phoneType),
}));

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748b] pointer-events-none transition-colors duration-200 group-focus-within:text-[#00e5ff]" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索手机型号、品牌..."
        aria-label="搜索手机型号"
        className={cn(
          "w-full h-10",
          "bg-white/[0.04] border border-white/[0.08] rounded-xl",
          "pl-9 pr-9",
          "text-sm text-[#f8fafc] placeholder:text-[#64748b]",
          "transition-all duration-200",
          "focus:outline-none focus:border-[#00e5ff]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)]",
          "md:w-[340px]"
        )}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#94a3b8] hover:text-[#f1f5f9] transition-colors duration-150"
          >
            <X className="size-3" />
          </motion.button>
        )}
      </AnimatePresence>
      {!value && (
        <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-[10px] text-[#64748b] font-mono pointer-events-none">
          /
        </kbd>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "filter-chip whitespace-nowrap cursor-pointer",
        "text-[13px] px-3 py-1.5 rounded-full",
        "border transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "bg-[rgba(0,229,255,0.12)] border-[rgba(0,229,255,0.35)] text-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.08)]"
          : "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.06)] text-[#94a3b8] hover:border-[rgba(255,255,255,0.15)] hover:text-[#cbd5e1] hover:bg-[rgba(255,255,255,0.06)]"
      )}
    >
      {label}
    </button>
  );
}

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
}

function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[11px] text-[#64748b] font-medium pt-[7px] whitespace-nowrap min-w-[28px]">{title}</span>
      <div className="flex items-center gap-1.5 flex-wrap md:flex-wrap overflow-x-auto scrollbar-hide md:overflow-visible pb-1 md:pb-0">
        {children}
      </div>
    </div>
  );
}

function PhoneLibraryGridInner() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { comparedPhones, removeFromCompare, clearCompare, isPanelOpen, openPanel, closePanel } = useCompare();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>("all");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<ReleaseTime>("all");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMultiSelect = useCallback((value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  }, []);

  const matchesPrice = useCallback((price: number, range: PriceRange): boolean => {
    switch (range) {
      case "under2000": return price < 2000;
      case "2000-4000": return price >= 2000 && price <= 4000;
      case "4000-6000": return price > 4000 && price <= 6000;
      case "over6000": return price > 6000;
      default: return true;
    }
  }, []);

  const matchesReleaseTime = useCallback((dateStr: string, time: ReleaseTime): boolean => {
    if (time === "all") return true;
    const releaseDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (time) {
      case "7days": return diffDays <= 7;
      case "30days": return diffDays <= 30;
      case "2025": return releaseDate.getFullYear() === 2025;
      default: return true;
    }
  }, []);

  // 从芯片名称推断芯片类型
  const getChipType = useCallback((chipName: string): string => {
    if (chipName.includes("骁龙")) return "骁龙";
    if (chipName.includes("天玑")) return "天玑";
    if (chipName.includes("麒麟")) return "麒麟";
    if (chipName.includes("Apple") || chipName.includes("A")) return "Apple";
    return "其他";
  }, []);

  const filteredPhones = useMemo(() => {
    return allPhones.filter((phone) => {
      const matchesSearch = searchQuery === "" ||
        phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.specs.chip.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrands.length === 0 ||
        (selectedBrands.includes("其他")
          ? !KNOWN_BRANDS.has(phone.brand)
          : selectedBrands.includes(phone.brand));

      const matchesPriceRange = matchesPrice(phone.price, selectedPrice);

      const chipType = getChipType(phone.specs.chip);
      const matchesChip = selectedChips.length === 0 ||
        (selectedChips.includes("其他")
          ? !KNOWN_CHIPS.has(chipType)
          : selectedChips.includes(chipType));

      const matchesRelease = matchesReleaseTime(phone.releaseDate, selectedTime);

      const matchesFeature = selectedFeatures.length === 0 ||
        selectedFeatures.every(f => phone.tags.includes(f));

      return matchesSearch && matchesBrand && matchesPriceRange && matchesChip && matchesRelease && matchesFeature;
    });
  }, [searchQuery, selectedBrands, selectedPrice, selectedChips, selectedTime, selectedFeatures, matchesPrice, matchesReleaseTime, getChipType]);

  const activeFilterCount = useMemo(() => {
    return selectedBrands.length +
      (selectedPrice !== "all" ? 1 : 0) +
      selectedChips.length +
      (selectedTime !== "all" ? 1 : 0) +
      selectedFeatures.length +
      (searchQuery !== "" ? 1 : 0);
  }, [selectedBrands, selectedPrice, selectedChips, selectedTime, selectedFeatures, searchQuery]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedPrice("all");
    setSelectedChips([]);
    setSelectedTime("all");
    setSelectedFeatures([]);
  }, []);

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 md:py-16 bg-background overflow-hidden"
    >
      <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex items-center justify-center size-8 rounded-lg bg-brand/10">
                  <Smartphone className="size-4 text-brand" />
                </div>
                <h2 className="text-[#f8fafc] text-[28px] font-bold">
                  全部机型
                </h2>
              </div>
              <p className="text-[#64748b] text-sm ml-[42px] mt-1">
                全品牌手机参数查询与对比
              </p>
            </div>

            <div className="w-full md:w-auto">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="flex items-center gap-1.5 text-[#64748b] hover:text-[#94a3b8] transition-colors duration-200"
            >
              <SlidersHorizontal className="size-3.5" />
              <span className="text-xs font-medium">筛选</span>
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="ml-0.5 px-1.5 py-0.5 rounded-full bg-brand/15 text-brand text-[10px] font-medium"
                >
                  {activeFilterCount}
                </motion.span>
              )}
              {filtersExpanded ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>

            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={resetFilters}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[#94a3b8] hover:text-[#f1f5f9] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-200"
                >
                  <X className="size-3" />
                  清除筛选
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {filtersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 pb-2">
                  <FilterGroup title="品牌">
                    {BRAND_OPTIONS.map(brand => (
                      <FilterChip
                        key={brand}
                        label={brand}
                        selected={selectedBrands.includes(brand)}
                        onClick={() => toggleMultiSelect(brand, selectedBrands, setSelectedBrands)}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="价格">
                    <FilterChip
                      label="全部"
                      selected={selectedPrice === "all"}
                      onClick={() => setSelectedPrice("all")}
                    />
                    {PRICE_OPTIONS.map(price => (
                      <FilterChip
                        key={price.value}
                        label={price.label}
                        selected={selectedPrice === price.value}
                        onClick={() => setSelectedPrice(price.value)}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="芯片">
                    {CHIP_OPTIONS.map(chip => (
                      <FilterChip
                        key={chip}
                        label={chip}
                        selected={selectedChips.includes(chip)}
                        onClick={() => toggleMultiSelect(chip, selectedChips, setSelectedChips)}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="时间">
                    <FilterChip
                      label="全部"
                      selected={selectedTime === "all"}
                      onClick={() => setSelectedTime("all")}
                    />
                    {RELEASE_OPTIONS.map(time => (
                      <FilterChip
                        key={time.value}
                        label={time.label}
                        selected={selectedTime === time.value}
                        onClick={() => setSelectedTime(time.value)}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="特色">
                    {FEATURE_OPTIONS.map(feature => (
                      <FilterChip
                        key={feature}
                        label={feature}
                        selected={selectedFeatures.includes(feature)}
                        onClick={() => toggleMultiSelect(feature, selectedFeatures, setSelectedFeatures)}
                      />
                    ))}
                  </FilterGroup>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-2 flex-wrap"
          >
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#94a3b8]">
                搜索: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:text-[#f1f5f9] transition-colors">
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {selectedBrands.map(brand => (
              <span key={brand} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#94a3b8]">
                {brand}
                <button onClick={() => toggleMultiSelect(brand, selectedBrands, setSelectedBrands)} className="hover:text-[#f1f5f9] transition-colors">
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
            {selectedPrice !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#94a3b8]">
                {PRICE_OPTIONS.find(p => p.value === selectedPrice)?.label}
                <button onClick={() => setSelectedPrice("all")} className="hover:text-[#f1f5f9] transition-colors">
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {selectedChips.map(chip => (
              <span key={chip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#94a3b8]">
                {chip}
                <button onClick={() => toggleMultiSelect(chip, selectedChips, setSelectedChips)} className="hover:text-[#f1f5f9] transition-colors">
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
            {selectedTime !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#94a3b8]">
                {RELEASE_OPTIONS.find(t => t.value === selectedTime)?.label}
                <button onClick={() => setSelectedTime("all")} className="hover:text-[#f1f5f9] transition-colors">
                  <X className="size-2.5" />
                </button>
              </span>
            )}
            {selectedFeatures.map(feature => (
              <span key={feature} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#94a3b8]">
                {feature}
                <button onClick={() => toggleMultiSelect(feature, selectedFeatures, setSelectedFeatures)} className="hover:text-[#f1f5f9] transition-colors">
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="phone-grid"
              >
                <PhoneCardSkeletonGrid count={10} />
              </motion.div>
            ) : filteredPhones.length > 0 ? (
              <motion.div
                key="phones"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="phone-grid"
              >
                <AnimatePresence mode="popLayout">
                  {filteredPhones.map((phone, index) => (
                    <motion.div
                      key={phone.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{
                        delay: Math.min(index * 0.03, 0.3),
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <PhoneCard
                        phone={phone}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <EmptyPhoneState
                  hasFilters={activeFilterCount > 0}
                  onClearFilters={resetFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 flex items-center justify-between"
        >
          <p className="text-xs text-[#64748b]">
            共 <span className="text-[#94a3b8] font-medium font-mono">{filteredPhones.length}</span> 款机型
            {activeFilterCount > 0 && (
              <span className="text-[#64748b]"> / {allPhones.length} 款总计</span>
            )}
          </p>
        </motion.div>
      </div>

      {/* 对比栏 */}
      <CompareBar
        phones={comparedPhones}
        onRemove={removeFromCompare}
        onClear={clearCompare}
        onCompare={openPanel}
      />

      {/* 对比面板 */}
      <ComparePanel
        isOpen={isPanelOpen}
        phones={comparedPhones}
        onClose={closePanel}
      />

      {/* 浮动对比卡片 */}
      <CompareFloatingCard
        count={comparedPhones.length}
        onClick={openPanel}
        onClear={clearCompare}
      />
    </section>
  );
}

export function PhoneLibraryGrid() {
  return (
    <CompareProvider>
      <PhoneLibraryGridInner />
    </CompareProvider>
  );
}
