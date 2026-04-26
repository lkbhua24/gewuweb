"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Database,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Smartphone,
  Users,
  ShoppingCart,
  Shield,
  Scale,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";

// 打字机效果 Hook
function useTypewriter(words: string[], typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setDisplayText((prev) => prev.slice(0, -1));
          if (displayText.length <= 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        } else {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          if (displayText.length >= currentWord.length) {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime]);

  return displayText;
}

// 数字滚动动画组件 - easeOutExpo 缓动
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const startTime = performance.now();
    const duration = 1500; // 1.5s

    // easeOutExpo 缓动函数
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      if (ref.current) {
        ref.current.textContent = Math.floor(easedProgress * value).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-data">
      0
      {suffix}
    </span>
  );
}

// 粒子网格背景组件
function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; originX: number; originY: number }[]>([]);
  const animationRef = useRef<number | null>(null);

  const initParticles = useCallback((width: number, height: number) => {
    const spacing = 50;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    const particles = [];

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * spacing + (width - cols * spacing) / 2;
        const y = j * spacing + (height - rows * spacing) / 2;
        particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          originX: x,
          originY: y,
        });
      }
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const radius = 100;

      // 更新和绘制粒子
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 鼠标斥力效果
        if (dist < radius && dist > 0) {
          const force = (radius - dist) / radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.5;
          particle.vy -= Math.sin(angle) * force * 0.5;
        }

        // 回归原位
        const returnX = particle.originX - particle.x;
        const returnY = particle.originY - particle.y;
        particle.vx += returnX * 0.05;
        particle.vy += returnY * 0.05;

        // 阻尼
        particle.vx *= 0.9;
        particle.vy *= 0.9;

        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 217, 255, 0.03)";
        ctx.fill();
      });

      // 绘制连线
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${0.03 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

// 搜索框组件
function SearchBox() {
  const [isFocused, setIsFocused] = useState(false);
  const placeholderText = useTypewriter(
    ["iPhone 16 Pro", "小米15 价格走势", "骁龙8 Gen4 机型对比"],
    80,
    40,
    2000
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
      style={{ maxWidth: "min(680px, 90vw)" }}
    >
      <div
        className={`
          relative flex items-center h-16 rounded-2xl
          transition-all duration-300 ease
          ${isFocused 
            ? "border-[#00D9FF] shadow-[0_0_60px_rgba(0,217,255,0.15)]" 
            : "border-[rgba(0,217,255,0.3)] shadow-[0_0_40px_rgba(0,217,255,0.05)]"
          }
        `}
        style={{
          background: "rgba(17, 24, 39, 0.8)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        {/* 左侧 / 符号 */}
        <span className="pl-6 pr-3 font-data text-[#00D9FF] text-lg">/</span>
        
        {/* 输入框 */}
        <input
          type="text"
          className="flex-1 bg-transparent border-0 text-[#F9FAFB] text-lg placeholder:text-[#6B7280] focus:outline-none"
          placeholder={placeholderText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {/* 搜索按钮 */}
        <Button className="mr-2 h-12 px-6 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0B0F19] font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
          搜索
        </Button>
      </div>
    </motion.div>
  );
}

// 数据标签组件
function DataBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const badges = [
    { text: "实时追踪", value: 3284, suffix: "", unit: "款机型" },
    { text: "收录", value: 12.5, suffix: "万", unit: "条真实评价", isDecimal: true },
    { text: "今日最低好价", value: 4299, suffix: "", unit: "", prefix: "¥" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.4,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-wrap items-center justify-center gap-4 mt-8"
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{
            background: "rgba(17, 24, 39, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span className="text-sm text-[#9CA3AF]">{badge.text}</span>
          <span className="text-sm text-[#F9FAFB] font-data font-semibold">
            {badge.prefix}
            {badge.isDecimal ? (
              <>
                <AnimatedNumber value={badge.value} />
                {badge.suffix}
              </>
            ) : (
              <AnimatedNumber value={badge.value} suffix={badge.suffix} />
            )}
          </span>
          {badge.unit && <span className="text-sm text-[#9CA3AF]">{badge.unit}</span>}
        </div>
      ))}
    </motion.div>
  );
}

// 流程节点数据
const processSteps = [
  {
    id: 1,
    icon: Smartphone,
    title: "查参数",
    description: "全品牌机型参数一键对比",
    bgContent: "spec-table",
  },
  {
    id: 2,
    icon: TrendingUp,
    title: "看评价",
    description: "真实用户评价与价格走势",
    bgContent: "sparkline",
  },
  {
    id: 3,
    icon: Users,
    title: "聊搞机",
    description: "发烧友社区交流心得",
    bgContent: "community",
  },
  {
    id: 4,
    icon: ShoppingCart,
    title: "闭环成交",
    description: "全网比价直达最优价",
    bgContent: "deal",
  },
];

// 流程节点卡片背景组件
function StepBackground({ type }: { type: string }) {
  switch (type) {
    case "spec-table":
      return (
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
          <div className="p-4 text-[8px] text-[#9CA3AF] font-mono">
            <div className="border-b border-[#9CA3AF]/20 pb-1 mb-1">参数对比</div>
            <div className="grid grid-cols-3 gap-1">
              <div>CPU</div><div>骁龙8</div><div>A18</div>
              <div>屏幕</div><div>6.7&quot;</div><div>6.1&quot;</div>
              <div>电池</div><div>5000</div><div>3500</div>
            </div>
          </div>
        </div>
      );
    case "sparkline":
      return (
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none flex items-end justify-center pb-4">
          <svg width="80" height="40" viewBox="0 0 80 40">
            <path
              d="M0 30 Q20 25, 30 20 T50 15 T80 10"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="2"
            />
          </svg>
        </div>
      );
    case "community":
      return (
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
          <div className="p-3 space-y-2">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full bg-[#9CA3AF]/30" />
              <div className="h-2 w-16 bg-[#9CA3AF]/20 rounded" />
            </div>
            <div className="h-2 w-full bg-[#9CA3AF]/10 rounded" />
            <div className="h-2 w-3/4 bg-[#9CA3AF]/10 rounded" />
          </div>
        </div>
      );
    case "deal":
      return (
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none flex items-center justify-center">
          <div className="px-3 py-1.5 border border-[#34D399]/40 rounded text-[10px] text-[#34D399]">
            已成交
          </div>
        </div>
      );
    default:
      return null;
  }
}

// 流程节点卡片组件
function ProcessCard({ step, index }: { step: typeof processSteps[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = step.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1 + 0.3,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex-shrink-0"
      style={{ width: "240px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative h-full rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          padding: "32px 24px",
          background: "rgba(17, 24, 39, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {/* 扫光效果 */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-full pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />

        {/* 背景示意图 */}
        <StepBackground type={step.bgContent} />

        {/* 图标 */}
        <div
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
          style={{
            background: "rgba(0, 217, 255, 0.1)",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <Icon className="size-6 text-[#00D9FF]" strokeWidth={1.5} />
        </div>

        {/* 内容 */}
        <h3
          className="relative text-lg font-bold text-[#F9FAFB] mb-2"
          style={{ fontSize: "18px" }}
        >
          {step.title}
        </h3>
        <p
          className="relative text-sm text-[#9CA3AF] leading-relaxed"
          style={{ fontSize: "14px" }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

// 流程可视化组件
function ProcessFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[400px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0, 217, 255, 0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">
            一站式数码购机体验
          </h2>
          <p className="text-[#9CA3AF] max-w-xl mx-auto">
            从查参数到成交，四个步骤轻松搞定
          </p>
        </motion.div>

        {/* 流程图 */}
        <div className="relative">
          {/* SVG 连接线 */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 pointer-events-none hidden lg:block"
            style={{ zIndex: 0 }}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              ref={lineRef}
              d="M 120 8 Q 280 8, 360 8 T 600 8 T 840 8 T 1080 8"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="2"
              strokeOpacity="0.4"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                filter: "drop-shadow(0 0 6px #00D9FF)",
              }}
            />
          </svg>

          {/* 节点卡片 */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            {processSteps.map((step, index) => (
              <ProcessCard key={step.id} step={step} index={index} />
            ))}
          </div>

          {/* 移动端连接线 */}
          <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 pointer-events-none">
            <motion.div
              className="w-full bg-[#00D9FF]/40"
              style={{ filter: "drop-shadow(0 0 6px #00D9FF)" }}
              initial={{ height: "0%" }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// 信任背书铭牌组件
function TrustBadges() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const badges = [
    { icon: Shield, text: "无软文广告" },
    { icon: Scale, text: "CPS 佣金透明" },
    { icon: Radio, text: "价格实时同步" },
  ];

  return (
    <section ref={sectionRef} className="relative py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: index * 0.1 + 0.2,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl cursor-default transition-all duration-300 hover:border-[#00D9FF]/50 hover:shadow-[0_0_20px_rgba(0,217,255,0.1)]"
                style={{
                  background: "#1F2937",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Icon className="size-5 text-[#00D9FF]" strokeWidth={1.5} />
                <span className="text-sm text-[#9CA3AF] group-hover:text-[#F9FAFB] transition-colors duration-300">
                  {badge.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// 功能模块数据
const features = [
  {
    icon: Database,
    title: "参数数据库",
    description: "全品牌手机参数一键查询，深度对比分析",
    href: "/phones",
    stats: "2,847+ 机型",
    color: "from-[#00D9FF] to-[#00A3FF]",
  },
  {
    icon: TrendingUp,
    title: "智能导购",
    description: "全网比价、历史价格追踪，买到最值",
    href: "/shopping",
    stats: "实时好价",
    color: "from-[#A855F7] to-[#EC4899]",
  },
  {
    icon: MessageSquare,
    title: "发烧社区",
    description: "加入兴趣圈子，和发烧友聊搞机心得",
    href: "/community",
    stats: "156K+ 用户",
    color: "from-[#34D399] to-[#10B981]",
  },
];

// 热门手机展示
const hotPhones = [
  { name: "iPhone 16 Pro", price: "¥7,999", trend: "-5%", brand: "Apple" },
  { name: "小米 15 Ultra", price: "¥5,999", trend: "新品", brand: "Xiaomi" },
  { name: "Galaxy S25", price: "¥6,499", trend: "-8%", brand: "Samsung" },
  { name: "Mate 70 Pro", price: "¥6,999", trend: "-3%", brand: "HUAWEI" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      {/* Background Effects */}
      <ParticleGrid />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00D9FF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section - 负 margin 抵消 main 的 pt-16，实现真正的全屏效果 */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen -mt-16"
        style={{ paddingTop: "max(15vh, 120px)", paddingBottom: "10vh" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1], // cubic-bezier(0.16, 1, 0.3, 1) - easeOutExpo
            }}
            className="text-center w-full flex flex-col items-center"
          >
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[#F9FAFB] font-bold tracking-tight"
              style={{ fontSize: "clamp(64px, 10vw, 120px)", lineHeight: 1 }}
            >
              极物
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[#9CA3AF] mt-4 mb-10"
              style={{ fontSize: "20px", lineHeight: 1.5 }}
            >
              查参数、看评价、比价格、聊搞机的第一站
            </motion.p>

            {/* Search Box */}
            <SearchBox />

            {/* Data Badges */}
            <DataBadges />

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center justify-center gap-4 mt-10"
            >
              <Button
                render={
                  <Link href="/phones" className="inline-flex items-center">
                    开始探索
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                }
                className="h-12 px-8 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0B0F19] font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] group"
              />
              <Button
                render={<Link href="/community">加入社区</Link>}
                variant="outline"
                className="h-12 px-8 bg-transparent border-white/20 text-[#F9FAFB] hover:bg-[rgba(255,255,255,0.05)] hover:border-white/30 rounded-xl transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Flow Section */}
      <ProcessFlow />

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Features Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">
              三大核心模块
            </h2>
            <p className="text-[#9CA3AF] max-w-xl mx-auto">
              为数码发烧友打造的一站式手机资讯平台
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href={feature.href} className="block group">
                  <div 
                    className="relative h-full rounded-2xl p-8 transition-all duration-500 hover:bg-white/[0.08] hover:border-[#00D9FF]/20 group-hover:shadow-[0_0_40px_rgba(0,217,255,0.1)]"
                    style={{
                      background: "rgba(17, 24, 39, 0.6)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="size-7 text-[#F9FAFB]" />
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-6 right-6">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-data text-[#00D9FF] border border-[#00D9FF]/20"
                        style={{ background: "rgba(255, 255, 255, 0.05)" }}
                      >
                        {feature.stats}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#F9FAFB] mb-3 group-hover:text-[#00D9FF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Link */}
                    <div className="flex items-center text-sm text-[#00D9FF] font-medium">
                      了解更多
                      <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Phones Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-2">
                热门机型
              </h2>
              <p className="text-[#9CA3AF]">实时监控全网价格动态</p>
            </div>
            <Button
              render={
                <Link href="/phones" className="inline-flex items-center">
                  查看全部
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              }
              variant="ghost"
              className="text-[#00D9FF] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 hidden sm:flex"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotPhones.map((phone, index) => (
              <motion.div
                key={phone.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href="/phones" className="block group">
                  <div 
                    className="rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-[#00D9FF]/20 group-hover:shadow-[0_0_30px_rgba(0,217,255,0.1)]"
                    style={{
                      background: "rgba(17, 24, 39, 0.6)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {/* Brand & Trend */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#9CA3AF] font-data">
                        {phone.brand}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-data ${
                          phone.trend.startsWith("-")
                            ? "text-[#34D399] bg-[#34D399]/10"
                            : phone.trend === "新品"
                            ? "text-[#00D9FF] bg-[#00D9FF]/10"
                            : "text-[#F59E0B] bg-[#F59E0B]/10"
                        }`}
                      >
                        {phone.trend}
                      </span>
                    </div>

                    {/* Phone Name */}
                    <h3 className="text-lg font-semibold text-[#F9FAFB] mb-2 group-hover:text-[#00D9FF] transition-colors">
                      {phone.name}
                    </h3>

                    {/* Price */}
                    <div className="font-data text-2xl font-bold text-[#34D399]">
                      {phone.price}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{ background: "linear-gradient(135deg, #00D9FF 0%, #A855F7 100%)" }}
            />
            <div className="absolute inset-0 bg-[#111827]/80" />
            
            {/* Content */}
            <div className="relative py-16 md:py-24 px-8 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-[#F9FAFB] mb-6">
                准备好探索了吗？
              </h2>
              <p className="text-lg text-[#9CA3AF] max-w-xl mx-auto mb-10">
                加入数万名数码发烧友的行列，发现最适合你的设备
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  render={<Link href="/phones">浏览手机库</Link>}
                  className="h-12 px-8 font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.4)]"
                  style={{
                    background: "linear-gradient(135deg, #00D9FF 0%, #A855F7 100%)",
                    color: "#0B0F19",
                  }}
                />
                <Button
                  render={<Link href="/community">加入社区</Link>}
                  variant="outline"
                  className="h-12 px-8 bg-transparent border-white/20 text-[#F9FAFB] hover:bg-white/10 hover:border-[#00D9FF]/50 rounded-xl transition-all duration-300"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
}
