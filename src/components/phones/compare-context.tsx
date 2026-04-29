"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { PhoneCompareItem, PhoneOutlineType } from "@/types/phone-library";

// 向后兼容的类型
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
  };
  imageUrl?: string;
}

interface CompareContextType {
  comparedPhones: ComparePhone[];
  addToCompare: (phone: ComparePhone) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  isFull: boolean;
  maxCompare: number;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [comparedPhones, setComparedPhones] = useState<ComparePhone[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addToCompare = useCallback((phone: ComparePhone): boolean => {
    let added = false;
    setComparedPhones((prev) => {
      // 如果已存在，不添加
      if (prev.some((p) => p.id === phone.id)) {
        return prev;
      }
      // 如果已满，不添加
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      added = true;
      return [...prev, phone];
    });
    return added;
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setComparedPhones((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setComparedPhones([]);
  }, []);

  const isInCompare = useCallback(
    (id: string) => comparedPhones.some((p) => p.id === id),
    [comparedPhones]
  );

  const isFull = comparedPhones.length >= MAX_COMPARE;

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        comparedPhones,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isFull,
        maxCompare: MAX_COMPARE,
        isPanelOpen,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
