"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, TrendingDown, Bell, History } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 价格走势折线图组件
// ============================================================================

interface PriceDataPoint {
  date: string;
  officialPrice: number;
  usedPrice: number;
}

type TimeRange = "6m" | "1y" | "all";

interface PriceChartProps {
  data?: PriceDataPoint[];
  themeColor?: string;
  officialPrice?: number;
  usedPrice?: number;
  animateOnLoad?: boolean;
}

// 生成模拟价格数据
const generatePriceData = (months: number): PriceDataPoint[] => {
  const data: PriceDataPoint[] = [];
  const basePrice = 9699;
  const now = new Date();

  for (let i = months; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthProgress = (months - i) / months;
    
    // 官方价：阶梯式下降
    const officialDrop = Math.floor(monthProgress / 0.25) * 200;
    const officialPrice = basePrice - officialDrop;
    
    // 二手价：更大幅度的波动下降
    const usedBase = basePrice * 0.85;
    const usedDrop = monthProgress * basePrice * 0.25;
    const randomFluctuation = Math.sin(i * 0.5) * 300;
    const usedPrice = Math.max(usedBase - usedDrop + randomFluctuation, basePrice * 0.5);

    data.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM
      officialPrice,
      usedPrice: Math.round(usedPrice),
    });
  }

  return data;
};

const DEFAULT_DATA: Record<TimeRange, PriceDataPoint[]> = {
  "6m": generatePriceData(6),
  "1y": generatePriceData(12),
  "all": generatePriceData(24),
};

export function PriceChart({
  data: externalData,
  themeColor = "#00D9FF",
  officialPrice = 9699,
  usedPrice = 7200,
  animateOnLoad = true,
}: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const chartRef = useRef<SVGSVGElement>(null);

  const data = externalData || DEFAULT_DATA[timeRange];

  // 计算价格变化百分比
  const priceChange = ((usedPrice - officialPrice) / officialPrice * 100);

  // 图表尺寸
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 计算比例
  const prices = data.flatMap(d => [d.officialPrice, d.usedPrice]);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (price: number) => padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  // 生成路径
  const officialPath = useMemo(() => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.officialPrice)}`).join(' ');
  }, [data]);

  const usedPath = useMemo(() => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.usedPrice)}`).join(' ');
  }, [data]);

  // 面积路径（官方价下方填充）
  const areaPath = useMemo(() => {
    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.officialPrice)}`).join(' ');
    const closePath = `L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${getX(0)} ${padding.top + chartHeight} Z`;
    return `${linePath} ${closePath}`;
  }, [data]);

  // 格式化价格
  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

  // 时间范围选项
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "6m", label: "6月" },
    { value: "1y", label: "1年" },
    { value: "all", label: "全部" },
  ];

  return (
    <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">价格走势</h3>
        
        {/* 时间范围选择器 */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value as TimeRange);
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 1500);
            }}
            className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-white/30"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* 图表区域 */}
      <div className="relative">
        <svg
          ref={chartRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ minHeight: "200px" }}
        >
          {/* 定义渐变和滤镜 */}
          <defs>
            <linearGradient id={`priceGradient-${themeColor.replace("#", "")}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={themeColor} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`lineGradient-${themeColor.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={themeColor} />
            </linearGradient>
          </defs>

          {/* 网格线 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + chartHeight * ratio}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight * ratio}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Y轴标签 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={padding.top + chartHeight * (1 - ratio) + 4}
              textAnchor="end"
              fill="rgba(255,255,255,0.4)"
              fontSize="10"
            >
              ¥{Math.round(minPrice + priceRange * ratio / 1000)}k
            </text>
          ))}

          {/* X轴标签 */}
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i) => (
            <text
              key={i}
              x={getX(data.indexOf(d))}
              y={height - 10}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="10"
            >
              {d.date.slice(5)}
            </text>
          ))}

          {/* 面积填充 */}
          <motion.path
            d={areaPath}
            fill={`url(#priceGradient-${themeColor.replace("#", "")})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          />

          {/* 二手均价线（虚线） */}
          <motion.path
            d={usedPath}
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* 官方价线（实线） */}
          <motion.path
            d={officialPath}
            fill="none"
            stroke={themeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* 数据点 */}
          {data.map((d, i) => (
            <g key={i}>
              {/* 官方价数据点 */}
              <motion.circle
                cx={getX(i)}
                cy={getY(d.officialPrice)}
                r={hoveredIndex === i ? 6 : 4}
                fill={themeColor}
                stroke="#0a0a14"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: hoveredIndex === i ? 1.5 : 1, 
                  opacity: 1 
                }}
                transition={{ 
                  delay: 0.5 + i * 0.05,
                  scale: { duration: 0.2, ease: "easeOut" }
                }}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  filter: hoveredIndex === i ? `drop-shadow(0 0 8px ${themeColor})` : "none"
                }}
              />
              {/* 二手价数据点 */}
              <motion.circle
                cx={getX(i)}
                cy={getY(d.usedPrice)}
                r={hoveredIndex === i ? 5 : 3}
                fill="#6B7280"
                stroke="#0a0a14"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: hoveredIndex === i ? 1.5 : 1, 
                  opacity: 1 
                }}
                transition={{ 
                  delay: 0.5 + i * 0.05,
                  scale: { duration: 0.2, ease: "easeOut" }
                }}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  filter: hoveredIndex === i ? "drop-shadow(0 0 8px #6B7280)" : "none"
                }}
              />
            </g>
          ))}

          {/* 悬停指示线 */}
          {hoveredIndex !== null && (
            <>
              <line
                x1={getX(hoveredIndex)}
                y1={padding.top}
                x2={getX(hoveredIndex)}
                y2={padding.top + chartHeight}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            </>
          )}
        </svg>

        {/* 悬停提示框 */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute pointer-events-none bg-black/90 border border-white/20 rounded-lg p-3 shadow-xl"
              style={{
                left: `${(getX(hoveredIndex) / width) * 100}%`,
                top: "20%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="text-xs text-gray-400 mb-2">{data[hoveredIndex].date}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                  <span className="text-xs text-gray-400">官方价</span>
                  <span className="text-sm font-medium text-white">
                    {formatPrice(data[hoveredIndex].officialPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-xs text-gray-400">二手均价</span>
                  <span className="text-sm font-medium text-white">
                    {formatPrice(data[hoveredIndex].usedPrice)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 价格统计 */}
      <div className="mt-6 space-y-3">
        {/* 官方价 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm w-20">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: themeColor }} />
            官方价
          </div>
          <span className="text-white font-medium">{formatPrice(officialPrice)}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* 二手均价 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm w-20">
            <div className="w-3 h-0.5 rounded-full bg-gray-500" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, #6B7280 2px, #6B7280 4px)" }} />
            二手均价
          </div>
          <span className="text-white font-medium">{formatPrice(usedPrice)}</span>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            priceChange < 0 ? "text-red-400" : "text-green-400"
          )}>
            <TrendingDown className="w-4 h-4" />
            {priceChange > 0 ? "+" : ""}{priceChange.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-6 flex gap-3">
        <motion.button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${themeColor}20` }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <History className="w-4 h-4" />
          查看历史低价
        </motion.button>
        <motion.button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${themeColor}20` }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Bell className="w-4 h-4" />
          设置降价提醒
        </motion.button>
      </div>
    </div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function PriceChartDemo() {
  const [themeColor, setThemeColor] = useState("#00D9FF");

  const themes = [
    { name: "科技青", color: "#00D9FF" },
    { name: "钛蓝", color: "#A8C8EC" },
    { name: "钛灰", color: "#C5C0BC" },
    { name: "钛黑", color: "#1A1A1A" },
    { name: "钛雾金", color: "#E8D5B7" },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">价格走势折线图</h1>
          <p className="text-gray-400">
            官方价实线 + 二手均价虚线，面积填充，悬停交互
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

        {/* 图表展示 */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PriceChart themeColor={themeColor} />
        </motion.div>

        {/* 设计说明 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">图表设计</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                官方价：实线，主题色渐变
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                二手均价：虚线，灰色
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                官方价下方填充 10% 主题色面积
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                页面加载时线条从左到右绘制（1.5s）
              </li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">交互功能</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                悬停数据点显示具体日期和价格
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                时间范围切换（6月/1年/全部）
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                显示价格降幅百分比
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                历史低价和降价提醒按钮
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
