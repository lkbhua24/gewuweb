"use client";

interface EmptyPhoneStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyPhoneState({ hasFilters = false, onClearFilters }: EmptyPhoneStateProps) {
  return (
    <div 
      className="empty-phone-state"
      style={{ gridColumn: "1 / -1" }}
    >
      {/* 简笔画手机 SVG */}
      <svg
        viewBox="0 0 80 140"
        style={{ width: "80px", height: "auto" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 手机外框 */}
        <rect
          x="8"
          y="4"
          width="64"
          height="132"
          rx="8"
          stroke="#334155"
          strokeWidth="2"
        />
        {/* 屏幕 */}
        <rect
          x="14"
          y="14"
          width="52"
          height="100"
          rx="2"
          stroke="#334155"
          strokeWidth="1.5"
        />
        {/* 摄像头 */}
        <circle cx="28" cy="28" r="4" stroke="#334155" strokeWidth="1.5" />
        <circle cx="44" cy="28" r="4" stroke="#334155" strokeWidth="1.5" />
        <circle cx="52" cy="28" r="4" stroke="#334155" strokeWidth="1.5" />
        {/* Home 指示条 */}
        <rect
          x="28"
          y="122"
          width="24"
          height="4"
          rx="2"
          stroke="#334155"
          strokeWidth="1.5"
        />
      </svg>

      {/* 文案 */}
      <p className="empty-phone-state-text">
        这台机子太冷门了，连极物库都没收录。试试搜别的？
      </p>

      {/* 清除筛选按钮 */}
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="empty-phone-state-button"
        >
          清空筛选
        </button>
      )}
    </div>
  );
}
