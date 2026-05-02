"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  Trophy,
  ShoppingCart,
  Users,
  BarChart3,
  MessageSquare,
  TrendingUp,
  User,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  Home,
  Smartphone,
  Trophy,
  ShoppingCart,
  Users,
} as const;

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sidebar-logo-gradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--brand-primary)" />
          <stop offset="100%" stopColor="var(--purple)" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="3"
        transform="rotate(45 10 10)"
        fill="url(#sidebar-logo-gradient)"
      />
      <rect
        x="6"
        y="6"
        width="8"
        height="8"
        rx="1.5"
        transform="rotate(45 10 10)"
        fill="rgba(0, 0, 0, 0.3)"
      />
    </svg>
  );
}

// 页面内 Tab 导航项（仅在详情页显示）
const PAGE_TABS = [
  { id: "overview", label: "概览", icon: BarChart3 },
  { id: "specs", label: "参数", icon: Smartphone },
  { id: "reviews", label: "评价", icon: MessageSquare },
  { id: "price", label: "价格", icon: TrendingUp },
];

interface SidebarProps {
  showPageTabs?: boolean;
}

export function Sidebar({ showPageTabs = false }: SidebarProps) {
  const pathname = usePathname();
  const isPhoneDetailPage = pathname.startsWith("/phones/");

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[72px] lg:w-[210px] bg-background/95 backdrop-blur-xl border-r border-white/[0.06] z-40 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 lg:px-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group">
          <LogoIcon className="size-6 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
          <span className="text-lg font-bold text-primary-level tracking-wider transition-colors duration-200 group-hover:text-brand hidden lg:block">
            极物
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 lg:px-3 flex flex-col gap-1 overflow-y-auto">
        {/* Global Nav Items */}
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 lg:px-4 py-3 text-sm font-medium transition-micro",
                isActive
                  ? "text-brand bg-brand/10"
                  : "text-tertiary-level hover:text-primary-level hover:bg-white/5"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "size-[20px] flex-shrink-0 transition-colors",
                    isActive ? "text-brand" : ""
                  )}
                />
              )}
              <span className="hidden lg:block">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand hidden lg:block" />
              )}
            </Link>
          );
        })}

        {/* Divider */}
        {(isPhoneDetailPage || showPageTabs) && (
          <div className="my-3 border-t border-white/[0.06]" />
        )}

        {/* Page Tabs (only for phone detail page) */}
        {(isPhoneDetailPage || showPageTabs) && (
          <>
            <div className="px-3 lg:px-4 py-2">
              <span className="text-xs text-disabled-level uppercase tracking-wider hidden lg:block">
                页面导航
              </span>
              <span className="text-xs text-disabled-level uppercase tracking-wider lg:hidden text-center block">
                导航
              </span>
            </div>
            {PAGE_TABS.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 lg:px-4 py-2.5 text-sm font-medium transition-micro",
                  "text-tertiary-level hover:text-primary-level hover:bg-white/5"
                )}
              >
                <tab.icon className="size-[18px] flex-shrink-0" />
                <span className="hidden lg:block">{tab.label}</span>
              </a>
            ))}
          </>
        )}
      </nav>

      {/* 个人中心 */}
      <div className="p-3 border-t border-white/[0.06]">
        <Link href="/profile">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-tertiary-level hover:text-primary-level hover:bg-white/5 transition-micro cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <span className="hidden lg:block">个人中心</span>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/[0.06]">
        <p className="text-xs text-disabled-level hidden lg:block">
          查参数 · 看评价 · 比价格
        </p>
      </div>
    </aside>
  );
}
