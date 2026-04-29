"use client";

import { X } from "lucide-react";

interface ComparePhone {
  id: string;
  brand: string;
  model: string;
  price?: number;
  specs?: {
    chip?: string;
    screen?: string;
    battery?: string;
  };
  imageUrl?: string;
}

interface CompareBarProps {
  phones: ComparePhone[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export function CompareBar({ phones, onRemove, onClear, onCompare }: CompareBarProps) {
  const isActive = phones.length > 0;

  return (
    <div
      className="compare-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "rgba(8, 12, 20, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 30,
        transform: isActive ? "translateY(0)" : "translateY(100%)",
        transition: "transform 300ms ease-out",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max-width)",
          margin: "0 auto",
          padding: "0 16px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* 左侧：已选择数量 */}
        <div
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          已选 {phones.length} 台机型
        </div>

        {/* 中间：已选机型缩略 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          {phones.map((phone) => (
            <div
              key={phone.id}
              style={{
                width: "120px",
                height: "44px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "#f1f5f9",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "90px",
                }}
                title={`${phone.brand} ${phone.model}`}
              >
                {phone.model}
              </span>
              <button
                onClick={() => onRemove(phone.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "16px",
                  height: "16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748b",
                  transition: "color 200ms",
                  flexShrink: 0,
                  marginLeft: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>

        {/* 右侧：操作按钮 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClear}
            style={{
              fontSize: "14px",
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: "16px",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            清空
          </button>
          <button
            onClick={onCompare}
            disabled={phones.length < 2}
            style={{
              background: "#00e5ff",
              color: "#080c14",
              fontSize: "14px",
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: phones.length >= 2 ? "pointer" : "not-allowed",
              transition: "filter 200ms",
              opacity: phones.length >= 2 ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (phones.length >= 2) {
                e.currentTarget.style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            对比
          </button>
        </div>
      </div>
    </div>
  );
}
