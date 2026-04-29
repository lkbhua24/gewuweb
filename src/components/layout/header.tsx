"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  ShoppingCart,
  Users,
  Menu,
  Trophy,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
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
        fill="url(#logo-gradient)"
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

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-200"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 h-16",
        "transition-all duration-300 ease-default",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.03)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[var(--container-max-width)] mx-auto h-full flex items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-tertiary-level hover:text-primary-level hover:bg-white/5 rounded-xl transition-micro"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] bg-background/95 backdrop-blur-xl border-r border-white/[0.06] p-0"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-white/[0.06]">
                  <LogoIcon className="size-5" />
                  <span className="text-lg font-bold text-primary-level tracking-wider">
                    极物
                  </span>
                </div>

                {/* Sidebar Nav */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-micro",
                          isActive
                            ? "text-brand bg-brand/10"
                            : "text-tertiary-level hover:text-primary-level hover:bg-white/5"
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
                        {item.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Sidebar Footer */}
                <div className="px-5 py-4 border-t border-white/[0.06]">
                  <p className="text-xs text-disabled-level">
                    查参数 · 看评价 · 比价格
                  </p>
                </div>
              </div>
              <SheetDescription className="sr-only">导航菜单</SheetDescription>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <LogoIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold text-primary-level tracking-wider transition-colors duration-200 group-hover:text-brand">
              极物
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-micro",
                  isActive
                    ? "text-primary-level"
                    : "text-tertiary-level hover:text-primary-level hover:bg-white/5"
                )}
              >
                <span>{item.label}</span>
                {/* Active indicator: bottom bar */}
                <span
                  className={cn(
                    "absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-brand transition-all duration-300",
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + User */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  render={<Link href="/phones" />}
                  className="text-tertiary-level hover:text-primary-level hover:bg-white/5 rounded-xl transition-micro"
                />
              }
            >
              <Search className="size-[18px]" />
            </TooltipTrigger>
            <TooltipContent>搜索手机</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  render={<Link href="/profile" />}
                  className="text-tertiary-level hover:text-primary-level hover:bg-white/5 rounded-xl transition-micro"
                />
              }
            >
              <UserIcon />
            </TooltipTrigger>
            <TooltipContent>个人中心</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
