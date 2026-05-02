"use client";

import { TrendingUp } from "lucide-react";

const trendingTopics = [
  { id: 1, tag: "#iPhone17爆料", heat: 98 },
  { id: 2, tag: "#小米15Ultra", heat: 95 },
  { id: 3, tag: "#折叠屏对比", heat: 87 },
  { id: 4, tag: "#骁龙8Gen4", heat: 82 },
  { id: 5, tag: "#华为Mate70", heat: 78 },
  { id: 6, tag: "#手机摄影技巧", heat: 65 },
  { id: 7, tag: "#充电速度测试", heat: 58 },
  { id: 8, tag: "#性价比推荐", heat: 52 },
];

// 获取排名色标
function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-400/50";
    case 2:
      return "bg-gradient-to-r from-orange-400 to-yellow-400 text-white border-orange-300/50";
    case 3:
      return "bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-900 border-yellow-300/50";
    default:
      return "bg-[var(--community-glass)] text-white/80 border-[var(--community-glass-border)]";
  }
}

function TopicList() {
  return (
    <>
      <div className="flex items-center gap-2 px-4 text-[var(--community-highlight)] flex-shrink-0">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">热门话题</span>
      </div>
      {trendingTopics.map((topic, index) => {
        const rank = index + 1;
        const rankStyle = getRankStyle(rank);
        return (
          <div
            key={topic.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border hover:opacity-80 cursor-pointer transition-all flex-shrink-0 ${rankStyle}`}
          >
            {/* 排名色标 */}
            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
              rank <= 3 ? "bg-white/20 text-white" : "bg-white/10 text-white/60"
            }`}>
              {rank}
            </span>
            <span className="text-sm">{topic.tag}</span>
            <span className={`text-xs ${rank <= 3 ? "text-white/90" : "text-[var(--community-accent)]"}`}>
              {topic.heat}°
            </span>
          </div>
        );
      })}
    </>
  );
}

export function TrendingBar() {
  return (
    <div className="w-full py-2 border-b border-[var(--community-glass-border)] overflow-hidden relative">
      {/* 左侧渐变遮罩 */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--community-bg-dark)] to-transparent z-10 pointer-events-none" />
      
      {/* 右侧渐变遮罩 */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--community-bg-dark)] to-transparent z-10 pointer-events-none" />
      
      {/* 滚动内容 */}
      <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
        <TopicList />
        {/* 复制一份实现无缝循环 */}
        <TopicList />
      </div>
    </div>
  );
}
