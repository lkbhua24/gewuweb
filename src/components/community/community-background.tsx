"use client";

import { cn } from "@/lib/utils";

/**
 * 圈子社区页动态背景组件
 * 
 * 包含：
 * - 紫蓝调渐变背景
 * - 3个浮动光球（周期15-25s）
 */
interface CommunityBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function CommunityBackground({
  children,
  className,
}: CommunityBackgroundProps) {
  return (
    <div className={cn("circle-page", className)}>
      {/* 浮动光球层 */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />
      
      {/* 内容层 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
