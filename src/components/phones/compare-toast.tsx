"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface CompareToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function CompareToast({ message, isVisible, onClose }: CompareToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        animation: "toast-slide-up 300ms ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 20px",
          background: "rgba(239, 68, 68, 0.95)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        <AlertCircle className="size-4" style={{ color: "#fff" }} />
        <span
          style={{
            fontSize: "14px",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          {message}
        </span>
      </div>

      <style jsx>{`
        @keyframes toast-slide-up {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
