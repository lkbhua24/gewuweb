"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Smartphone, BarChart3, TrendingUp, ShoppingCart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 移动端信息区手风琴组件
// ============================================================================

interface AccordionItem {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

interface MobileInfoAccordionProps {
  items: AccordionItem[];
  themeColor: string;
}

export function MobileInfoAccordion({ items, themeColor }: MobileInfoAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(["overview"]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openItems.includes(item.id);
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "rounded-xl border overflow-hidden",
              "transition-all duration-300"
            )}
            style={{
              backgroundColor: `${themeColor}08`,
              borderColor: isOpen ? themeColor : `${themeColor}20`,
              boxShadow: isOpen ? `0 0 20px ${themeColor}15` : "none",
            }}
          >
            {/* 手风琴头部 */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isOpen ? `${themeColor}20` : `${themeColor}10`,
                    color: themeColor,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-white">{item.title}</span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className="w-5 h-5"
                  style={{ color: isOpen ? themeColor : "#9CA3AF" }}
                />
              </motion.div>
            </button>

            {/* 手风琴内容 */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function MobileInfoAccordionDemo() {
  const themeColor = "#00D9FF";

  const items: AccordionItem[] = [
    {
      id: "overview",
      title: "产品概览",
      icon: Smartphone,
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>Galaxy S25 Ultra 采用钛金属设计，搭载 2 亿像素主摄</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded bg-white/10 text-xs">骁龙8至尊版</span>
            <span className="px-2 py-1 rounded bg-white/10 text-xs">2亿像素</span>
          </div>
        </div>
      ),
    },
    {
      id: "specs",
      title: "核心参数",
      icon: BarChart3,
      content: (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-gray-400 text-xs">屏幕</div>
            <div className="text-white">6.9&quot;</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-gray-400 text-xs">处理器</div>
            <div className="text-white">骁龙8至尊版</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-gray-400 text-xs">摄像头</div>
            <div className="text-white">2亿像素</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-gray-400 text-xs">电池</div>
            <div className="text-white">5000mAh</div>
          </div>
        </div>
      ),
    },
    {
      id: "price",
      title: "价格走势",
      icon: TrendingUp,
      content: (
        <div className="text-sm text-gray-300">
          <p>当前价格：¥9,699</p>
          <p className="text-green-400 mt-1">较上月下降 3.2%</p>
        </div>
      ),
    },
    {
      id: "purchase",
      title: "购买渠道",
      icon: ShoppingCart,
      content: (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="text-white text-sm">京东自营</span>
            <span className="text-green-400 font-medium">¥9,699</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <span className="text-white text-sm">天猫官旗</span>
            <span className="text-green-400 font-medium">¥9,699</span>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      title: "用户评价",
      icon: MessageSquare,
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-white">8.9</div>
            <div className="text-xs text-gray-400">综合评分</div>
          </div>
          <p className="text-sm text-gray-300">
            &quot;拍照效果惊艳，续航表现优秀，钛金属手感出色&quot;
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">移动端信息区</h2>
        <MobileInfoAccordion items={items} themeColor={themeColor} />
      </div>
    </div>
  );
}
