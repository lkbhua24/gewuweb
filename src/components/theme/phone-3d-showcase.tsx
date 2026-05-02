"use client";

import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

// ============================================================================
// 模块三：左侧 3D 手机展示区（材质优化版）
// 颜色选择器：底部指示条 + 悬停背景
// 材质表现：钛金属边框 + 磨砂玻璃背板 + 摄像头模组
// ============================================================================

interface PhoneColor {
  id: string;
  name: string;
  color: string;
  highlight: string;
}

interface Phone3DShowcaseProps {
  brand?: string;
  model?: string;
  colors?: PhoneColor[];
  defaultColorId?: string;
  onColorChange?: (color: PhoneColor) => void;
}

const DEFAULT_COLORS: PhoneColor[] = [
  { id: "1", name: "钛灰", color: "#E8E4E0", highlight: "#C5C0BC" },
  { id: "2", name: "钛蓝", color: "#D6E4F0", highlight: "#A8C8EC" },
  { id: "3", name: "钛黑", color: "#2A2A2A", highlight: "#1A1A1A" },
  { id: "4", name: "钛雾金", color: "#F5E6D3", highlight: "#E8D5B7" },
];

export function Phone3DShowcase({
  brand = "Samsung",
  model = "Galaxy S25 Ultra",
  colors = DEFAULT_COLORS,
  defaultColorId,
  onColorChange,
}: Phone3DShowcaseProps) {
  const [selectedColor, setSelectedColor] = useState<PhoneColor>(
    colors.find((c) => c.id === defaultColorId) || colors[0]
  );

  const [rotationY, setRotationY] = useState(15);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // 颜色切换动画
  const handleColorChange = useCallback((color: PhoneColor) => {
    if (color.id === selectedColor.id || isFlipping) return;

    setIsFlipping(true);
    setRotationY(195);

    setTimeout(() => {
      setSelectedColor(color);
      onColorChange?.(color);

      setTimeout(() => {
        setRotationY(15);
        setTimeout(() => setIsFlipping(false), 300);
      }, 50);
    }, 300);
  }, [selectedColor.id, isFlipping, onColorChange]);

  // 鼠标悬停跟随
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || isFlipping) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    const maxTilt = 5;
    setMouseTilt({
      x: Math.max(-maxTilt, Math.min(maxTilt, percentY * maxTilt)),
      y: Math.max(-maxTilt, Math.min(maxTilt, percentX * maxTilt)),
    });
  }, [isFlipping]);

  const handleMouseEnter = () => !isFlipping && setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseTilt({ x: 0, y: 0 });
  };

  const getFinalRotation = () => {
    if (isFlipping) return { x: 0, y: rotationY };
    if (isHovered) return { x: mouseTilt.x, y: 15 + mouseTilt.y };
    return { x: 0, y: 15 };
  };

  const finalRotation = getFinalRotation();

  return (
    <div className="relative h-full flex flex-col">
      {/* 3D 手机模型展示区 */}
      <div
        ref={containerRef}
        className={cn(
          "relative flex-1 flex items-center justify-center",
          "min-h-[300px] sm:min-h-[400px] lg:min-h-[60%]",
          isFlipping ? "cursor-wait" : "cursor-pointer"
        )}
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateX: finalRotation.x,
            rotateY: finalRotation.y,
          }}
          transition={{
            duration: isFlipping ? 0.6 : 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <PhoneFront color={selectedColor.color} highlight={selectedColor.highlight} />
          <PhoneBack
            color={selectedColor.color}
            highlight={selectedColor.highlight}
            isVisible={rotationY > 90 && rotationY < 270}
          />
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-40 transition-all duration-300"
            style={{
              background: `radial-gradient(circle, ${selectedColor.highlight} 0%, transparent 70%)`,
              transform: `translateZ(-150px) translateX(${isHovered ? mouseTilt.y * -10 : 0}px) translateY(${isHovered ? mouseTilt.x * 10 : 0}px)`,
            }}
          />
        </motion.div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
          {isFlipping ? "切换颜色中..." : isHovered ? "凝视交互中" : "悬停查看凝视效果，点击颜色切换"}
        </div>
      </div>

      {/* 颜色选择器 - 响应式设计 */}
      <div className="py-4 sm:py-6">
        <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto px-4 pb-2">
          {colors.map((color) => {
            const isSelected = selectedColor.id === color.id;
            return (
              <button
                key={color.id}
                onClick={() => handleColorChange(color)}
                disabled={isFlipping}
                className={cn(
                  "group relative flex flex-col items-center gap-1.5 sm:gap-2",
                  "px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300",
                  "border flex-shrink-0",
                  isSelected
                    ? "border-white/30"
                    : "border-white/10 hover:border-white/20",
                  isFlipping && "opacity-50 cursor-not-allowed"
                )}
                style={{
                  background: isSelected
                    ? `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, ${color.color}15 100%)`
                    : `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, ${color.color}08 100%)`,
                }}
              >
                {/* 颜色指示器 */}
                <div
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-300",
                    isSelected ? "border-white scale-110" : "border-white/30 group-hover:border-white/50"
                  )}
                  style={{
                    backgroundColor: color.color,
                    boxShadow: isSelected
                      ? `0 0 15px ${color.highlight}, 0 0 30px ${color.highlight}50`
                      : `0 0 10px ${color.highlight}30`,
                  }}
                />

                {/* 颜色名称 */}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap",
                    isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                  )}
                >
                  {color.name}
                </span>

                {/* 选中态：底部 2px 主题色指示条 */}
                <div
                  className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300",
                    isSelected ? "w-3/4 opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50"
                  )}
                  style={{ backgroundColor: color.highlight }}
                />

                {/* 悬停态：胶囊背景 10% 主题色 */}
                <div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  style={{ backgroundColor: `${color.color}10` }}
                />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ============================================================================
// 手机正面组件 - 钛金属边框 + 磨砂玻璃背板
// ============================================================================

const PhoneFront = memo(function PhoneFront({ color, highlight }: { color: string; highlight: string }) {
  return (
    <div
      className="relative w-[160px] h-[320px] sm:w-[180px] sm:h-[360px] lg:w-[200px] lg:h-[400px] rounded-[32px] sm:rounded-[36px] lg:rounded-[40px]"
      style={{
        backgroundColor: color,
        boxShadow: `
          0 0 0 3px rgba(255,255,255,0.15),
          0 25px 80px ${highlight}50,
          inset 0 0 60px rgba(255,255,255,0.1),
          inset 0 -10px 40px rgba(0,0,0,0.1)
        `,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      {/* 钛金属边框：CSS linear-gradient 模拟金属光泽 */}
      <div
        className="absolute inset-0 rounded-[32px] sm:rounded-[36px] lg:rounded-[40px] pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255,255,255,0.6) 0%, 
              rgba(255,255,255,0.2) 15%,
              rgba(255,255,255,0.05) 30%,
              transparent 45%,
              transparent 55%,
              rgba(0,0,0,0.05) 70%,
              rgba(0,0,0,0.15) 85%,
              rgba(0,0,0,0.25) 100%
            )
          `,
          border: "2px solid transparent",
          borderRadius: "40px",
        }}
      />

      {/* 磨砂玻璃背板效果 */}
      <div
        className="absolute inset-[2px] sm:inset-[3px] rounded-[30px] sm:rounded-[33px] lg:rounded-[37px] overflow-hidden backdrop-blur-sm"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%),
            ${color}
          `,
        }}
      >
        {/* 噪点纹理 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 屏幕 */}
      <div
        className="absolute inset-1.5 sm:inset-2 rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a14 0%, #050508 100%)",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)",
        }}
      >
        {/* 抽象渐变壁纸 */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, ${highlight}40 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 80%, ${color}30 0%, transparent 40%),
              radial-gradient(ellipse 50% 30% at 20% 60%, ${highlight}20 0%, transparent 50%)
            `,
          }}
        />

        {/* 动态波纹 */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${highlight}10 0%, transparent 60%)`,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />

        {/* 刘海 */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />

        {/* 屏幕反光 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
          }}
        />
      </div>

      {/* 侧面按键 - 钛金属质感 */}
      <div
        className="absolute right-[-3px] sm:right-[-4px] top-20 sm:top-24 lg:top-28 w-[3px] sm:w-[4px] h-12 sm:h-14 lg:h-16 rounded-r"
        style={{
          background: `linear-gradient(180deg, ${highlight} 0%, ${color} 50%, ${highlight} 100%)`,
          boxShadow: "-2px 0 4px rgba(0,0,0,0.2)",
        }}
      />
      <div
        className="absolute right-[-3px] sm:right-[-4px] top-36 sm:top-40 lg:top-48 w-[3px] sm:w-[4px] h-8 sm:h-9 lg:h-10 rounded-r"
        style={{
          background: `linear-gradient(180deg, ${highlight} 0%, ${color} 50%, ${highlight} 100%)`,
          boxShadow: "-2px 0 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
});

// ============================================================================
// 手机背面组件 - 摄像头模组微凸阴影 + 镜头反光
// ============================================================================

const PhoneBack = memo(function PhoneBack({
  color,
  highlight,
  isVisible,
}: {
  color: string;
  highlight: string;
  isVisible: boolean;
}) {
  return (
    <div
      className="absolute inset-0 w-[160px] h-[320px] sm:w-[180px] sm:h-[360px] lg:w-[200px] lg:h-[400px] rounded-[32px] sm:rounded-[36px] lg:rounded-[40px]"
      style={{
        backgroundColor: color,
        boxShadow: `
          0 0 0 3px rgba(255,255,255,0.15),
          0 25px 80px ${highlight}50,
          inset 0 0 60px rgba(255,255,255,0.1)
        `,
        transform: "rotateY(180deg)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    >
      {/* 钛金属边框 */}
      <div
        className="absolute inset-0 rounded-[32px] sm:rounded-[36px] lg:rounded-[40px] pointer-events-none"
        style={{
          background: `
            linear-gradient(225deg, 
              rgba(255,255,255,0.6) 0%, 
              rgba(255,255,255,0.2) 15%,
              rgba(255,255,255,0.05) 30%,
              transparent 45%,
              transparent 55%,
              rgba(0,0,0,0.05) 70%,
              rgba(0,0,0,0.15) 85%,
              rgba(0,0,0,0.25) 100%
            )
          `,
          border: "2px solid transparent",
          borderRadius: "40px",
        }}
      />

      {/* 磨砂玻璃背板 */}
      <div
        className="absolute inset-[2px] sm:inset-[3px] rounded-[30px] sm:rounded-[33px] lg:rounded-[37px] backdrop-blur-sm"
        style={{
          background: `
            linear-gradient(225deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%),
            ${color}
          `,
        }}
      >
        {/* 噪点纹理 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 摄像头模组 - 微凸阴影 */}
      <div
        className="absolute top-4 sm:top-6 left-4 sm:left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2"
        style={{
          background: `linear-gradient(135deg, ${highlight}30 0%, ${color} 100%)`,
          boxShadow: `
            0 8px 30px rgba(0,0,0,0.4),
            0 4px 15px rgba(0,0,0,0.2),
            inset 0 1px 2px rgba(255,255,255,0.3),
            inset 0 -1px 2px rgba(0,0,0,0.1)
          `,
          transform: "translateZ(4px)",
        }}
      >
        {/* 四摄排列 + 镜头反光点 */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 h-full">
          <LensWithReflection />
          <LensWithReflection />
          <LensWithReflection />
          <div
            className="rounded-full bg-black/80 flex items-center justify-center relative overflow-hidden"
            style={{
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.1)",
            }}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400/50" />
            {/* 小镜头反光 */}
            <div
              className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* 品牌 Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="text-xl sm:text-2xl font-bold opacity-30"
          style={{
            background: `linear-gradient(135deg, ${highlight} 0%, ${color} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          S
        </div>
      </div>

      {/* 底部扬声器孔 */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-black/40" />
        ))}
      </div>
    </div>
  );
});

// 镜头组件（带反光点）
const LensWithReflection = memo(function LensWithReflection() {
  return (
    <div
      className="rounded-full bg-black/80 relative overflow-hidden"
      style={{
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.1)",
      }}
    >
      {/* 镜头反光点 */}
      <div
        className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2 sm:w-3 h-2 sm:h-3 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",
        }}
      />
      {/* 镜头内部渐变 */}
      <div
        className="absolute inset-1 sm:inset-2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(20,20,40,0.9) 0%, rgba(0,0,0,0.95) 100%)",
        }}
      />
    </div>
  );
});

// ============================================================================
// 演示组件
// ============================================================================

export function Phone3DShowcaseDemo() {
  const [currentColor, setCurrentColor] = useState<PhoneColor>(DEFAULT_COLORS[0]);

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">模块三：3D 手机展示区</h1>
          <p className="text-gray-400">材质优化：钛金属边框 + 磨砂玻璃背板 + 摄像头模组细节</p>
        </motion.div>

        {/* 材质说明 */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <MaterialCard
            title="钛金属边框"
            desc="CSS linear-gradient 模拟金属光泽"
          />
          <MaterialCard
            title="磨砂玻璃背板"
            desc="backdrop-filter + 噪点纹理"
          />
          <MaterialCard
            title="摄像头模组"
            desc="微凸阴影 + 镜头反光点"
          />
        </motion.div>

        {/* 主展示区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[800px]">
          {/* 左侧：3D 展示区 */}
          <motion.div
            className="relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Phone3DShowcase
              colors={DEFAULT_COLORS}
              onColorChange={setCurrentColor}
            />
          </motion.div>

          {/* 右侧：信息面板 */}
          <motion.div
            className="bg-white/5 rounded-3xl border border-white/10 p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">当前选中</h2>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <div
                    className="w-20 h-20 rounded-2xl border-2 border-white/20"
                    style={{
                      backgroundColor: currentColor.color,
                      boxShadow: `0 0 30px ${currentColor.highlight}60`,
                    }}
                  />
                  <div>
                    <div className="text-xl font-medium text-white">{currentColor.name}</div>
                    <code className="text-sm text-cyan-400">{currentColor.color}</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">颜色选择器设计</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    横向胶囊按钮排列
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    选中态：底部 2px 主题色指示条
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    悬停态：胶囊背景变为 10% 主题色
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">材质表现</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    钛金属边框：多层渐变模拟金属光泽
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    磨砂玻璃：backdrop-filter blur + SVG 噪点
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    摄像头：微凸阴影 + 镜头反光点细节
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MaterialCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}
