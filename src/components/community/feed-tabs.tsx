"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp, Star, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "recommend", label: "推荐", icon: Flame, color: "var(--community-primary)" },
  { id: "hot", label: "热门", icon: TrendingUp, color: "var(--community-accent)" },
  { id: "following", label: "关注", icon: Star, color: "var(--community-highlight)" },
  { id: "latest", label: "最新", icon: MessageCircle, color: "#34d399" },
];

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-4 relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "text-white"
                : "text-white/60 hover:text-white/80"
            )}
          >
            {/* 共享背景元素 - layoutId 实现过渡动画 */}
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 rounded-xl"
                style={{
                  backgroundColor: `${tab.color}20`,
                  border: `1px solid ${tab.color}40`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" style={{ color: isActive ? tab.color : undefined }} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
