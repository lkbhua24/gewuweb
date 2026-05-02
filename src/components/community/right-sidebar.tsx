"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Users, Hash, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  getHotRank,
  getTrendChart,
  getActiveUsers,
  getHotTopics,
  type HotRankItem,
  type TrendChartData,
  type ActiveUser,
  type HotTopic,
} from "@/lib/api/client";

// 头像颜色映射
const avatarColors = ["#6366f1", "#a855f7", "#ec4899", "#34d399", "#22d3ee"];

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

export function RightSidebar() {
  const [hotRank, setHotRank] = useState<HotRankItem[]>([]);
  const [trendChart, setTrendChart] = useState<TrendChartData[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rankData, chartData, usersData, topicsData] = await Promise.all([
          getHotRank(),
          getTrendChart(),
          getActiveUsers(),
          getHotTopics(),
        ]);
        setHotRank(rankData);
        setTrendChart(chartData);
        setActiveUsers(usersData);
        setHotTopics(topicsData);
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <aside
        className="hidden xl:block space-y-6 flex-shrink-0"
        style={{ width: "var(--community-right-width, 280px)" }}
      >
        <div className="glass rounded-2xl p-4 h-32 animate-pulse" />
        <div className="glass rounded-2xl p-4 h-32 animate-pulse" />
        <div className="glass rounded-2xl p-4 h-24 animate-pulse" />
        <div className="glass rounded-2xl p-4 h-32 animate-pulse" />
      </aside>
    );
  }

  return (
    <aside
      className="hidden xl:block space-y-6 flex-shrink-0"
      style={{ width: "var(--community-right-width, 280px)" }}
    >
      {/* 今日热榜 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white/90">
            <Trophy className="w-4 h-4 text-[var(--community-accent)]" />
            <span className="text-sm font-medium">今日热榜</span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-white/40 cursor-pointer" />
        </div>
        <div className="space-y-3">
          {hotRank.map((item) => (
            <Link
              key={item.rank}
              href="#"
              className="flex items-start gap-3 group"
            >
              <span
                className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                  item.rank <= 3
                    ? "bg-[var(--community-accent)]/20 text-[var(--community-accent)]"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {item.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 group-hover:text-white truncate">
                  {item.title}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{item.count} 热度</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 讨论趋势图 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/90 mb-4">
          <TrendingUp className="w-4 h-4 text-[var(--community-highlight)]" />
          <span className="text-sm font-medium">讨论趋势</span>
        </div>
        <div className="h-16 flex items-end gap-1">
          {trendChart.map((item, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--community-primary)]/40 to-[var(--community-highlight)]/60"
              style={{ height: `${item.value}%` }}
              title={`${item.day}: ${item.value}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>{trendChart[0]?.day || "周一"}</span>
          <span>{trendChart[trendChart.length - 1]?.day || "周日"}</span>
        </div>
      </div>

      {/* 活跃圈友 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/90 mb-4">
          <Users className="w-4 h-4 text-[var(--community-primary)]" />
          <span className="text-sm font-medium">活跃圈友</span>
        </div>
        <div className="flex -space-x-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[rgba(15,23,42,0.7)]"
              style={{ backgroundColor: getAvatarColor(user.name) }}
              title={user.name}
            >
              {getInitials(user.name)}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white/60 bg-white/10 border-2 border-[rgba(15,23,42,0.7)]">
            +99
          </div>
        </div>
      </div>

      {/* 热门话题云 */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-white/90 mb-4">
          <Hash className="w-4 h-4 text-[var(--community-accent)]" />
          <span className="text-sm font-medium">热门话题</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hotTopics.map((topic) => (
            <span
              key={topic.name}
              className="px-2 py-1 rounded-lg text-xs bg-white/5 text-white/70 hover:bg-[var(--community-primary)]/10 hover:text-[var(--community-primary)] cursor-pointer transition-colors"
            >
              {topic.name}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
