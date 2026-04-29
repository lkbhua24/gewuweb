"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 多平台比价矩阵组件
// ============================================================================

type PlatformType = "official" | "third-party";
type FilterType = "all" | "official-only";

interface PriceItem {
  id: string;
  platform: string;
  icon: string;
  price: number;
  originalPrice?: number;
  discount: string;
  discountType: "coupon" | "trade-in" | "gift" | "subsidy" | "installment";
  url: string;
  type: PlatformType;
  isOfficial: boolean;
}

interface PriceComparisonMatrixProps {
  items?: PriceItem[];
  themeColor?: string;
}

// 默认价格数据
const DEFAULT_ITEMS: PriceItem[] = [
  {
    id: "1",
    platform: "三星官方",
    icon: "🏪",
    price: 9699,
    discount: "分期免息 12期",
    discountType: "installment",
    url: "#",
    type: "official",
    isOfficial: true,
  },
  {
    id: "2",
    platform: "京东",
    icon: "🐶",
    price: 9499,
    originalPrice: 9699,
    discount: "-¥200 以旧换新",
    discountType: "trade-in",
    url: "#",
    type: "official",
    isOfficial: true,
  },
  {
    id: "3",
    platform: "天猫",
    icon: "🐱",
    price: 9599,
    discount: "赠品",
    discountType: "gift",
    url: "#",
    type: "official",
    isOfficial: true,
  },
  {
    id: "4",
    platform: "拼多多",
    icon: "📱",
    price: 8999,
    discount: "百亿补贴",
    discountType: "subsidy",
    url: "#",
    type: "third-party",
    isOfficial: false,
  },
  {
    id: "5",
    platform: "苏宁",
    icon: "🦁",
    price: 9599,
    discount: "满减券 -¥100",
    discountType: "coupon",
    url: "#",
    type: "official",
    isOfficial: true,
  },
  {
    id: "6",
    platform: "抖音电商",
    icon: "🎵",
    price: 9399,
    discount: "直播间专享",
    discountType: "coupon",
    url: "#",
    type: "third-party",
    isOfficial: false,
  },
];

export function PriceComparisonMatrix({
  items = DEFAULT_ITEMS,
  themeColor = "#00D9FF",
}: PriceComparisonMatrixProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 筛选数据
  const filteredItems = useMemo(() => {
    if (filter === "official-only") {
      return items.filter((item) => item.isOfficial);
    }
    return items;
  }, [items, filter]);

  // 找出最低价
  const lowestPrice = useMemo(() => {
    return Math.min(...items.map((item) => item.price));
  }, [items]);

  // 格式化价格
  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // 筛选选项
  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "全部渠道" },
    { value: "official-only", label: "仅官方" },
  ];

  return (
    <div className="w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">全网比价</h3>

        {/* 筛选器 */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
          >
            {filterOptions.find((o) => o.value === filter)?.label}
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isFilterOpen && "rotate-180"
              )}
            />
          </button>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-32 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-10"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm transition-colors",
                      filter === option.value
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-white/5">
              <th className="px-4 py-3 font-medium">平台</th>
              <th className="px-4 py-3 font-medium">价格</th>
              <th className="px-4 py-3 font-medium">优惠</th>
              <th className="px-4 py-3 font-medium text-right">链接</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const isLowest = item.price === lowestPrice;
                const isThirdParty = item.type === "third-party";

                return (
                  <motion.tr
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isThirdParty && filter === "official-only" ? 0.3 : 1,
                      y: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "group border-b border-white/5 last:border-b-0 transition-all duration-300",
                      isLowest && "bg-green-500/5"
                    )}
                    style={{
                      borderLeft: isLowest ? "3px solid #22c55e" : "3px solid transparent",
                    }}
                  >
                    {/* 平台 */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-white font-medium">{item.platform}</div>
                          {item.isOfficial && (
                            <span className="text-xs text-cyan-400">官方</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 价格 */}
                    <td className="px-4 py-4">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={cn(
                            "text-lg font-bold",
                            isLowest ? "text-green-400" : "text-white"
                          )}
                        >
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 优惠 */}
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-xs",
                          item.discountType === "subsidy" && "bg-red-500/20 text-red-400",
                          item.discountType === "trade-in" && "bg-blue-500/20 text-blue-400",
                          item.discountType === "gift" && "bg-purple-500/20 text-purple-400",
                          item.discountType === "installment" && "bg-green-500/20 text-green-400",
                          item.discountType === "coupon" && "bg-orange-500/20 text-orange-400"
                        )}
                      >
                        {item.discount}
                      </span>
                    </td>

                    {/* 链接 */}
                    <td className="px-4 py-4 text-right">
                      <motion.a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                          backgroundColor: `${themeColor}20`,
                          color: themeColor,
                        }}
                        whileHover={{
                          backgroundColor: themeColor,
                          color: "#0a0a14",
                        }}
                      >
                        前往
                        <ExternalLink className="w-3 h-3" />
                      </motion.a>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 底部筛选开关 */}
      <div className="flex items-center gap-6 p-4 border-t border-white/10 bg-white/5">
        {/* 显示官方旗舰店 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={filter === "official-only"}
              onChange={(e) => setFilter(e.target.checked ? "official-only" : "all")}
              className="sr-only"
            />
            <div
              className={cn(
                "w-5 h-5 rounded border transition-all flex items-center justify-center",
                filter === "official-only"
                  ? "bg-cyan-500 border-cyan-500"
                  : "bg-transparent border-white/30"
              )}
            >
              {filter === "official-only" && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          <span className="text-sm text-gray-300">仅显示官方旗舰店</span>
        </label>

        {/* 最低价提示 */}
        <div className="ml-auto text-sm">
          <span className="text-gray-400">当前最低价：</span>
          <span className="text-green-400 font-bold">{formatPrice(lowestPrice)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function PriceComparisonMatrixDemo() {
  const [themeColor, setThemeColor] = useState("#00D9FF");

  const themes = [
    { name: "科技青", color: "#00D9FF" },
    { name: "钛蓝", color: "#A8C8EC" },
    { name: "钛灰", color: "#C5C0BC" },
    { name: "钛黑", color: "#1A1A1A" },
    { name: "钛雾金", color: "#E8D5B7" },
  ];

  // 不同主题的价格数据
  const getItemsByTheme = (color: string): PriceItem[] => {
    const basePrice = color === "#C4B5A0" ? 8999 : color === "#2D5016" ? 6499 : 9699;
    return [
      {
        id: "1",
        platform: "品牌官方",
        icon: "🏪",
        price: basePrice,
        discount: "分期免息 12期",
        discountType: "installment",
        url: "#",
        type: "official",
        isOfficial: true,
      },
      {
        id: "2",
        platform: "京东",
        icon: "🐶",
        price: basePrice - 200,
        originalPrice: basePrice,
        discount: "-¥200 以旧换新",
        discountType: "trade-in",
        url: "#",
        type: "official",
        isOfficial: true,
      },
      {
        id: "3",
        platform: "天猫",
        icon: "🐱",
        price: basePrice - 100,
        discount: "赠品",
        discountType: "gift",
        url: "#",
        type: "official",
        isOfficial: true,
      },
      {
        id: "4",
        platform: "拼多多",
        icon: "📱",
        price: basePrice - 700,
        discount: "百亿补贴",
        discountType: "subsidy",
        url: "#",
        type: "third-party",
        isOfficial: false,
      },
      {
        id: "5",
        platform: "苏宁",
        icon: "🦁",
        price: basePrice - 100,
        discount: "满减券 -¥100",
        discountType: "coupon",
        url: "#",
        type: "official",
        isOfficial: true,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题 */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">多平台比价矩阵</h1>
          <p className="text-gray-400">
            全网渠道价格对比，最低价高亮，官方/第三方筛选
          </p>
        </motion.div>

        {/* 主题切换 */}
        <motion.div
          className="flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {themes.map((theme) => (
            <button
              key={theme.color}
              onClick={() => setThemeColor(theme.color)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                themeColor === theme.color
                  ? "bg-white/20 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              )}
            >
              {theme.name}
            </button>
          ))}
        </motion.div>

        {/* 比价矩阵 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PriceComparisonMatrix
            items={getItemsByTheme(themeColor)}
            themeColor={themeColor}
          />
        </motion.div>

        {/* 设计说明 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">表格设计</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                4 列：平台、价格、优惠、链接
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                行悬停：背景变为 5% 主题色
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                最低价行：左侧 3px 绿色边框
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                价格数字绿色高亮
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">交互功能</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                顶部筛选下拉（全部/仅官方）
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                底部开关快速切换
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                第三方商家筛选时淡出
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                "前往"按钮悬停变色
              </li>
            </ul>
          </div>
        </motion.div>

        {/* 优惠类型说明 */}
        <motion.div
          className="bg-white/5 rounded-2xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">优惠类型标签</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 rounded bg-red-500/20 text-red-400 text-sm">百亿补贴</span>
            <span className="px-3 py-1.5 rounded bg-blue-500/20 text-blue-400 text-sm">以旧换新</span>
            <span className="px-3 py-1.5 rounded bg-purple-500/20 text-purple-400 text-sm">赠品</span>
            <span className="px-3 py-1.5 rounded bg-green-500/20 text-green-400 text-sm">分期免息</span>
            <span className="px-3 py-1.5 rounded bg-orange-500/20 text-orange-400 text-sm">满减券</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
