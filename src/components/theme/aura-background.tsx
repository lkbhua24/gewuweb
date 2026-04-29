"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useAuraTheme, type UseAuraThemeOptions } from "@/hooks/use-aura-theme";
import { cn } from "@/lib/utils";

// ============================================================================
// 氛围背景组件 - Aura Background
// ============================================================================

interface AuraBackgroundProps extends UseAuraThemeOptions {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "normal" | "strong";
  showGradient?: boolean;
  showGlow?: boolean;
  animate?: boolean;
}

/**
 * 氛围背景容器
 *
 * 为子元素提供基于手机主色的动态氛围晕染效果
 *
 * @example
 * <AuraBackground brand="xiaomi" model="14 Pro" intensity="normal">
 *   <PhoneCard />
 * </AuraBackground>
 */
export function AuraBackground({
  children,
  className,
  intensity = "normal",
  showGradient = true,
  showGlow = true,
  animate = false,
  ...themeOptions
}: AuraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, applyToElement, isReady } = useAuraTheme(themeOptions);

  useEffect(() => {
    if (containerRef.current) {
      applyToElement(containerRef.current);
    }
  }, [applyToElement]);

  const intensityStyles = {
    subtle: {
      opacity: 0.4,
      blur: "80px",
      scale: "0.8",
    },
    normal: {
      opacity: 0.7,
      blur: "120px",
      scale: "1",
    },
    strong: {
      opacity: 1,
      blur: "160px",
      scale: "1.2",
    },
  };

  const style = intensityStyles[intensity];

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        // 使用 CSS 变量作为 fallback，等待 JS 设置实际值
        ["--aura-color" as string]: theme.auraColor,
        ["--aura-gradient" as string]: theme.auraGradient,
        ["--aura-glow" as string]: theme.glowColor,
      }}
    >
      {/* 底层晕染光晕 */}
      {showGradient && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            animate && "transition-all duration-1000 ease-in-out"
          )}
          style={{
            background: "var(--aura-gradient)",
            opacity: isReady ? style.opacity : 0,
            filter: `blur(${style.blur})`,
            transform: `scale(${style.scale})`,
            transition: animate ? "all 1s ease-in-out" : undefined,
          }}
        />
      )}

      {/* 中心发光点 */}
      {showGlow && (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none",
            animate && "transition-all duration-1000 ease-in-out"
          )}
          style={{
            width: "60%",
            height: "60%",
            background: "radial-gradient(circle, var(--aura-glow) 0%, transparent 70%)",
            opacity: isReady ? style.opacity * 0.6 : 0,
            filter: `blur(${style.blur})`,
            transition: animate ? "all 1s ease-in-out" : undefined,
          }}
        />
      )}

      {/* 内容层 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================================================
// 氛围卡片组件 - Aura Card
// ============================================================================

interface AuraCardProps extends UseAuraThemeOptions {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "outline";
}

/**
 * 带有氛围色边框/背景的卡片
 */
export function AuraCard({
  children,
  className,
  variant = "default",
  ...themeOptions
}: AuraCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme, applyToElement } = useAuraTheme(themeOptions);

  useEffect(() => {
    if (cardRef.current) {
      applyToElement(cardRef.current);
    }
  }, [applyToElement]);

  const variantStyles = {
    default: {
      background: "var(--aura-soft-bg)",
      border: "1px solid var(--aura-border-glow)",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1), 0 0 20px var(--aura-glow)",
    },
    glass: {
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(20px)",
      border: "1px solid var(--aura-border-glow)",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
    },
    outline: {
      background: "transparent",
      border: "1px solid var(--aura-border-glow)",
      boxShadow: "0 0 20px var(--aura-glow)",
    },
  };

  return (
    <div
      ref={cardRef}
      className={cn("rounded-2xl overflow-hidden transition-all duration-300", className)}
      style={variantStyles[variant]}
    >
      {children}
    </div>
  );
}

// ============================================================================
// 氛围文字组件 - Aura Text
// ============================================================================

interface AuraTextProps extends UseAuraThemeOptions {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  gradient?: boolean;
}

/**
 * 带有氛围色的文字
 */
export function AuraText({
  children,
  className,
  as: Component = "span",
  gradient = false,
  ...themeOptions
}: AuraTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const { applyToElement } = useAuraTheme(themeOptions);

  useEffect(() => {
    if (textRef.current) {
      applyToElement(textRef.current);
    }
  }, [applyToElement]);

  return (
    <Component
      ref={textRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement & HTMLDivElement>}
      className={cn(
        gradient && "bg-gradient-to-r from-[var(--aura-color)] to-[var(--aura-glow)] bg-clip-text text-transparent",
        className
      )}
      style={!gradient ? { color: "var(--aura-glow)" } : undefined}
    >
      {children}
    </Component>
  );
}

// ============================================================================
// 氛围按钮组件 - Aura Button
// ============================================================================

interface AuraButtonProps extends UseAuraThemeOptions {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "filled" | "outline" | "ghost";
}

/**
 * 带有氛围色的按钮
 */
export function AuraButton({
  children,
  className,
  onClick,
  disabled = false,
  variant = "filled",
  ...themeOptions
}: AuraButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { applyToElement } = useAuraTheme(themeOptions);

  useEffect(() => {
    if (btnRef.current) {
      applyToElement(btnRef.current);
    }
  }, [applyToElement]);

  const variantStyles = {
    filled: {
      background: "var(--aura-glow)",
      color: "#080c14",
      border: "none",
    },
    outline: {
      background: "transparent",
      color: "var(--aura-glow)",
      border: "1px solid var(--aura-border-glow)",
    },
    ghost: {
      background: "var(--aura-soft-bg)",
      color: "var(--aura-glow)",
      border: "none",
    },
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all duration-200",
        "hover:opacity-90 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  );
}
