"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  ShoppingCart,
  Users,
  Menu,
  User,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const iconMap = {
  Home,
  Smartphone,
  Trophy,
  ShoppingCart,
  Users,
} as const;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "left-0 right-0 z-50 transition-all duration-300 ease",
        scrolled
          ? "fixed top-0 bg-[rgba(11,15,25,0.8)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.05)]"
          : "absolute top-0 bg-transparent border-b border-transparent pt-6"
      )}
    >
      <div className="max-w-[1280px] mx-auto flex h-16 items-center gap-4 px-6">
        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5 transition-colors duration-200"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 bg-[#111827]/95 backdrop-blur-[20px] border-r border-white/10"
          >
            <SheetTitle className="text-xl font-bold text-[#F9FAFB] flex items-center gap-2">
              <span className="text-[#00D9FF]">◆</span>
              极物
            </SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200",
                      isActive
                        ? "text-[#00D9FF] bg-[#00D9FF]/10"
                        : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5"
                    )}
                  >
                    {Icon && <Icon className="size-5" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo - 极简纯白风格 */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-[#F9FAFB]"
        >
          <span className="text-[#00D9FF]">◆</span>
          <span className="hidden sm:inline tracking-wide">极物</span>
        </Link>

        {/* Desktop Navigation - 底部高亮下划线 */}
        <nav className="hidden md:flex items-center gap-8 ml-12">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-[#F9FAFB]"
                    : "text-[#9CA3AF] hover:text-[#F9FAFB]"
                )}
              >
                {item.label}
                {/* 当前页底部 2px 高亮下划线 */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-[2px] bg-[#00D9FF] transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* User Actions - 极简线条图标 */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            render={<Link href="/profile" />}
            className="text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5 rounded-xl transition-colors duration-200"
          >
            <User className="size-5 stroke-[1.5]" />
          </Button>
        </div>
      </div>
    </header>
  );
}
