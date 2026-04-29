"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Smartphone } from "lucide-react";
import { PhoneSilhouetteSVG } from "./phone-silhouette-svg";
import { formatPrice } from "@/lib/phone-utils";
import type { PhoneOutlineType } from "@/types/phone-library";

interface ComparePhone {
  id: string;
  brand: string;
  model: string;
  price?: number;
  outlineType?: PhoneOutlineType;
  specs?: {
    chip?: string;
    screen?: string;
    battery?: string;
    [key: string]: string | undefined;
  };
}

interface ComparePanelProps {
  isOpen: boolean;
  phones: ComparePhone[];
  onClose: () => void;
}

// Toggle Switch 组件
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className="toggle-switch-track focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
        style={{
          width: "36px",
          height: "20px",
          borderRadius: "10px",
          background: checked ? "#00e5ff" : "#334155",
          position: "relative",
          transition: "background 200ms",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: "2px",
            left: checked ? "18px" : "2px",
            transition: "left 200ms",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "14px",
          color: "#cbd5e1",
          marginLeft: "8px",
        }}
      >
        {label}
      </span>
    </label>
  );
}

// 获取所有参数的 key
function getAllSpecKeys(phones: ComparePhone[]): string[] {
  const keys = new Set<string>();
  phones.forEach((phone) => {
    if (phone.specs) {
      Object.keys(phone.specs).forEach((key) => keys.add(key));
    }
  });
  return Array.from(keys);
}

// 检查所有值是否相同
function areAllValuesSame(phones: ComparePhone[], key: string): boolean {
  const values = phones.map((p) => p.specs?.[key]);
  const firstValue = values[0];
  return values.every((v) => v === firstValue);
}

// 提取数值（用于电池等）
function extractNumber(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// 检查是否是数值型参数
function isNumericSpec(key: string): boolean {
  const numericKeys = ["battery", "ram", "storage", "score", "price"];
  return numericKeys.some((k) => key.toLowerCase().includes(k));
}

// 找出最大值的索引
function findMaxValueIndex(phones: ComparePhone[], key: string): number {
  let maxValue = -Infinity;
  let maxIndex = -1;
  phones.forEach((phone, index) => {
    const value = extractNumber(phone.specs?.[key]);
    if (value > maxValue) {
      maxValue = value;
      maxIndex = index;
    }
  });
  return maxIndex;
}

export function ComparePanel({ isOpen, phones, onClose }: ComparePanelProps) {
  const [hideSame, setHideSame] = useState(false);
  const [highlightDiff, setHighlightDiff] = useState(false);

  // 表格拖拽滚动状态
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeft(tableContainerRef.current.scrollLeft);
    tableContainerRef.current.style.cursor = "grabbing";
    tableContainerRef.current.style.userSelect = "none";
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!tableContainerRef.current) return;
    setIsDragging(false);
    tableContainerRef.current.style.cursor = "grab";
    tableContainerRef.current.style.userSelect = "";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !tableContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tableContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  const specKeys = getAllSpecKeys(phones);
  const specLabels: Record<string, string> = {
    chip: "处理器",
    screen: "屏幕",
    battery: "电池",
    ram: "内存",
    storage: "存储",
    camera: "相机",
    price: "价格",
  };

  // 过滤参数行
  const visibleSpecKeys = hideSame
    ? specKeys.filter((key) => !areAllValuesSame(phones, key))
    : specKeys;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="compare-overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 300ms ease-out",
        }}
      />

      {/* 对比面板 */}
      <div
        className="compare-panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "90vw",
          maxWidth: "1200px",
          minWidth: "800px",
          background: "#080c14",
          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 面板头部 */}
        <div
          style={{
            height: "64px",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#f8fafc",
            }}
          >
            机型对比
          </h2>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <X className="size-6" />
          </button>
        </div>

        {/* 面板工具栏 */}
        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            gap: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <ToggleSwitch
            checked={hideSame}
            onChange={setHideSame}
            label="隐藏相同项"
          />
          <ToggleSwitch
            checked={highlightDiff}
            onChange={setHighlightDiff}
            label="高亮差异"
          />
        </div>

        {/* 面板内容 */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {phones.length < 2 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#64748b",
                textAlign: "center",
              }}
            >
              <Smartphone className="size-12 mb-4" style={{ color: "#334155" }} />
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                至少选择 2 台机型进行对比
              </p>
              <p style={{ fontSize: "14px" }}>
                在卡片上勾选即可添加
              </p>
            </div>
          ) : (
            <div
              ref={tableContainerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{
                overflowX: "auto",
                padding: "0 24px 40px",
                cursor: "grab",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: `${200 + phones.length * 200}px`,
                }}
              >
                <thead>
                  <tr>
                    {/* 首列 - 固定 */}
                    <th
                      style={{
                        position: "sticky",
                        left: 0,
                        background: "#080c14",
                        zIndex: 2,
                        padding: "24px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        width: "160px",
                        minWidth: "160px",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                        参数对比
                      </span>
                    </th>
                    {/* 手机列 */}
                    {phones.map((phone) => (
                      <th
                        key={phone.id}
                        style={{
                          padding: "24px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          minWidth: "200px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <PhoneSilhouetteSVG
                            type={phone.outlineType || "flat"}
                            style={{ height: "80px", width: "auto" }}
                          />
                          <h3
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#f1f5f9",
                              maxWidth: "160px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {phone.brand} {phone.model}
                          </h3>
                          {phone.price != null && (
                            <p
                              style={{
                                fontSize: "18px",
                                color: "#00e5ff",
                                fontFamily: "var(--font-mono)",
                                fontWeight: 700,
                              }}
                            >
                              {formatPrice(phone.price)}
                            </p>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleSpecKeys.map((key, rowIndex) => {
                    const maxIndex = isNumericSpec(key)
                      ? findMaxValueIndex(phones, key)
                      : -1;
                    const isEven = rowIndex % 2 === 0;

                    return (
                      <tr
                        key={key}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: isEven
                            ? "rgba(255,255,255,0.02)"
                            : "transparent",
                        }}
                      >
                        {/* 参数名 - 固定 */}
                        <td
                          style={{
                            position: "sticky",
                            left: 0,
                            background: "#080c14",
                            zIndex: 2,
                            padding: "16px 0",
                            fontSize: "14px",
                            color: "#94a3b8",
                            width: "160px",
                            minWidth: "160px",
                          }}
                        >
                          {specLabels[key] || key}
                        </td>
                        {/* 参数值 */}
                        {phones.map((phone, phoneIndex) => {
                          const isMax =
                            highlightDiff && phoneIndex === maxIndex;
                          const value = phone.specs?.[key] || "-";

                          return (
                            <td
                              key={phone.id}
                              style={{
                                padding: "16px 12px",
                                fontSize: "14px",
                                color: isMax ? "#00e5ff" : "#f1f5f9",
                                textAlign: "center",
                                minWidth: "200px",
                                fontFamily: "var(--font-mono)",
                                background: isMax
                                  ? "rgba(0,229,255,0.05)"
                                  : "transparent",
                              }}
                            >
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 移动端样式 */}
      <style jsx>{`
        @media (max-width: 768px) {
          .compare-panel {
            width: 100vw !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </>
  );
}
