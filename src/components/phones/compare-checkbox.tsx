"use client";

import { useState } from "react";
import { useCompare } from "./compare-context";
import { CompareToast } from "./compare-toast";
import type { PhoneOutlineType } from "@/types/phone-library";

interface CompareCheckboxProps {
  phoneId: string;
  brand: string;
  model: string;
  price?: number;
  outlineType?: PhoneOutlineType;
  specs?: {
    chip?: string;
    screen?: string;
    battery?: string;
  };
}

export function CompareCheckbox({ phoneId, brand, model, price, outlineType, specs }: CompareCheckboxProps) {
  const { isInCompare, addToCompare, removeFromCompare, isFull } = useCompare();
  const checked = isInCompare(phoneId);
  const [showToast, setShowToast] = useState(false);

  // 如果对比栏已满且当前未选中，则禁用
  const disabled = isFull && !checked;

  const handleClick = () => {
    if (disabled) {
      setShowToast(true);
      return;
    }
    if (checked) {
      removeFromCompare(phoneId);
    } else {
      const success = addToCompare({ id: phoneId, brand, model, price, outlineType, specs });
      if (!success) {
        setShowToast(true);
      }
    }
  };

  return (
    <>
      <div 
        className="compare-checkbox-wrapper flex items-center"
        style={{
          opacity: disabled ? 0.3 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <span className="compare-hint">
          {disabled ? "对比已满" : checked ? "移除" : "加入对比"}
        </span>
        <button
          onClick={handleClick}
          className="compare-checkbox focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={checked ? "移除" : "加入对比"}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {checked && (
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="check-icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <CompareToast
        message="最多只能对比4台手机，请先移除已选机型"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
