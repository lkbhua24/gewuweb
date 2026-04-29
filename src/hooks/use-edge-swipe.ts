"use client";

import { useEffect, useRef, useCallback } from "react";

// ============================================================================
// 边缘滑动手势检测 Hook
// 检测从屏幕左侧边缘向右滑动的手势
// ============================================================================

interface EdgeSwipeOptions {
  /** 触发阈值（像素），超过此距离视为有效滑动 */
  threshold?: number;
  /** 边缘检测宽度（像素），从此区域开始的滑动才有效 */
  edgeWidth?: number;
  /** 滑动回调 */
  onSwipe?: () => void;
  /** 是否启用 */
  enabled?: boolean;
}

export function useEdgeSwipe(options: EdgeSwipeOptions) {
  const { threshold = 80, edgeWidth = 30, onSwipe, enabled = true } = options;
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isTracking = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      // 只检测从左侧边缘开始的滑动
      if (x <= edgeWidth) {
        touchStartX.current = x;
        touchStartY.current = y;
        isTracking.current = true;
      }
    },
    [enabled, edgeWidth]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isTracking.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // 如果垂直滑动超过水平滑动，取消跟踪
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isTracking.current = false;
        return;
      }

      // 阻止默认行为（防止页面滚动）
      if (deltaX > 0) {
        e.preventDefault();
      }
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isTracking.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      // 检查是否达到触发阈值
      if (deltaX >= threshold && Math.abs(deltaY) < threshold) {
        onSwipe?.();
      }

      isTracking.current = false;
    },
    [threshold, onSwipe]
  );

  useEffect(() => {
    if (!enabled) return;

    // 使用 { passive: false } 以便可以阻止默认行为
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // 鼠标模拟（用于桌面端调试）
  const mouseStartX = useRef(0);
  const mouseIsTracking = useRef(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;
      if (e.clientX <= edgeWidth) {
        mouseStartX.current = e.clientX;
        mouseIsTracking.current = true;
      }
    },
    [enabled, edgeWidth]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!mouseIsTracking.current) return;
      const deltaX = e.clientX - mouseStartX.current;
      if (deltaX >= threshold) {
        onSwipe?.();
      }
      mouseIsTracking.current = false;
    },
    [threshold, onSwipe]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enabled, handleMouseDown, handleMouseUp]);
}
