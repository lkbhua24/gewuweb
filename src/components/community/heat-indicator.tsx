import { Flame } from "lucide-react";

export type HeatLevel = "boom" | "hot" | "discussing" | "cold";

interface HeatIndicatorProps {
  level: HeatLevel;
}

export function HeatIndicator({ level }: HeatIndicatorProps) {
  if (level === "cold") return null;

  if (level === "boom") {
    return (
      <span className="heat-boom">
        <Flame className="w-3 h-3 flame-icon" />
        爆
      </span>
    );
  }

  if (level === "hot") {
    return (
      <span className="heat-hot">
        <Flame className="w-3 h-3" />
        热
      </span>
    );
  }

  if (level === "discussing") {
    return (
      <span className="heat-discussing">
        <span className="dot" />
        讨论中
      </span>
    );
  }

  return null;
}

/**
 * 根据阅读量和互动数据计算热度等级
 * @param views 浏览数
 * @param likes 点赞数
 * @param comments 评论数
 * @returns HeatLevel
 */
export function calculateHeatLevel(
  views: number,
  likes: number,
  comments: number
): HeatLevel {
  // boom: 阅读>10w
  if (views > 100000) return "boom";

  // hot: 阅读>5w 或 点赞>500
  if (views > 50000 || likes > 500) return "hot";

  // discussing: 评论>100
  if (comments > 100) return "discussing";

  // cold: 普通
  return "cold";
}
