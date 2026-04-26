"use client";

import { cn } from "@/lib/utils";
import type { ScreenType } from "@/types/ranking";

interface PhoneSilhouetteProps {
  screenType?: ScreenType;
  themeColor?: string;
  className?: string;
}

export function PhoneSilhouette({
  screenType = "flat",
  themeColor = "#00D9FF",
  className,
}: PhoneSilhouetteProps) {
  const baseStroke = "rgba(255,255,255,0.5)";
  const highlightStroke = themeColor;

  switch (screenType) {
    case "flat":
      return (
        <svg
          width="32"
          height="56"
          viewBox="0 0 32 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("phone-silhouette", className)}
        >
          <rect
            x="7"
            y="2"
            width="18"
            height="52"
            rx="2"
            ry="2"
            stroke={baseStroke}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M7 38 L7 52 Q7 54 9 54 L23 54 Q25 54 25 52 L25 38"
            stroke={highlightStroke}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="18"
            x2="6"
            y2="24"
            stroke={baseStroke}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
          <line
            x1="26"
            y1="16"
            x2="26"
            y2="22"
            stroke={baseStroke}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      );

    case "curved":
      return (
        <svg
          width="32"
          height="56"
          viewBox="0 0 32 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("phone-silhouette", className)}
        >
          <path
            d="M9 2 Q7 2 6.5 4 L6 8 L6 48 L6.5 52 Q7 54 9 54 L23 54 Q25 54 25.5 52 L26 48 L26 8 L25.5 4 Q25 2 23 2 Z"
            stroke={baseStroke}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M6 38 L6 48 L6.5 52 Q7 54 9 54 L23 54 Q25 54 25.5 52 L26 48 L26 38"
            stroke={highlightStroke}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
          <path
            d="M6 8 L6 48"
            stroke={highlightStroke}
            strokeWidth="1"
            fill="none"
            opacity="0.25"
            strokeDasharray="2 3"
          />
          <path
            d="M26 8 L26 48"
            stroke={highlightStroke}
            strokeWidth="1"
            fill="none"
            opacity="0.25"
            strokeDasharray="2 3"
          />
          <line
            x1="5"
            y1="18"
            x2="5"
            y2="24"
            stroke={baseStroke}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      );

    case "waterfall":
      return (
        <svg
          width="32"
          height="56"
          viewBox="0 0 32 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("phone-silhouette", className)}
        >
          <path
            d="M11 2 Q7 2 5 6 L3 12 L3 44 L5 50 Q7 54 11 54 L21 54 Q25 54 27 50 L29 44 L29 12 L27 6 Q25 2 21 2 Z"
            stroke={baseStroke}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M3 38 L3 44 L5 50 Q7 54 11 54 L21 54 Q25 54 27 50 L29 44 L29 38"
            stroke={highlightStroke}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
          <path
            d="M3 12 L3 44"
            stroke={highlightStroke}
            strokeWidth="1.2"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M29 12 L29 44"
            stroke={highlightStroke}
            strokeWidth="1.2"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M5 6 L3 12"
            stroke={highlightStroke}
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />
          <path
            d="M27 6 L29 12"
            stroke={highlightStroke}
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />
        </svg>
      );

    case "foldable":
      return (
        <svg
          width="32"
          height="56"
          viewBox="0 0 32 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("phone-silhouette", className)}
        >
          <path
            d="M9 2 Q7 2 6.5 4 L6 8 L6 24"
            stroke={baseStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M23 2 Q25 2 25.5 4 L26 8 L26 24"
            stroke={baseStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M9 2 Q16 0.5 23 2"
            stroke={baseStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6 24 Q6 28 6 32 L6 48 L6.5 52 Q7 54 9 54 L23 54 Q25 54 25.5 52 L26 48 L26 32 Q26 28 26 24"
            stroke={baseStroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M6 38 L6 48 L6.5 52 Q7 54 9 54 L23 54 Q25 54 25.5 52 L26 48 L26 38"
            stroke={highlightStroke}
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
          <path
            d="M6 24 Q9 27 16 28 Q23 27 26 24"
            stroke={baseStroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M12 28 Q16 29.5 20 28"
            stroke={highlightStroke}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="5"
            y1="18"
            x2="5"
            y2="22"
            stroke={baseStroke}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
          <line
            x1="27"
            y1="18"
            x2="27"
            y2="22"
            stroke={baseStroke}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default PhoneSilhouette;
