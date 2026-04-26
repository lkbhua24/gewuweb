"use client";

import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 配色选择器组件
// ============================================================================

interface ColorSelectorProps {
  options?: { id: string; name: string; hex: string }[];
  selectedId?: string;
  onSelect: (colorId: string) => void;
}

export function ColorSelector({ options, selectedId, onSelect }: ColorSelectorProps) {
  if (!options || options.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 ml-2">
      <Palette className="size-3 text-white/30" />
      <div className="flex gap-1">
        {options.map((color) => (
          <button
            key={color.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(color.id);
            }}
            className={cn(
              "w-4 h-4 rounded-full border transition-all duration-200",
              selectedId === color.id
                ? "border-white/60 scale-110"
                : "border-white/20 hover:border-white/40"
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
