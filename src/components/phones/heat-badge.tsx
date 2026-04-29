import { cn } from "@/lib/utils";

type HeatLevel = "cold" | "discussing" | "hot" | "boom" | "editor";

interface HeatConfig {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  showPulse: boolean;
  glowColor: string;
}

export function mapHeatScoreToLevel(score: number, isEditorsPick?: boolean): HeatLevel {
  if (isEditorsPick) return "editor";
  if (score >= 96) return "editor";
  if (score >= 76) return "boom";
  if (score >= 51) return "hot";
  if (score >= 31) return "discussing";
  return "cold";
}

const heatConfigMap: Record<HeatLevel, HeatConfig> = {
  cold: {
    label: "冷门",
    color: "#6b7280",
    bgClass: "bg-heat-cold/12",
    textClass: "text-heat-cold",
    showPulse: false,
    glowColor: "rgba(107, 114, 128, 0.4)",
  },
  discussing: {
    label: "讨论中",
    color: "#06b6d4",
    bgClass: "bg-heat-discussing/12",
    textClass: "text-heat-discussing",
    showPulse: false,
    glowColor: "rgba(6, 182, 212, 0.4)",
  },
  hot: {
    label: "热门",
    color: "#f97316",
    bgClass: "bg-heat-hot/12",
    textClass: "text-heat-hot",
    showPulse: true,
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
  boom: {
    label: "爆款",
    color: "#ef4444",
    bgClass: "bg-heat-boom/12",
    textClass: "text-heat-boom",
    showPulse: true,
    glowColor: "rgba(239, 68, 68, 0.5)",
  },
  editor: {
    label: "编辑精选",
    color: "#a855f7",
    bgClass: "bg-heat-editor/12",
    textClass: "text-heat-editor",
    showPulse: true,
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
};

interface HeatBadgeProps {
  score?: number;
  level?: HeatLevel;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
  isEditorsPick?: boolean;
}

export function HeatBadge({
  score,
  level,
  showLabel = false,
  size = "sm",
  className,
  isEditorsPick = false
}: HeatBadgeProps) {
  const heatLevel: HeatLevel = score !== undefined
    ? mapHeatScoreToLevel(score, isEditorsPick)
    : level || "cold";

  const config = heatConfigMap[heatLevel];

  if (heatLevel === "cold") return null;

  return (
    <span
      className={cn(
        "heat-badge",
        config.bgClass,
        size === "sm" ? "heat-badge-sm" : "heat-badge-md",
        className
      )}
      style={{
        "--heat-glow-color": config.glowColor,
      } as React.CSSProperties}
    >
      <span className="heat-dot-wrapper">
        {config.showPulse && (
          <span className="heat-pulse-ring" />
        )}
        <span className={cn("heat-dot", config.textClass)} />
      </span>

      {score !== undefined && (
        <span className={cn("heat-score-text", config.textClass)}>
          {score}
        </span>
      )}

      {showLabel && (
        <span className={cn("heat-label", config.textClass)}>
          {config.label}
        </span>
      )}
    </span>
  );
}

interface HeatScoreProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function HeatScore({
  score,
  showLabel = true,
  size = "md",
  className
}: HeatScoreProps) {
  const level = mapHeatScoreToLevel(score);
  const config = heatConfigMap[level];

  return (
    <div className={cn("heat-score", className)}>
      <span className="heat-dot-wrapper">
        {config.showPulse && (
          <span className="heat-pulse-ring" />
        )}
        <span className={cn("heat-dot", config.textClass)} />
      </span>
      <span
        className={cn(
          "font-mono font-semibold",
          config.textClass,
          size === "sm" ? "text-sm" : "text-base"
        )}
      >
        {score}
      </span>
      {showLabel && (
        <span
          className={cn(
            "ml-1",
            config.textClass,
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}

export { heatConfigMap };
export type { HeatLevel, HeatConfig };
