/**
 * API 客户端
 * 自动切换 Mock / 真实接口
 */

import type {
  GetPostsParams,
  GetPostsResponse,
  TrendItem,
  HotRankItem,
  TrendChartData,
  ActiveUser,
  HotTopic,
} from "./contract";

import {
  mockGetPosts,
  mockGetTrends,
  mockGetHotRank,
  mockGetTrendChart,
  mockGetActiveUsers,
  mockGetHotTopics,
} from "./mock";

// ========== Mock 开关 ==========

// 开发阶段 USE_MOCK = true
// 上线切换 USE_MOCK = false
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ========== 真实 API 实现（预留）==========

async function realGetPosts(params: GetPostsParams): Promise<GetPostsResponse> {
  const response = await fetch(
    `/api/posts?sort=${params.sort}&page=${params.page}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

async function realGetTrends(): Promise<TrendItem[]> {
  const response = await fetch("/api/trends");
  if (!response.ok) {
    throw new Error("Failed to fetch trends");
  }
  return response.json();
}

async function realGetHotRank(): Promise<HotRankItem[]> {
  const response = await fetch("/api/hot-rank");
  if (!response.ok) {
    throw new Error("Failed to fetch hot rank");
  }
  return response.json();
}

async function realGetTrendChart(): Promise<TrendChartData[]> {
  const response = await fetch("/api/trend-chart");
  if (!response.ok) {
    throw new Error("Failed to fetch trend chart");
  }
  return response.json();
}

async function realGetActiveUsers(): Promise<ActiveUser[]> {
  const response = await fetch("/api/active-users");
  if (!response.ok) {
    throw new Error("Failed to fetch active users");
  }
  return response.json();
}

async function realGetHotTopics(): Promise<HotTopic[]> {
  const response = await fetch("/api/hot-topics");
  if (!response.ok) {
    throw new Error("Failed to fetch hot topics");
  }
  return response.json();
}

// ========== 导出 API 方法 ==========

export const getPosts = USE_MOCK ? mockGetPosts : realGetPosts;
export const getTrends = USE_MOCK ? mockGetTrends : realGetTrends;
export const getHotRank = USE_MOCK ? mockGetHotRank : realGetHotRank;
export const getTrendChart = USE_MOCK ? mockGetTrendChart : realGetTrendChart;
export const getActiveUsers = USE_MOCK ? mockGetActiveUsers : realGetActiveUsers;
export const getHotTopics = USE_MOCK ? mockGetHotTopics : realGetHotTopics;

// 重新导出类型
export * from "./contract";
