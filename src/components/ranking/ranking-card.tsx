"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateRankingColorMatrix } from "@/lib/color-theme";
import type { PhoneRanking, RankingType } from "@/types/ranking";
import { RANKING_CATEGORIES } from "@/types/ranking";
import { PhoneSilhouette } from "./phone-silhouette";
import { ColorSelector } from "./color-selector";
import { useHeroTransition } from "@/hooks/use-hero-transition";

// ============================================================================
// 排行榜卡片组件 - 包含交互动效
// ============================================================================

interface RankingCardProps {
  phone: PhoneRanking;
  currentCategory: RankingType;
  themeColor: string;
  index: number;
  isVisible: boolean;
  staggerDelay?: number;
  onColorSelect: (phoneId: string, colorId: string) => void;
  isPlaceholder?: boolean;
}

interface RippleState {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function RankingCard({
  phone,
  currentCategory,
  themeColor,
  index,
  isVisible,
  staggerDelay = 50,
  onColorSelect,
  isPlaceholder = false,
}: RankingCardProps) {
  const scoreKey = RANKING_CATEGORIES.find((c) => c.id === currentCategory)?.scoreKey || "overall";
  const mainScore = phone.scores[scoreKey];
  const isTopThree = phone.rank <= 3;

  // 计算入场动画延迟
  const animationDelay = index * staggerDelay;

  // 使用传入的 themeColor（已处理连续相近色降饱和）
  const matrix = useMemo(() => generateRankingColorMatrix(themeColor), [themeColor]);

  // 分离分数整数和小数部分
  const scoreStr = mainScore.toFixed(1);
  const [scoreInt, scoreDecimal] = scoreStr.split(".");

  // Hero 转场动画
  const { startTransition } = useHeroTransition();
  const cardRef = useRef<HTMLButtonElement>(null);

  // 按压反馈状态
  const [scale, setScale] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const rippleIdRef = useRef(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 创建 ripple
  const createRipple = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 计算到最远角的距离作为扩散半径
    const maxRadius = Math.max(
      Math.sqrt(x ** 2 + y ** 2),
      Math.sqrt((rect.width - x) ** 2 + y ** 2),
      Math.sqrt(x ** 2 + (rect.height - y) ** 2),
      Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
    );

    const id = rippleIdRef.current++;
    const newRipple: RippleState = {
      id,
      x,
      y,
      size: maxRadius * 2,
    };

    setRipples((prev) => [...prev, newRipple]);

    // ripple 动画结束后移除
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 400);
  }, []);

  // 处理按压开始
  const handlePressStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();

    setIsPressed(true);
    setScale(0.96);
    setIsLongPress(false);

    // 长按检测（500ms）
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setScale(0.97);
    }, 500);

    // 获取点击坐标
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    createRipple(clientX, clientY, rect);
  }, [createRipple]);

  // 处理按压结束
  const handlePressEnd = useCallback(() => {
    if (!isPressed) return;

    // 清除长按计时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setIsPressed(false);

    // 如果是长按状态，直接恢复
    if (isLongPress) {
      setIsLongPress(false);
      setScale(1);
      return;
    }

    // Spring 回弹动画：0.96 → 1.02 → 1.0
    setScale(1.02);

    setTimeout(() => {
      setScale(1);
    }, 120);

    // 触发 Hero 转场动画
    if (cardRef.current) {
      const categoryLabel = RANKING_CATEGORIES.find((c) => c.id === currentCategory)?.label || "评分";
      startTransition({
        element: cardRef.current,
        phoneId: phone.id,
        themeColor,
        phoneData: {
          brand: phone.brand,
          model: phone.model,
          priceCny: phone.priceCny,
          score: mainScore,
          scoreLabel: categoryLabel,
          rank: phone.rank,
          screenType: phone.screenType,
          imageUrl: phone.imageUrl,
        },
        targetUrl: `/phones/${phone.id}?from=ranking`,
      });
    }
  }, [isPressed, isLongPress, phone, themeColor, mainScore, currentCategory, startTransition]);

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isPressed) {
      handlePressEnd();
    }
  }, [isPressed, handlePressEnd]);

  // 根据屏幕类型获取边缘样式类
  const getEdgeClass = () => {
    switch (phone.screenType) {
      case "curved":
        return "capsule-edge-curved";
      case "flat":
        return "capsule-edge-flat";
      case "waterfall":
        return "capsule-edge-waterfall";
      case "foldable":
        return "capsule-edge-foldable";
      default:
        return "";
    }
  };

  // 根据材质获取样式类
  const getMaterialClass = () => {
    switch (phone.materialType) {
      case "titanium":
        return "capsule-material-titanium";
      case "ceramic":
        return "capsule-material-ceramic";
      default:
        return "";
    }
  };

  // 获取徽章样式
  const getBadgeStyle = () => {
    if (phone.rank === 1) {
      return {
        beforeBg: `conic-gradient(from 0deg, ${matrix.top3BadgeStroke} 0deg, ${themeColor} 90deg, ${matrix.top3BadgeStroke} 180deg, ${themeColor} 270deg, ${matrix.top3BadgeStroke} 360deg)`,
        innerBg: matrix.top3BadgeBackground,
        innerShadow: `inset 0 0 8px ${matrix.top3BadgeStroke}`,
      };
    }
    if (phone.rank === 2) {
      return {
        beforeBg: `conic-gradient(from 0deg, #E8E8E8 0deg, #C0C0C0 90deg, #E8E8E8 180deg, #C0C0C0 270deg, #E8E8E8 360deg)`,
        innerBg: "rgba(192, 192, 192, 0.15)",
        innerShadow: "inset 0 0 8px rgba(192, 192, 192, 0.2)",
      };
    }
    if (phone.rank === 3) {
      return {
        beforeBg: `conic-gradient(from 0deg, #CD7F32 0deg, #B87333 90deg, #CD7F32 180deg, #B87333 270deg, #CD7F32 360deg)`,
        innerBg: "rgba(205, 127, 50, 0.15)",
        innerShadow: "inset 0 0 8px rgba(205, 127, 50, 0.2)",
      };
    }
    return null;
  };

  const badgeStyle = getBadgeStyle();

  // 过渡样式
  const transitionStyle = isPressed
    ? `transform 100ms cubic-bezier(0.4, 0, 0.2, 1)`
    : `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

  // 占位符状态
  if (isPlaceholder) {
    return (
      <div
        data-animate-item
        data-animate-index={index}
        className={cn(
          "capsule-card relative overflow-hidden",
          isTopThree && "capsule-card-top3"
        )}
        style={{
          opacity: 0.3,
          pointerEvents: "none",
          filter: "grayscale(0.8)",
        }}
      >
        <div className="capsule-layer-1 h-full" />
        <div className="capsule-layer-2 absolute inset-0 flex items-center">
          <div className="flex items-center w-full h-full px-5">
            <div className="flex-shrink-0 w-[72px] flex items-center gap-2">
              <div className="rank-badge-normal">{phone.rank}</div>
            </div>
            <div className="flex-1 min-w-0 px-3">
              <span className="text-xs text-muted-foreground font-ranking-cn">{phone.brand}</span>
              <h3 className="font-ranking-cn font-medium text-sm truncate leading-tight">{phone.model}</h3>
            </div>
            <div className="flex-shrink-0 w-[80px] text-right">
              <div className="text-xl font-ranking-num font-bold text-muted-foreground">{scoreInt}.{scoreDecimal}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-animate-item
      data-animate-index={index}
      className={cn(
        !isVisible && "capsule-animate-hidden",
        isVisible && "capsule-animate-enter"
      )}
      style={{ animationDelay: isVisible ? `${animationDelay}ms` : "0ms" }}
    >
      <button
        ref={cardRef}
        role="link"
        aria-label={`${phone.brand} ${phone.model}，排名第${phone.rank}，${mainScore.toFixed(1)}分`}
        className={cn(
          "capsule-card group cursor-pointer capsule-pressable relative overflow-hidden block text-left",
          isTopThree && "capsule-card-top3",
          getEdgeClass(),
          getMaterialClass(),
          isLongPress && "capsule-long-press"
        )}
        style={{
          ["--capsule-start" as string]: matrix.capsuleGradientStart,
          ["--capsule-end" as string]: matrix.capsuleGradientEnd,
          ["--badge-stroke" as string]: matrix.top3BadgeStroke,
          ["--badge-bg" as string]: matrix.top3BadgeBackground,
          ["--price-color" as string]: matrix.priceText,
          ["--param-color" as string]: matrix.coreParamValue,
          ["--decimal-color" as string]: matrix.scoreDecimal,
          transform: `scale(${scale})`,
          transition: transitionStyle,
        }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full animate-ripple-expand"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2,
            background: `radial-gradient(circle, ${themeColor}30 0%, ${themeColor}10 40%, transparent 70%)`,
          }}
        />
      ))}

      <div className="capsule-shine" />

      <div
        className="capsule-layer-0"
        style={{
          background: `linear-gradient(90deg, var(--capsule-start) 0%, var(--capsule-end) 100%)`,
        }}
      />

      {/* Layer 1: 毛玻璃主体 - 中层 */}
      <div className="capsule-layer-1 h-full" />

      {/* Layer 2: 信息内容 - 顶层 */}
      <div className="capsule-layer-2 absolute inset-0 flex items-center">
        <div className="flex items-center w-full h-full">
          {/* 左侧区：72px（排名徽章 + 侧视轮廓图） */}
          <div className="flex-shrink-0 w-[72px] flex items-center gap-2">
            {/* 排名徽章 */}
            {phone.rank <= 3 && badgeStyle ? (
              <div
                className="rank-badge ranking-layer-interactive"
                style={{ ["--badge-conic" as string]: badgeStyle.beforeBg }}
              >
                <div
                  className="rank-badge-inner"
                  style={{
                    background: badgeStyle.innerBg,
                    boxShadow: badgeStyle.innerShadow,
                  }}
                >
                  {phone.rank}
                </div>
              </div>
            ) : phone.rank <= 10 ? (
              <div className="rank-badge-normal ranking-layer-interactive">{phone.rank}</div>
            ) : (
              <div className="rank-badge-minimal ranking-layer-interactive">{phone.rank}</div>
            )}

            {/* 侧视轮廓图 */}
            <div className="silhouette-container">
              <PhoneSilhouette screenType={phone.screenType} themeColor={themeColor} />
            </div>
          </div>

          {/* 中央区：flex-1（品牌、型号、价格、配色选择器） */}
          <div className="flex-1 min-w-0 px-3">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground font-ranking-cn">{phone.brand}</span>
              {phone.screenType === "curved" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 font-ranking-cn">
                  曲面
                </span>
              )}
              {phone.screenType === "waterfall" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-ranking-cn">
                  瀑布
                </span>
              )}
              {phone.screenType === "foldable" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-ranking-cn">
                  折叠
                </span>
              )}
              {phone.materialType === "titanium" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-400 font-ranking-cn">
                  钛
                </span>
              )}
              {phone.materialType === "ceramic" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-ranking-cn">
                  陶瓷
                </span>
              )}
              {/* 配色选择器 */}
              <ColorSelector
                options={phone.colorOptions}
                selectedId={phone.selectedColorId}
                onSelect={(colorId) => onColorSelect(phone.id, colorId)}
              />
            </div>
            <h3 className="font-ranking-cn font-medium text-sm truncate leading-tight">{phone.model}</h3>
            {phone.priceCny && (
              <p
                className="text-xs font-ranking-num font-semibold mt-0.5"
                style={{ color: "var(--price-color)" }}
              >
                ¥{phone.priceCny.toLocaleString()}
              </p>
            )}
          </div>

          {/* 右侧区：80px（核心分数，右对齐） */}
          <div className="flex-shrink-0 w-[80px] text-right">
            <div className="text-xl font-ranking-num font-bold" style={{ color: "var(--param-color)" }}>
              {scoreInt}
              <span className="text-sm" style={{ color: "var(--decimal-color)" }}>
                .{scoreDecimal}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground font-ranking-cn">
              {RANKING_CATEGORIES.find((c) => c.scoreKey === scoreKey)?.label || "评分"}
            </div>
          </div>
        </div>
      </div>
    </button>
    </div>
  );
}
