"use client";

import { useState } from "react";
import { Image, Hash, BarChart3, Send } from "lucide-react";

export function PostComposer() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="glass rounded-2xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--community-primary)]/30 to-[var(--community-highlight)]/30 flex items-center justify-center text-white font-medium border border-white/10 flex-shrink-0">
          我
        </div>
        <div className="flex-1">
          <textarea
            placeholder="分享你的搞机心得..."
            className="w-full bg-transparent border-0 text-white/90 placeholder:text-white/40 resize-none focus:outline-none focus:ring-0 transition-all duration-300"
            style={{ 
              minHeight: isFocused ? '80px' : '36px',
              height: isFocused ? '80px' : '36px'
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              // 如果内容为空，则收起
              if (!e.target.value.trim()) {
                setIsFocused(false);
              }
            }}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--community-glass-border)]">
            {/* 工具栏：图片、话题、投票 */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-[var(--community-primary)] transition-colors" title="图片">
                <Image className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-[var(--community-highlight)] transition-colors" title="话题">
                <Hash className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-[var(--community-accent)] transition-colors" title="投票">
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
            {/* 发布按钮：渐变 + hover上浮 */}
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg post-composer-submit">
              <Send className="w-4 h-4" />
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
