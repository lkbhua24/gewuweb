interface PhoneSilhouetteSVGProps {
  type?: "flat" | "curved" | "triple-camera" | "quad-camera" | "foldable";
  className?: string;
  style?: React.CSSProperties;
}

export function PhoneSilhouetteSVG({ type = "flat", className, style }: PhoneSilhouetteSVGProps) {
  const paths: Record<string, string> = {
    // 直屏手机轮廓
    flat: "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    
    // 曲面屏手机轮廓（两侧带弧度）
    curved: "M35 10 h90 a15 15 0 0 1 15 15 v130 a15 15 0 0 1 -15 15 h-90 a15 15 0 0 1 -15 -15 v-130 a15 15 0 0 1 15 -15 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    
    // 三摄布局
    "triple-camera": "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M125 30 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M100 35 a10 10 0 1 1 0 20 a10 10 0 0 1 0 -20 z M125 60 a10 10 0 1 1 0 20 a10 10 0 0 1 0 -20 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    
    // 四摄布局
    "quad-camera": "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M100 30 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M130 30 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M100 60 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M130 60 a12 12 0 1 1 0 24 a12 12 0 0 1 0 -24 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z",
    
    // 折叠屏
    foldable: "M30 10 h100 a10 10 0 0 1 10 10 v140 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 v-140 a10 10 0 0 1 10 -10 z M80 15 a3 3 0 1 1 0 6 a3 3 0 0 1 0 -6 z M80 75 v2",
  };

  return (
    <svg
      viewBox="0 0 160 180"
      className={className}
      style={style ?? { height: "160px", width: "auto" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <path
        d={paths[type] || paths.flat}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
