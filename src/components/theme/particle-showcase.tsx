"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ParticleBackground } from "./particle-background";
import { cn } from "@/lib/utils";

// ============================================================================
// 模块二演示：Canvas 粒子波纹背景
// ============================================================================

const DEMO_COLORS = [
  { name: "钛蓝", primary: "#A8C8EC", highlight: "#00D4AA" },
  { name: "钛灰", primary: "#C5C0BC", highlight: "#FF6B35" },
  { name: "钛黑", primary: "#1A1A1A", highlight: "#A855F7" },
  { name: "钛雾金", primary: "#E8D5B7", highlight: "#FFD700" },
  { name: "科技青", primary: "#00D9FF", highlight: "#00FFD1" },
  { name: "热情红", primary: "#CF0A2C", highlight: "#FF6B6B" },
];

export function ParticleShowcase() {
  const [selectedColor, setSelectedColor] = useState(DEMO_COLORS[0]);
  const [showControls, setShowControls] = useState(false);
  const [particleCount, setParticleCount] = useState(400);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  return (
    <div className="min-h-screen bg-[#080c14] relative overflow-hidden">
      {/* 粒子背景层 */}
      <ParticleBackground
        primaryColor={selectedColor.primary}
        highlightColor={selectedColor.highlight}
        particleCount={particleCount}
        reducedMotion={reducedMotion}
        glowPosition={{ x: glowX / 100, y: glowY / 100 }}
      />

      {/* 内容层 */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 标题 */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white">
              模块二：Canvas 粒子波纹背景
            </h1>
            <p className="text-gray-400">
              三层视觉架构：动态渐变网格 + 粒子星云 + 光晕脉冲
            </p>
            <p className="text-sm text-gray-500">
              在背景区域移动鼠标，体验粒子排斥和环形波纹效果
            </p>
          </motion.div>

          {/* 颜色选择器 */}
          <motion.div
            className="flex justify-center gap-3 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {DEMO_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "group flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                  "border backdrop-blur-sm",
                  selectedColor.name === color.name
                    ? "bg-white/20 border-white/40 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: color.primary,
                    boxShadow: `0 0 10px ${color.highlight}`,
                  }}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </button>
            ))}
          </motion.div>

          {/* 控制面板开关 */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all text-sm"
            >
              {showControls ? "隐藏控制面板" : "显示控制面板"}
            </button>
          </motion.div>

          {/* 控制面板 */}
          {showControls && (
            <motion.div
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                粒子参数控制
              </h3>

              <div className="space-y-4">
                {/* 粒子数量 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">粒子数量</span>
                    <span className="text-cyan-400">{particleCount}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={600}
                    step={50}
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100 (低性能)</span>
                    <span>600 (高性能)</span>
                  </div>
                </div>

                {/* 光晕位置 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">光晕 X 位置</span>
                      <span className="text-cyan-400">{glowX}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={glowX}
                      onChange={(e) => setGlowX(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">光晕 Y 位置</span>
                      <span className="text-cyan-400">{glowY}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={glowY}
                      onChange={(e) => setGlowY(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                {/* 无障碍选项 */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">减少动态效果 (无障碍)</span>
                  <button
                    onClick={() => setReducedMotion(!reducedMotion)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      reducedMotion ? "bg-cyan-500" : "bg-white/20"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                        reducedMotion ? "left-7" : "left-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 三层架构说明 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LayerCard
              number={3}
              title="动态渐变网格"
              description="WebGL/Canvas 绘制缓慢流动的色彩网格，0.2px/frame 速度营造液态金属质感"
              color={selectedColor.highlight}
            />
            <LayerCard
              number={2}
              title="粒子星云"
              description="300-500 个微粒子，布朗运动 + 鼠标排斥，距离 < 100px 时自动连线"
              color={selectedColor.highlight}
            />
            <LayerCard
              number={1}
              title="光晕脉冲"
              description="手机模型后方大型柔光圆，呼吸动画 4s 周期，颜色随主题同步渐变"
              color={selectedColor.highlight}
            />
          </motion.div>

          {/* 技术参数 */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">技术参数</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <TechSpec label="渲染引擎" value="Canvas 2D API" />
              <TechSpec label="刷新率" value="60fps (RAF)" />
              <TechSpec label="Z-Index" value="-1 (固定定位)" />
              <TechSpec label="移动端" value="CSS 降级" />
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                视觉风格：不是"星空闪烁"的廉价感，而是"极光流动"的高级感。
                粒子像尘埃在光束中漂浮，波纹像水滴落入液态金属。
              </p>
            </div>
          </motion.div>

          {/* 中间内容占位区 */}
          <motion.div
            className="relative h-64 rounded-3xl overflow-hidden border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${selectedColor.primary}10 0%, transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-32 h-56 rounded-3xl shadow-2xl"
                style={{
                  background: selectedColor.primary,
                  boxShadow: `0 20px 60px ${selectedColor.highlight}40`,
                }}
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-sm text-gray-400">
                模拟手机模型位置 - 光晕将在此区域后方呼吸脉动
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 层级卡片组件
function LayerCard({
  number,
  title,
  description,
  color,
}: {
  number: number;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{
            background: `${color}20`,
            color: color,
            border: `1px solid ${color}40`,
          }}
        >
          {number}
        </div>
        <h4 className="text-white font-medium">{title}</h4>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

// 技术参数项
function TechSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-gray-500 text-xs mb-1">{label}</div>
      <div className="text-cyan-400 font-medium">{value}</div>
    </div>
  );
}
