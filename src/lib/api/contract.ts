/**
 * 圈子模块 API 接口契约
 * 前后端对齐用
 */

// ========== 数据模型 ==========

export interface PostAuthor {
  name: string;
  avatar: string;
  tag?: string;
}

export interface PostStats {
  views: number;
  comments: number;
  likes: number;
}

export type HeatLevel = 'cold' | 'discussing' | 'hot' | 'boom';

export interface Post {
  id: string;
  author: PostAuthor;
  title: string;
  summary: string;
  tags: string[];
  stats: PostStats;
  heat: HeatLevel;
  createdAt: string;
  circle: string;
}

export interface TrendItem {
  id: string;
  title: string;
  heat: number;
}

export interface HotRankItem {
  rank: number;
  title: string;
  count: string;
}

export interface TrendChartData {
  day: string;
  value: number;
}

export interface ActiveUser {
  id: string;
  name: string;
  avatar: string;
}

export interface HotTopic {
  name: string;
  count: number;
}

// ========== API 接口定义 ==========

export type SortType = 'recommend' | 'hot' | 'follow' | 'new';

export interface GetPostsParams {
  sort: SortType;
  page: number;
}

export interface GetPostsResponse {
  list: Post[];
  total: number;
  hasMore: boolean;
}

export interface API {
  'GET /posts': {
    params: GetPostsParams;
    response: GetPostsResponse;
  };
  'GET /trends': {
    response: TrendItem[];
  };
  'GET /hot-rank': {
    response: HotRankItem[];
  };
  'GET /trend-chart': {
    response: TrendChartData[];
  };
  'GET /active-users': {
    response: ActiveUser[];
  };
  'GET /hot-topics': {
    response: HotTopic[];
  };
}
