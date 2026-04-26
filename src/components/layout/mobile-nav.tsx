"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smartphone, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap = {
  Home,
  Smartphone,
  ShoppingCart,
  Users,
} as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 glass-strong md:hidden">
      <div className="flex items-center justify-around h-16 max-w-[1280px] mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-xl",
                isActive
                  ? "text-[#00D9FF] bg-[#00D9FF]/10"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB]"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "size-5 transition-colors",
                    isActive ? "text-[#00D9FF]" : ""
                  )}
                />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
