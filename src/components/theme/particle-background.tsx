"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

// ============================================================================
// 模块二：Canvas 粒子波纹背景
// 三层视觉架构：动态渐变网格 + 粒子星云 + 光晕脉冲
// ============================================================================

interface ParticleBackgroundProps {
  /** 主题主色 */
  primaryColor?: string;
  /** 主题高光色 */
  highlightColor?: string;
  /** 是否启用动画 */
  enabled?: boolean;
  /** 粒子数量 (默认 400) */
  particleCount?: number;
  /** 光晕位置 (相对于 Canvas 中心) */
  glowPosition?: { x: number; y: number };
  /** 是否减少动态效果 (无障碍) */
  reducedMotion?: boolean;
}

// 粒子类
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  baseX: number;
  baseY: number;
  density: number;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    color: string,
    minSize: number = 1,
    maxSize: number = 3
  ) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * (maxSize - minSize) + minSize;
    // 布朗运动速度
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.3 + 0.3; // 0.3 - 0.6
    this.color = color;
    this.density = Math.random() * 30 + 1;
  }

  // 更新粒子位置 (布朗运动 + 鼠标排斥)
  update(
    canvasWidth: number,
    canvasHeight: number,
    mouseX: number | null,
    mouseY: number | null
  ) {
    // 布朗运动
    this.x += this.speedX;
    this.y += this.speedY;

    // 边界反弹
    if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
    if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;

    // 鼠标排斥效果 (半径 150px)
    if (mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const forceRadius = 150;

      if (distance < forceRadius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (forceRadius - distance) / forceRadius;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        this.x -= directionX;
        this.y -= directionY;
      }
    }
  }

  // 绘制粒子
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// 网格渐变类 (第3层)
class GradientMesh {
  private time: number = 0;
  private color: string;

  constructor(color: string) {
    this.color = color;
  }

  // 绘制流动网格
  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.time += 0.002; // 0.2px/frame 等效速度

    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height)
    );

    // 解析颜色
    const rgb = this.hexToRgb(this.color);
    if (!rgb) return;

    // 动态色彩流动
    const r = rgb.r;
    const g = rgb.g;
    const b = rgb.b;

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
    gradient.addColorStop(
      0.4 + Math.sin(this.time) * 0.1,
      `rgba(${r}, ${g}, ${b}, 0.08)`
    );
    gradient.addColorStop(
      0.7 + Math.cos(this.time * 0.7) * 0.1,
      `rgba(${r}, ${g}, ${b}, 0.03)`
    );
    gradient.addColorStop(1, "rgba(8, 12, 20, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 绘制网格线 (液态金属质感)
    this.drawGrid(ctx, width, height, r, g, b);
  }

  // 绘制流动网格线
  private drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    r: number,
    g: number,
    b: number
  ) {
    const gridSize = 60;
    const lineOpacity = 0.03;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
    ctx.lineWidth = 0.5;

    // 垂直线 (带流动偏移)
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      const offset = Math.sin(this.time + x * 0.01) * 10;
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset, height);
      ctx.stroke();
    }

    // 水平线
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      const offset = Math.cos(this.time + y * 0.01) * 10;
      ctx.moveTo(0, y + offset);
      ctx.lineTo(width, y + offset);
      ctx.stroke();
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}

// 光晕脉冲类 (第1层)
class GlowPulse {
  private time: number = 0;
  private color: string;
  private position: { x: number; y: number };

  constructor(color: string, position: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
    this.color = color;
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 4秒周期呼吸动画
    this.time += 0.016; // 约 60fps
    const breathe = (Math.sin(this.time * Math.PI * 0.5) + 1) / 2; // 0 -> 1 -> 0
    const scale = 1 + breathe * 0.15; // 1.0 -> 1.15 -> 1.0

    const centerX = width * this.position.x;
    const centerY = height * this.position.y;
    const baseRadius = 150; // 300px 直径

    const rgb = this.hexToRgb(this.color);
    if (!rgb) return;

    // 外发光
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      baseRadius * scale
    );

    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
    gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  updateColor(color: string) {
    this.color = color;
  }
}

export function ParticleBackground({
  primaryColor = "#00D9FF",
  highlightColor = "#00D9FF",
  enabled = true,
  particleCount = 400,
  glowPosition = { x: 0.5, y: 0.5 },
  reducedMotion = false,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const gradientMeshRef = useRef<GradientMesh | null>(null);
  const glowPulseRef = useRef<GlowPulse | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  // 检测移动端
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 初始化粒子
  const initParticles = useCallback(
    (width: number, height: number) => {
      particlesRef.current = [];
      const count = isMobile ? Math.floor(particleCount * 0.5) : particleCount;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(
          new Particle(width, height, highlightColor, 1, 3)
        );
      }
    },
    [highlightColor, particleCount, isMobile]
  );

  // 绘制粒子间连线
  const drawConnections = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      const maxDistance = 100;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = highlightColor;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    },
    [highlightColor]
  );

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 第3层：动态渐变网格
    if (gradientMeshRef.current && !reducedMotion) {
      gradientMeshRef.current.draw(ctx, canvas.width, canvas.height);
    }

    // 第1层：光晕脉冲 (在手机后方)
    if (glowPulseRef.current) {
      glowPulseRef.current.draw(ctx, canvas.width, canvas.height);
    }

    // 第2层：粒子星云
    if (!reducedMotion) {
      particlesRef.current.forEach((particle) => {
        particle.update(
          canvas.width,
          canvas.height,
          mouseRef.current.x,
          mouseRef.current.y
        );
        particle.draw(ctx);
      });

      // 绘制粒子间连线
      drawConnections(ctx, particlesRef.current);

      // 鼠标悬停环形波纹效果
      if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
        drawRipple(
          ctx,
          mouseRef.current.x,
          mouseRef.current.y,
          highlightColor
        );
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [drawConnections, highlightColor, reducedMotion]);

  // 绘制环形波纹
  const drawRipple = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    const time = Date.now() * 0.002;
    const rippleCount = 3;

    for (let i = 0; i < rippleCount; i++) {
      const radius = 50 + i * 30 + Math.sin(time + i) * 10;
      const opacity = 0.3 - i * 0.1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = Math.max(0, opacity);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  // 处理 Canvas 尺寸
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    initParticles(canvas.width, canvas.height);
  }, [initParticles]);

  // 鼠标事件处理
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: null, y: null };
  }, []);

  // 初始化
  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化各层
    gradientMeshRef.current = new GradientMesh(primaryColor);
    glowPulseRef.current = new GlowPulse(primaryColor, glowPosition);

    handleResize();
    animate();

    // 事件监听
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    enabled,
    reducedMotion,
    primaryColor,
    glowPosition,
    animate,
    handleResize,
    handleMouseMove,
    handleMouseLeave,
  ]);

  // 更新颜色
  useEffect(() => {
    if (gradientMeshRef.current) {
      gradientMeshRef.current = new GradientMesh(primaryColor);
    }
    if (glowPulseRef.current) {
      glowPulseRef.current.updateColor(primaryColor);
    }
    // 更新粒子颜色
    particlesRef.current.forEach((particle) => {
      particle.color = highlightColor;
    });
  }, [primaryColor, highlightColor]);

  // 移动端降级：CSS 渐变
  if (isMobile || reducedMotion) {
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at ${glowPosition.x * 100}% ${glowPosition.y * 100}%, ${primaryColor}20 0%, transparent 50%),
                       radial-gradient(circle at 50% 50%, ${highlightColor}10 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

// ============================================================================
// 无障碍设置上下文
// ============================================================================

import { createContext, useContext, ReactNode } from "react";

interface ParticleBackgroundContextType {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
}

const ParticleBackgroundContext = createContext<
  ParticleBackgroundContextType | undefined
>(undefined);

export function ParticleBackgroundProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <ParticleBackgroundContext.Provider
      value={{ reducedMotion, setReducedMotion }}
    >
      {children}
    </ParticleBackgroundContext.Provider>
  );
}

export function useParticleBackground() {
  const context = useContext(ParticleBackgroundContext);
  if (!context) {
    throw new Error(
      "useParticleBackground must be used within ParticleBackgroundProvider"
    );
  }
  return context;
}
