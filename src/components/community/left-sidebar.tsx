"use client";

import { Users, Compass, Hash, ChevronRight } from "lucide-react";
import Link from "next/link";

const myCircles = [
  { id: 1, name: "苹果圈", unread: 3 },
  { id: 2, name: "搞机圈", unread: 0 },
];

const recommendedCircles = [
  { id: 3, name: "小米圈", members: "9.6k" },
  { id: 4, name: "华为圈", members: "8.4k" },
  { id: 5, name: "摄影圈", members: "5.2k" },
];

const subscribedTopics = [
  "#iPhone17",
  "#影像评测",
  "#性价比",
];

export function LeftSidebar() {
  return (
    <aside className="hidden lg:block space-y-6 flex-shrink-0 -ml-[100px]" style={{ width: 'var(--community-left-width)' }}>
      {/* 我的圈子 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white/90">
            <Users className="w-4 h-4 text-[var(--community-primary)]" />
            <span className="text-sm font-medium">我的圈子</span>
          </div>
        </div>
        <div className="space-y-2">
          {myCircles.map((circle) => (
            <Link
              key={circle.id}
              href={`/community/${circle.id}`}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <span className="text-sm text-white/70 group-hover:text-white/90">{circle.name}</span>
              {circle.unread > 0 && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--community-accent)] text-xs text-white">
                  {circle.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 推荐圈子 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white/90">
            <Compass className="w-4 h-4 text-[var(--community-highlight)]" />
            <span className="text-sm font-medium">推荐圈子</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </div>
        <div className="space-y-2">
          {recommendedCircles.map((circle) => (
            <Link
              key={circle.id}
              href={`/community/${circle.id}`}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <span className="text-sm text-white/70 group-hover:text-white/90">{circle.name}</span>
              <span className="text-xs text-white/40">{circle.members}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 话题订阅 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white/90">
            <Hash className="w-4 h-4 text-[var(--community-accent)]" />
            <span className="text-sm font-medium">话题订阅</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {subscribedTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-full text-xs bg-[var(--community-primary)]/10 text-[var(--community-primary)] border border-[var(--community-primary)]/20"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
