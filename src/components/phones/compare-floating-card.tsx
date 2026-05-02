"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scale, X } from "lucide-react";

interface CompareFloatingCardProps {
  count: number;
  onClick: () => void;
  onClear: () => void;
}

export function CompareFloatingCard({ count, onClick, onClear }: CompareFloatingCardProps) {
  const isVisible = count > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 25,
          }}
        >
          <div
            onClick={onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: "rgba(8, 12, 20, 0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(0, 229, 255, 0.3)",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.1)",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.5)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 229, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.3)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.1)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                background: "rgba(0, 229, 255, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Scale className="size-5" style={{ color: "#00e5ff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#f1f5f9",
                }}
              >
                已选 {count} 台机型
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                点击对比
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                marginLeft: "8px",
                background: "transparent",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                color: "#64748b",
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
