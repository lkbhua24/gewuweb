"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { PhoneRanking, RankingType } from "@/types/ranking";
import { RANKING_CATEGORIES } from "@/types/ranking";

// ============================================================================
// 雷达图组件 - 展示多维度评分
// 当前榜单维度高亮显示（主题色）
// ============================================================================

interface ScoreRadarChartProps {
  scores: PhoneRanking["scores"];
  currentCategory: RankingType;
  themeColor: string;
}

const SCORE_DIMENSIONS = [
  { key: "overall", label: "综合", angle: -90 },
  { key: "performance", label: "性能", angle: -54 },
  { key: "screen", label: "屏幕", angle: -18 },
  { key: "battery", label: "续航", angle: 18 },
  { key: "camera", label: "影像", angle: 54 },
  { key: "buildQuality", label: "质感", angle: 90 },
  { key: "appearance", label: "颜值", angle: 126 },
  { key: "valueForMoney", label: "性价比", angle: 162 },
  { key: "userExperience", label: "体验", angle: 198 },
  { key: "heat", label: "热度", angle: 234 },
] as const;

export function ScoreRadarChart({ scores, currentCategory, themeColor }: ScoreRadarChartProps) {
  const size = 280;
  const center = size / 2;
  const radius = 100;
  const maxScore = 10;

  // 获取当前维度的 scoreKey
  const currentScoreKey = RANKING_CATEGORIES.find((c) => c.id === currentCategory)?.scoreKey || "overall";

  // 计算多边形顶点
  const polygonPoints = useMemo(() => {
    return SCORE_DIMENSIONS.map((dim) => {
      const score = scores[dim.key as keyof typeof scores] || 0;
      const normalizedScore = score / maxScore;
      const angleRad = (dim.angle * Math.PI) / 180;
      const x = center + radius * normalizedScore * Math.cos(angleRad);
      const y = center + radius * normalizedScore * Math.sin(angleRad);
      return `${x},${y}`;
    }).join(" ");
  }, [scores, center, radius]);

  // 计算当前维度高亮点的坐标
  const highlightPoint = useMemo(() => {
    const dim = SCORE_DIMENSIONS.find((d) => d.key === currentScoreKey);
    if (!dim) return null;
    const score = scores[currentScoreKey] || 0;
    const normalizedScore = score / maxScore;
    const angleRad = (dim.angle * Math.PI) / 180;
    return {
      x: center + radius * normalizedScore * Math.cos(angleRad),
      y: center + radius * normalizedScore * Math.sin(angleRad),
      score,
      label: dim.label,
    };
  }, [scores, currentScoreKey, center, radius]);

  // 网格圆环
  const gridRings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* 背景网格圆环 */}
        {gridRings.map((ratio, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * ratio}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
            strokeDasharray={ratio === 1 ? "none" : "2 4"}
          />
        ))}

        {/* 轴线 */}
        {SCORE_DIMENSIONS.map((dim) => {
          const angleRad = (dim.angle * Math.PI) / 180;
          const x2 = center + radius * Math.cos(angleRad);
          const y2 = center + radius * Math.sin(angleRad);
          const isCurrent = dim.key === currentScoreKey;

          return (
            <line
              key={dim.key}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={isCurrent ? themeColor : "rgba(255,255,255,0.08)"}
              strokeWidth={isCurrent ? 1.5 : 0.5}
            />
          );
        })}

        {/* 数据多边形 */}
        <motion.polygon
          points={polygonPoints}
          fill={`${themeColor}20`}
          stroke={themeColor}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* 数据点 */}
        {SCORE_DIMENSIONS.map((dim) => {
          const score = scores[dim.key as keyof typeof scores] || 0;
          const normalizedScore = score / maxScore;
          const angleRad = (dim.angle * Math.PI) / 180;
          const x = center + radius * normalizedScore * Math.cos(angleRad);
          const y = center + radius * normalizedScore * Math.sin(angleRad);
          const isCurrent = dim.key === currentScoreKey;

          return (
            <g key={dim.key}>
              <circle
                cx={x}
                cy={y}
                r={isCurrent ? 5 : 3}
                fill={isCurrent ? themeColor : "#0f111a"}
                stroke={isCurrent ? themeColor : "rgba(255,255,255,0.3)"}
                strokeWidth={isCurrent ? 2 : 1}
              />
              {isCurrent && (
                <circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill="none"
                  stroke={themeColor}
                  strokeWidth={1}
                  opacity={0.4}
                >
                  <animate
                    attributeName="r"
                    values="8;12;8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* 维度标签 */}
        {SCORE_DIMENSIONS.map((dim) => {
          const angleRad = (dim.angle * Math.PI) / 180;
          const labelRadius = radius + 24;
          const x = center + labelRadius * Math.cos(angleRad);
          const y = center + labelRadius * Math.sin(angleRad);
          const isCurrent = dim.key === currentScoreKey;
          const score = scores[dim.key as keyof typeof scores] || 0;

          return (
            <text
              key={`label-${dim.key}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-ranking-cn"
              fill={isCurrent ? themeColor : "rgba(255,255,255,0.4)"}
              fontWeight={isCurrent ? 700 : 400}
            >
              {dim.label}
              <tspan
                x={x}
                dy={12}
                fill={isCurrent ? themeColor : "rgba(255,255,255,0.3)"}
                fontSize={9}
              >
                {score.toFixed(1)}
              </tspan>
            </text>
          );
        })}
      </svg>

      {/* 当前维度高亮信息 */}
      {highlightPoint && (
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs text-white/40 font-ranking-cn">
            当前维度 · {highlightPoint.label}
          </span>
          <div
            className="text-2xl font-ranking-num font-bold mt-1"
            style={{ color: themeColor }}
          >
            {highlightPoint.score.toFixed(1)}
          </div>
        </motion.div>
      )}
    </div>
  );
}
