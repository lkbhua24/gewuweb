"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, TrendingUp, Flame, Search, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const coreSpecs = [
  { label: "AnTuTu", value: 2135800, suffix: "" },
  { label: "Battery", value: 5500, suffix: "mAh" },
  { label: "Camera", value: 200, suffix: "MP" },
];

const weeklyHeatData = [0.3, 0.5, 0.7, 0.4, 0.8, 0.9, 0.6];

const hotTopics = [
  {
    id: 1,
    title: "iPhone 16 Pro Max 拍照对比小米 15 Ultra",
    heat: "hot",
    replies: 2341,
    summary: "夜景表现谁更强？长焦对决引发热议",
  },
  {
    id: 2,
    title: "华为 Mate 70 Pro+ 鸿蒙 NEXT 体验",
    heat: "boom",
    replies: 4523,
    summary: "纯血鸿蒙流畅度提升明显，生态仍需完善",
  },
  {
    id: 3,
    title: "折叠屏手机现在值得入手吗？",
    heat: "discussing",
    replies: 1892,
    summary: "价格下探至 6000 元档，耐用性仍是顾虑",
  },
];

const hotTags = [
  "骁龙 8 Elite",
  "A18 Pro",
  "影像旗舰",
  "折叠屏",
  "AI 功能",
  "续航测试",
  "快充",
  "屏幕素质",
];

const heatIconMap = {
  cold: null,
  discussing: <MessageCircle className="size-3.5 text-heat-discussing" />,
  hot: <TrendingUp className="size-3.5 text-heat-hot" />,
  boom: <Flame className="size-3.5 text-heat-boom" />,
};

const heatLabelMap = {
  cold: "",
  discussing: "讨论中",
  hot: "热门",
  boom: "爆款",
};

const heatClassMap = {
  cold: "",
  discussing: "text-heat-discussing bg-heat-discussing/10",
  hot: "text-heat-hot bg-heat-hot/10",
  boom: "text-heat-boom bg-heat-boom/10",
};

function useCountUp(targetValue: number, duration: number = 1500, isInView: boolean = false) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      const easeOut = 1 - Math.pow(1 - percentage, 3);
      const currentValue = Math.floor(easeOut * targetValue);

      setDisplayValue(currentValue);

      if (percentage < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, targetValue, duration]);

  return displayValue;
}

function SpecNumber({ value, suffix, label, isInView }: { value: number; suffix: string; label: string; isInView: boolean }) {
  const displayValue = useCountUp(value, 1500, isInView);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-tertiary-level uppercase tracking-wider font-medium font-brand-en">
        {label}
      </span>
      <span className="font-data text-3xl md:text-4xl text-primary-level font-semibold">
        {formatNumber(displayValue)}{suffix}
      </span>
    </div>
  );
}

// 热度色谱插值函数：从青色(低)到红色(高)
function interpolateHeatColor(value: number): string {
  // 热度色谱：青色 -> 蓝色 -> 橙色 -> 红色
  const colors = [
    { r: 6, g: 182, b: 212 },    // 青色 #06b6d4
    { r: 59, g: 130, b: 246 },   // 蓝色 #3b82f6
    { r: 249, g: 115, b: 22 },   // 橙色 #f97316
    { r: 239, g: 68, b: 68 },    // 红色 #ef4444
  ];
  
  const scaledValue = value * (colors.length - 1);
  const index = Math.floor(scaledValue);
  const fraction = scaledValue - index;
  
  if (index >= colors.length - 1) {
    const c = colors[colors.length - 1];
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
  }
  
  const c1 = colors[index];
  const c2 = colors[index + 1];
  
  const r = Math.round(c1.r + (c2.r - c1.r) * fraction);
  const g = Math.round(c1.g + (c2.g - c1.g) * fraction);
  const b = Math.round(c1.b + (c2.b - c1.b) * fraction);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function HeatPulseBar() {
  return (
    <div className="w-full mt-8">
      <div 
        className="flex items-end"
        style={{ 
          display: "flex", 
          alignItems: "flex-end", 
          gap: "4px", 
          height: "24px" 
        }}
      >
        {weeklyHeatData.map((value, index) => (
          <div
            key={index}
            className="transition-all duration-500"
            style={{
              flex: 1,
              borderRadius: "1px",
              backgroundColor: interpolateHeatColor(value),
              height: `${Math.max(4, value * 24)}px`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-disabled-level">近7天热度</span>
        <span className="text-[10px] text-disabled-level">今日</span>
      </div>
    </div>
  );
}

function PhoneOutline() {
  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[280px] md:h-[320px] w-auto max-w-full opacity-[0.12]"
      style={{ stroke: "var(--brand-primary)", strokeWidth: 1.5 }}
    >
      <rect x="20" y="10" width="160" height="380" rx="24" ry="24" />
      <rect x="28" y="30" width="144" height="340" rx="16" ry="16" strokeDasharray="4 4" />
      <line x1="80" y1="20" x2="120" y2="20" strokeWidth="2" />
      <circle cx="140" cy="20" r="3" />
      <circle cx="100" cy="50" r="8" strokeDasharray="2 2" />
      <circle cx="100" cy="50" r="4" />
      <rect x="40" y="280" width="120" height="70" rx="20" ry="20" />
      <circle cx="70" cy="315" r="18" />
      <circle cx="70" cy="315" r="12" strokeDasharray="3 3" />
      <circle cx="70" cy="315" r="6" />
      <circle cx="110" cy="305" r="12" />
      <circle cx="110" cy="305" r="7" />
      <circle cx="110" cy="335" r="10" />
      <circle cx="110" cy="335" r="5" />
      <rect x="140" y="295" width="8" height="8" rx="2" />
      <line x1="85" y1="385" x2="115" y2="385" strokeWidth="3" />
      <line x1="180" y1="80" x2="180" y2="110" />
      <line x1="180" y1="130" x2="180" y2="160" />
      <line x1="20" y1="100" x2="20" y2="130" />
    </svg>
  );
}

export function HeroDiscussion() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden",
        "min-h-[520px] md:min-h-[580px]"
      )}
    >
      <div className="absolute inset-0 bg-background" />

      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          background: "radial-gradient(circle, var(--primary-glow-md) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          left: "-5%",
          bottom: "-20%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="grid-bg absolute inset-0 opacity-100" />

      <div className="relative h-full max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid h-full gap-8 md:gap-12 grid-cols-1 md:grid-cols-[1.2fr_1fr]">
          {/* Left: Text Area */}
          <div className="flex flex-col justify-center">
            {/* Tag Pill */}
            <span className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-brand bg-brand/10 px-3.5 py-1.5 rounded-full border border-brand/20">
              <Flame className="size-3.5" />
              本周热议
            </span>

            {/* Phone Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-level leading-[1.1] mt-5 tracking-tight">
              小米 15 Ultra
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-tertiary-level leading-relaxed max-w-[480px] mt-4">
              续航崩了，但影像无敌
            </p>

            {/* Core Specs */}
            <div className="flex gap-8 md:gap-12 mt-8">
              {coreSpecs.map((spec) => (
                <SpecNumber
                  key={spec.label}
                  value={spec.value}
                  suffix={spec.suffix}
                  label={spec.label}
                  isInView={isInView}
                />
              ))}
            </div>

            {/* Heat Pulse Bar */}
            <HeatPulseBar />

            {/* Search Box */}
            <div className="w-full max-w-md mt-8">
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-brand/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -m-px" />
                <input
                  type="text"
                  placeholder="搜索手机型号、品牌或功能..."
                  className={cn(
                    "relative w-full h-12 md:h-14 px-5 pr-12",
                    "bg-surface-card backdrop-blur-xl",
                    "border border-white/[0.06] rounded-xl",
                    "text-body-level placeholder:text-disabled-level",
                    "focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20",
                    "transition-all duration-300"
                  )}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-micro">
                  <Search className="size-4" />
                </button>
              </div>
            </div>

            {/* Hot Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {hotTags.map((tag) => (
                <button
                  key={tag}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full",
                    "bg-white/[0.03] hover:bg-white/[0.08]",
                    "border border-white/[0.06] hover:border-white/[0.12]",
                    "text-tertiary-level hover:text-primary-level",
                    "transition-micro cursor-pointer"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Visual + Hot Topics */}
          <div className="relative flex flex-col justify-center">
            {/* Phone Outline - Background Decoration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PhoneOutline />
            </div>

            {/* Hot Topics Panel */}
            <div className="relative rounded-2xl p-5 md:p-6 bg-surface-card/80 backdrop-blur-xl border border-white/[0.06] shadow-card">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-heat-hot/10">
                    <Flame className="size-4 text-heat-hot" />
                  </div>
                  <h2 className="text-base font-semibold text-primary-level">
                    热议话题
                  </h2>
                </div>
                <button className="text-sm text-brand hover:text-brand/80 transition-micro">
                  查看更多
                </button>
              </div>

              {/* Topic List */}
              <div className="space-y-3">
                {hotTopics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className={cn(
                      "group p-3.5 rounded-xl cursor-pointer",
                      "bg-white/[0.02] hover:bg-white/[0.06]",
                      "border border-transparent hover:border-white/[0.08]",
                      "transition-micro"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Rank Number */}
                      <span
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold",
                          index === 0
                            ? "bg-medal-gold/15 text-medal-gold"
                            : index === 1
                            ? "bg-medal-silver/15 text-medal-silver"
                            : index === 2
                            ? "bg-medal-bronze/15 text-medal-bronze"
                            : "bg-white/[0.06] text-tertiary-level"
                        )}
                      >
                        {index + 1}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-primary-level group-hover:text-brand transition-micro truncate">
                            {topic.title}
                          </h3>
                          <span
                            className={cn(
                              "flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
                              heatClassMap[topic.heat as keyof typeof heatClassMap]
                            )}
                          >
                            {heatIconMap[topic.heat as keyof typeof heatIconMap]}
                            {heatLabelMap[topic.heat as keyof typeof heatLabelMap]}
                          </span>
                        </div>
                        <p className="text-[13px] text-disabled-level line-clamp-1">
                          {topic.summary}
                        </p>
                        <div className="flex items-center gap-4 mt-1.5 text-[11px] text-disabled-level">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="size-3" />
                            {topic.replies.toLocaleString()} 回复
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-scroll-hint">
          <span className="text-[10px] text-disabled-level">向下滚动</span>
          <ChevronDown className="size-4 text-disabled-level" />
        </div>
      </div>
    </section>
  );
}
