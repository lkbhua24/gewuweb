"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export function SearchBar({ placeholder = "搜索...", onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9"
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
}
