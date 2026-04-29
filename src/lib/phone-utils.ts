/**
 * 手机库文案与格式化工具函数
 * 遵循微文案规范，去除 AI 味与模板感
 */

// ============================================================================
// 价格格式化
// ============================================================================

/**
 * 格式化价格，带千分位逗号
 * 例：5999 -> ¥5,999
 */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "";
  return `¥${price.toLocaleString("zh-CN")}`;
}

/**
 * 格式化均价显示
 * 主价格 + 小字 "· 均价"
 */
export function formatAvgPrice(price: number | null | undefined): {
  main: string;
  suffix: string;
} {
  if (price == null) return { main: "", suffix: "" };
  return {
    main: `¥${price.toLocaleString("zh-CN")}`,
    suffix: "· 均价",
  };
}

// ============================================================================
// 时间表述
// ============================================================================

/**
 * 获取相对时间表述
 * - 7天内："4天前"、"昨天"、"2小时前"
 * - 7-30天："上周"、"X天前"
 * - 超过30天："X月X日"
 */
export function getRelativeTime(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();

  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 未来时间（待发布）
  if (diffMs < 0) {
    const futureDays = Math.ceil(-diffMs / (1000 * 60 * 60 * 24));
    return `预计 ${futureDays} 天后发布`;
  }

  // 7天内
  if (diffDays < 1) {
    if (diffHours < 1) {
      if (diffMinutes < 1) return "刚刚";
      return `${diffMinutes}分钟前`;
    }
    return `${diffHours}小时前`;
  }
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;

  // 7-30天
  if (diffDays < 30) {
    if (diffDays < 14) return "上周";
    return `${diffDays}天前`;
  }

  // 超过30天：显示 X月X日
  return `${target.getMonth() + 1}月${target.getDate()}日`;
}

/**
 * 获取发布状态标签文案
 */
export function getReleaseStatus(dateStr: string): {
  label: string;
  isUpcoming: boolean;
} {
  const target = new Date(dateStr);
  const now = new Date();
  const isUpcoming = target.getTime() > now.getTime();

  return {
    label: isUpcoming ? "待发布" : "已发布",
    isUpcoming,
  };
}

// ============================================================================
// 待发布机型参数
// ============================================================================

/**
 * 格式化待发布机型参数
 * 未知项用 ? 代替
 */
export function formatUpcomingSpec(
  value: string | null | undefined
): { display: string; isUnknown: boolean } {
  if (!value || value === "?" || value.trim() === "") {
    return { display: "?", isUnknown: true };
  }
  return { display: value, isUnknown: false };
}

// ============================================================================
// 按钮文案映射
// ============================================================================

export const buttonLabels = {
  search: "搜索",
  compare: "对比",
  clear: "清空",
  addToCompare: "加入对比",
  remove: "移除",
  viewDetail: "查看详情",
  clearFilters: "清除筛选",
  startCompare: "开始对比",
  cancelCompare: "取消对比",
} as const;

// ============================================================================
// 空状态文案
// ============================================================================

export const emptyStateMessages = {
  searchNoResults:
    "这台机子太冷门了，连极物库都没收录。试试搜别的？",
  compareEmpty: "至少选择 2 台机型进行对比",
  compareHint: "在卡片上勾选即可添加",
} as const;

// ============================================================================
// 标签文案（用户口语化，不用技术术语堆砌）
// ============================================================================

export const featureLabels: Record<string, string> = {
  "长续航": "长续航",
  "直屏党": "直屏党",
  "影像旗舰": "影像旗舰",
  "小屏旗舰": "小屏旗舰",
  "游戏手机": "游戏手机",
  "折叠屏": "折叠屏",
} as const;
