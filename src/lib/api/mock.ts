/**
 * Mock 数据
 * 开发阶段使用
 */

import type {
  Post,
  TrendItem,
  HotRankItem,
  TrendChartData,
  ActiveUser,
  HotTopic,
  GetPostsParams,
  GetPostsResponse,
  SortType,
} from "./contract";

// ========== Mock Posts ==========

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "数码老司机",
      avatar: "",
      tag: "资深用户",
    },
    title: "iPhone 16 Pro Max 一个月深度体验",
    summary:
      "用了一个月，说说我的真实感受。续航比上一代有明显提升，拍照夜景模式进步很大...",
    tags: ["#iPhone", "#深度体验"],
    stats: { views: 125000, comments: 89, likes: 328 },
    heat: "boom",
    createdAt: "2小时前",
    circle: "苹果圈",
  },
  {
    id: "2",
    author: {
      name: "拍照达人",
      avatar: "",
      tag: "摄影达人",
    },
    title: "小米 15 Ultra 拍照对比评测",
    summary:
      "和上代对比，影像提升有多大？这次的主摄升级确实惊艳，特别是在弱光环境下...",
    tags: ["#小米", "#摄影"],
    stats: { views: 58000, comments: 67, likes: 256 },
    heat: "hot",
    createdAt: "5小时前",
    circle: "小米圈",
  },
  {
    id: "3",
    author: {
      name: "科技博主",
      avatar: "",
    },
    title: "2025年最值得买的折叠屏手机",
    summary:
      "横评三款主流折叠屏，帮你做选择。从便携性、续航、屏幕素质三个维度分析...",
    tags: ["#折叠屏", "#选购指南"],
    stats: { views: 12000, comments: 156, likes: 189 },
    heat: "discussing",
    createdAt: "8小时前",
    circle: "搞机圈",
  },
  {
    id: "4",
    author: {
      name: "充电狂魔",
      avatar: "",
      tag: "测试达人",
    },
    title: "安卓阵营快充横评：谁才是充电之王？",
    summary:
      "测试了市面上主流的120W、150W、240W快充方案，实测数据和官方标称有多大差距？",
    tags: ["#快充", "#测试"],
    stats: { views: 1800, comments: 38, likes: 156 },
    heat: "cold",
    createdAt: "12小时前",
    circle: "搞机圈",
  },
  {
    id: "5",
    author: {
      name: "极客湾",
      avatar: "",
      tag: "科技UP",
    },
    title: "骁龙8 Gen4 工程机首测：这次真的凉快了？",
    summary:
      "拿到了首批工程机，进行了完整的性能测试。台积电3nm工艺带来的能效提升超出预期...",
    tags: ["#骁龙", "#评测"],
    stats: { views: 45000, comments: 234, likes: 567 },
    heat: "hot",
    createdAt: "3小时前",
    circle: "搞机圈",
  },
  {
    id: "6",
    author: {
      name: "手机摄影君",
      avatar: "",
    },
    title: "手机拍出电影感：这些设置你必须知道",
    summary:
      "从帧率选择到色彩模式，手把手教你用手机拍出电影级别的画面质感...",
    tags: ["#摄影技巧", "#教程"],
    stats: { views: 8900, comments: 45, likes: 123 },
    heat: "cold",
    createdAt: "1天前",
    circle: "摄影圈",
  },
];

// ========== Mock Trends ==========

const mockTrends: TrendItem[] = [
  { id: "1", title: "#iPhone17爆料", heat: 98 },
  { id: "2", title: "#小米15Ultra", heat: 95 },
  { id: "3", title: "#折叠屏对比", heat: 87 },
  { id: "4", title: "#骁龙8Gen4", heat: 82 },
  { id: "5", title: "#华为Mate70", heat: 78 },
  { id: "6", title: "#手机摄影技巧", heat: 65 },
  { id: "7", title: "#充电速度测试", heat: 58 },
  { id: "8", title: "#性价比推荐", heat: 52 },
];

// ========== Mock Hot Rank ==========

const mockHotRank: HotRankItem[] = [
  { rank: 1, title: "iPhone 17 Pro 设计图曝光", count: "12.5k" },
  { rank: 2, title: "小米15 Ultra 夜景对比", count: "9.8k" },
  { rank: 3, title: "华为 Mate 70 芯片详解", count: "8.7k" },
  { rank: 4, title: "折叠屏耐用性测试", count: "6.5k" },
  { rank: 5, title: "2000元档位推荐", count: "5.4k" },
];

// ========== Mock Trend Chart ==========

const mockTrendChart: TrendChartData[] = [
  { day: "周一", value: 40 },
  { day: "周二", value: 65 },
  { day: "周三", value: 45 },
  { day: "周四", value: 80 },
  { day: "周五", value: 55 },
  { day: "周六", value: 90 },
  { day: "周日", value: 70 },
];

// ========== Mock Active Users ==========

const mockActiveUsers: ActiveUser[] = [
  { id: "1", name: "数码老司机", avatar: "" },
  { id: "2", name: "拍照达人", avatar: "" },
  { id: "3", name: "科技博主", avatar: "" },
  { id: "4", name: "搞机少年", avatar: "" },
];

// ========== Mock Hot Topics ==========

const mockHotTopics: HotTopic[] = [
  { name: "#开箱", count: 1234 },
  { name: "#评测", count: 987 },
  { name: "#摄影", count: 856 },
  { name: "#续航", count: 654 },
  { name: "#游戏", count: 543 },
  { name: "#办公", count: 432 },
  { name: "#性价比", count: 321 },
  { name: "#旗舰", count: 210 },
];

// ========== Mock API Functions ==========

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 根据排序类型过滤和排序帖子
function filterAndSortPosts(posts: Post[], sort: SortType): Post[] {
  const sorted = [...posts];

  switch (sort) {
    case "hot":
      return sorted.sort((a, b) => b.stats.views - a.stats.views);
    case "new":
      return sorted; // 假设已经是时间倒序
    case "follow":
      // 模拟关注过滤，返回部分数据
      return sorted.slice(0, 3);
    case "recommend":
    default:
      // 推荐算法：热度优先 + 时间因素
      return sorted.sort((a, b) => {
        const heatScore = { boom: 4, hot: 3, discussing: 2, cold: 1 };
        return heatScore[b.heat] - heatScore[a.heat];
      });
  }
}

export async function mockGetPosts(params: GetPostsParams): Promise<GetPostsResponse> {
  await delay(300); // 模拟网络延迟

  const pageSize = 10;
  const filtered = filterAndSortPosts(mockPosts, params.sort);
  const start = (params.page - 1) * pageSize;
  const end = start + pageSize;
  const list = filtered.slice(start, end);

  return {
    list,
    total: filtered.length,
    hasMore: end < filtered.length,
  };
}

export async function mockGetTrends(): Promise<TrendItem[]> {
  await delay(200);
  return mockTrends;
}

export async function mockGetHotRank(): Promise<HotRankItem[]> {
  await delay(200);
  return mockHotRank;
}

export async function mockGetTrendChart(): Promise<TrendChartData[]> {
  await delay(200);
  return mockTrendChart;
}

export async function mockGetActiveUsers(): Promise<ActiveUser[]> {
  await delay(200);
  return mockActiveUsers;
}

export async function mockGetHotTopics(): Promise<HotTopic[]> {
  await delay(200);
  return mockHotTopics;
}
