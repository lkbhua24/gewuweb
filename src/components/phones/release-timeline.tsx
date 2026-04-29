"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Flame, MessageCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type HeatLevel = "cold" | "discussing" | "hot" | "boom" | "editor";

interface ReleaseItem {
  id: string;
  brand: string;
  model: string;
  releaseDate: string;
  status: "released" | "upcoming";
  heatLevel: HeatLevel;
  chip?: string;
  specs?: string;
}

const releaseData: ReleaseItem[] = [
  {
    id: "1",
    brand: "Apple",
    model: "iPhone 16 Pro",
    releaseDate: "2024-09-20",
    status: "released",
    heatLevel: "boom",
    chip: "A18 Pro",
    specs: '6.3" | 3582mAh',
  },
  {
    id: "2",
    brand: "HUAWEI",
    model: "Mate 70 Pro+",
    releaseDate: "2024-11-26",
    status: "released",
    heatLevel: "hot",
    chip: "麒麟9020",
    specs: '6.9" | 5700mAh',
  },
  {
    id: "3",
    brand: "Samsung",
    model: "Galaxy S25 Ultra",
    releaseDate: "2025-01-23",
    status: "released",
    heatLevel: "discussing",
    chip: "骁龙 8 Elite",
    specs: '6.9" | 5000mAh',
  },
  {
    id: "4",
    brand: "Xiaomi",
    model: "小米 15 Ultra",
    releaseDate: "2025-02-27",
    status: "released",
    heatLevel: "boom",
    chip: "骁龙 8 Elite",
    specs: '6.73" | 6000mAh',
  },
  {
    id: "5",
    brand: "OPPO",
    model: "Find X8 Ultra",
    releaseDate: "2025-04-15",
    status: "upcoming",
    heatLevel: "hot",
    chip: "骁龙 8 Elite",
    specs: '6.82" | 6000mAh',
  },
  {
    id: "6",
    brand: "vivo",
    model: "X200 Ultra",
    releaseDate: "2025-04-20",
    status: "upcoming",
    heatLevel: "discussing",
    chip: "骁龙 8 Elite",
    specs: '6.8" | 5500mAh',
  },
  {
    id: "7",
    brand: "OnePlus",
    model: "13T",
    releaseDate: "2025-04-25",
    status: "upcoming",
    heatLevel: "discussing",
    chip: "骁龙 8 Gen3",
    specs: '6.3" | 5500mAh',
  },
  {
    id: "8",
    brand: "realme",
    model: "GT7",
    releaseDate: "2025-05-10",
    status: "upcoming",
    heatLevel: "cold",
    chip: "天玑 9400",
    specs: '6.78" | 5800mAh',
  },
  {
    id: "9",
    brand: "Nubia",
    model: "Z70 Ultra",
    releaseDate: "2025-05-15",
    status: "upcoming",
    heatLevel: "cold",
    chip: "骁龙 8 Elite",
    specs: '6.8" | 6000mAh',
  },
  {
    id: "10",
    brand: "Redmi",
    model: "K80 Ultra",
    releaseDate: "2025-06-01",
    status: "upcoming",
    heatLevel: "discussing",
    chip: "天玑 9400",
    specs: '6.67" | 6500mAh',
  },
];

const heatDotClass: Record<HeatLevel, string> = {
  cold: "bg-gray-500",
  discussing: "bg-heat-discussing",
  hot: "bg-heat-hot",
  boom: "bg-heat-boom",
  editor: "bg-heat-editor",
};

const heatBadgeClass: Record<HeatLevel, string> = {
  cold: "",
  discussing: "text-heat-discussing bg-heat-discussing/10",
  hot: "text-heat-hot bg-heat-hot/10",
  boom: "text-heat-boom bg-heat-boom/10",
  editor: "text-heat-editor bg-heat-editor/10",
};

const heatIconMap: Record<HeatLevel, React.ReactNode> = {
  cold: null,
  discussing: <MessageCircle className="size-3" />,
  hot: <TrendingUp className="size-3" />,
  boom: <Flame className="size-3" />,
  editor: null,
};

const heatLabelMap: Record<HeatLevel, string> = {
  cold: "",
  discussing: "讨论中",
  hot: "热门",
  boom: "爆款",
  editor: "编辑推荐",
};

function getRelativeTime(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();

  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 未来时间（待发布）
  if (diffMs < 0) {
    const futureDays = Math.ceil(-diffMs / (1000 * 60 * 60 * 24));
    return `预计 ${futureDays} 天后发布`;
  }

  // 7天内
  if (diffDays < 1) {
    if (diffHours < 1) {
      if (diffMinutes < 1) return "刚刚";
      return `${diffMinutes}分钟前`;
    }
    return `${diffHours}小时前`;
  }
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;

  // 7-30天
  if (diffDays < 30) {
    if (diffDays < 14) return "上周";
    return `${diffDays}天前`;
  }

  // 超过30天：显示 X月X日
  return `${target.getMonth() + 1}月${target.getDate()}日`;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function ReleasedNodeDot({ heatLevel }: { heatLevel: HeatLevel }) {
  return (
    <div
      className={cn(
        "size-3.5 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-background",
        heatDotClass[heatLevel],
        heatLevel === "boom" ? "ring-heat-boom/30" : heatLevel === "hot" ? "ring-heat-hot/30" : "ring-transparent"
      )}
    />
  );
}

function UpcomingNodeDot() {
  return (
    <div className="relative flex items-center justify-center size-3.5">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/40 animate-pulse" />
      <div className="size-2 rounded-full bg-purple-400/60" />
    </div>
  );
}

function ReleasedCard({ item }: { item: ReleaseItem }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[220px] bottom-[calc(100%+20px)]">
      <div className="p-4 rounded-xl backdrop-blur-xl bg-surface-card/95 border border-white/[0.08] shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-brand font-medium">
            {getRelativeTime(item.releaseDate)}
          </span>
          <span className="text-[11px] text-disabled-level">
            {formatDate(item.releaseDate)}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-primary-level">
          {item.model}
        </h4>
        {item.chip && (
          <p className="mt-1 text-xs text-tertiary-level font-mono">
            {item.chip}
            {item.specs && <span className="text-disabled-level ml-1">| {item.specs}</span>}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-white/[0.06] text-tertiary-level">
            已发布
          </span>
          {heatLabelMap[item.heatLevel] && (
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", heatBadgeClass[item.heatLevel])}>
              {heatIconMap[item.heatLevel]}
              {heatLabelMap[item.heatLevel]}
            </span>
          )}
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-surface-card/95" />
    </div>
  );
}

function UpcomingCard({ item }: { item: ReleaseItem }) {
  const daysUntil = getDaysUntil(item.releaseDate);
  const chipDisplay = item.chip || "?";
  const specsDisplay = item.specs || "?";
  const hasUnknown = !item.chip || !item.specs;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-[220px] top-[calc(100%+20px)]">
      <div className="p-4 rounded-xl backdrop-blur-xl bg-surface-card/95 border border-dashed border-purple-400/30 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-purple-400 font-medium">
            {daysUntil > 0 ? `预计 ${daysUntil} 天后发布` : "即将发布"}
          </span>
          <span className="text-[11px] text-disabled-level">
            {formatDate(item.releaseDate)}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-primary-level">
          {item.model}
        </h4>
        <p className="mt-1 text-xs text-disabled-level font-mono">
          {chipDisplay}
          <span className="ml-1">| {specsDisplay}</span>
        </p>
        {hasUnknown && (
          <p
            style={{
              fontSize: "11px",
              color: "#64748b",
              fontStyle: "italic",
              marginTop: "4px",
            }}
          >
            爆料参数，仅供参考
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border border-dashed border-purple-400/30 text-purple-400">
            待发布
          </span>
          {heatLabelMap[item.heatLevel] && (
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", heatBadgeClass[item.heatLevel])}>
              {heatIconMap[item.heatLevel]}
              {heatLabelMap[item.heatLevel]}
            </span>
          )}
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -top-[6px] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-surface-card/95" />
    </div>
  );
}

function TimelineNode({ item, index }: { item: ReleaseItem; index: number }) {
  const isUpcoming = item.status === "upcoming";
  const isAbove = index % 2 === 0;

  return (
    <div className="relative flex-shrink-0 group cursor-pointer w-[140px] flex items-center justify-center">
      {isUpcoming ? <UpcomingCard item={item} /> : <ReleasedCard item={item} />}

      <div
        className="relative flex flex-col items-center"
        style={{
          height: "120px",
          justifyContent: isAbove ? "flex-end" : "flex-start",
          paddingBottom: isAbove ? "54px" : undefined,
          paddingTop: !isAbove ? "54px" : undefined,
        }}
      >
        <div
          className={cn(
            "w-px",
            isUpcoming ? "bg-purple-400/20" : "bg-white/10"
          )}
          style={{
            height: "40px",
            marginBottom: isAbove ? "8px" : undefined,
            marginTop: !isAbove ? "8px" : undefined,
          }}
        />
        {isUpcoming ? <UpcomingNodeDot /> : <ReleasedNodeDot heatLevel={item.heatLevel} />}
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
        style={{ [isAbove ? "bottom" : "top"]: "8px" }}
      >
        <span className={cn("text-xs font-medium", isUpcoming ? "text-purple-400" : "text-tertiary-level")}>
          {item.brand}
        </span>
        <span className={cn("text-xs ml-1", isUpcoming ? "text-purple-300" : "text-primary-level")}>
          {item.model.split(" ").pop()}
        </span>
      </div>
    </div>
  );
}

function TodayMarker() {
  return (
    <div className="absolute flex flex-col items-center z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-full">
      <span className="text-[11px] px-2 py-0.5 rounded-full text-brand bg-brand/10 border border-brand/20 mb-1.5">
        今天
      </span>
      <div className="w-0.5 h-6 bg-brand/60 rounded-full" />
    </div>
  );
}

export function ReleaseTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftMask, setShowLeftMask] = useState(false);
  const [showRightMask, setShowRightMask] = useState(true);

  const sortedData = [...releaseData].sort(
    (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
  );

  const hasToday = sortedData.some((item) => {
    const d = new Date(item.releaseDate);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  });

  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft: sl, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftMask(sl > 10);
    setShowRightMask(sl < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScrollPosition, { passive: true });
    checkScrollPosition();
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, [checkScrollPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  };

  const handleMouseUp = useCallback(() => {
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.cursor = "grab";
    containerRef.current.style.userSelect = "";
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("mousemove", handleGlobalMouseMove);
    }
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging, startX, scrollLeft, handleMouseUp]);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

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
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex items-center justify-center size-8 rounded-lg bg-brand/10">
                  <Calendar className="size-4 text-brand" />
                </div>
                <h2 className="text-2xl font-bold text-primary-level">
                  发布日历
                </h2>
              </div>
              <p className="text-sm text-tertiary-level ml-[42px]">
                已发布与待发布机型一览
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollByAmount("left")}
                className={cn(
                  "flex items-center justify-center size-9 rounded-xl border transition-micro",
                  showLeftMask
                    ? "border-white/[0.08] bg-white/[0.03] text-tertiary-level hover:text-primary-level hover:bg-white/[0.06]"
                    : "border-transparent text-disabled-level pointer-events-none"
                )}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => scrollByAmount("right")}
                className={cn(
                  "flex items-center justify-center size-9 rounded-xl border transition-micro",
                  showRightMask
                    ? "border-white/[0.08] bg-white/[0.03] text-tertiary-level hover:text-primary-level hover:bg-white/[0.06]"
                    : "border-transparent text-disabled-level pointer-events-none"
                )}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 ml-[42px]">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-heat-boom" />
              <span className="text-[11px] text-disabled-level">爆款</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-heat-hot" />
              <span className="text-[11px] text-disabled-level">热门</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-heat-discussing" />
              <span className="text-[11px] text-disabled-level">讨论中</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full border-2 border-dashed border-purple-400/40" />
              <span className="text-[11px] text-disabled-level">待发布</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative h-[300px]">
        <div className="absolute left-0 right-0 z-0 pointer-events-none h-px bg-white/[0.06] top-1/2" />

        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none transition-opacity duration-300",
            showLeftMask ? "opacity-100" : "opacity-0"
          )}
          style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
        />
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none transition-opacity duration-300",
            showRightMask ? "opacity-100" : "opacity-0"
          )}
          style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
        />

        <div
          ref={containerRef}
          className="overflow-x-auto cursor-grab active:cursor-grabbing h-full release-timeline-scroll"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex items-center h-full px-6 min-w-max relative">
            {hasToday && <TodayMarker />}
            <div className="flex items-center">
              {sortedData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: index % 2 === 0 ? -20 : 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <TimelineNode item={item} index={index} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-8 mt-4"
      >
        <p className="text-xs text-disabled-level flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-disabled-level" />
          左右拖拽查看更多
        </p>
      </motion.div>
    </section>
  );
}
