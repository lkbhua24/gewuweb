"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smartphone, ShoppingCart, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap = {
  Home,
  Smartphone,
  Trophy,
  ShoppingCart,
  Users,
} as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/90 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="flex items-center justify-around h-14 max-w-[var(--container-max-width)] mx-auto px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-micro min-w-[48px]",
                  isActive
                    ? "text-brand"
                    : "text-disabled-level hover:text-tertiary-level"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center size-7 rounded-lg transition-micro",
                    isActive && "bg-brand/10"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "size-[18px] transition-colors",
                        isActive ? "text-brand" : ""
                      )}
                    />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-tight",
                  isActive && "text-brand"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background/90" />
    </nav>
  );
}
