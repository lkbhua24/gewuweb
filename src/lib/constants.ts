export const NAV_ITEMS = [
  { label: "首页", href: "/", icon: "Home" },
  { label: "手机库", href: "/phones", icon: "Smartphone" },
  { label: "排行榜", href: "/ranking", icon: "Trophy" },
  { label: "导购", href: "/shopping", icon: "ShoppingCart" },
  { label: "圈子", href: "/community", icon: "Users" },
] as const;

export const PHONE_BRANDS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Huawei",
  "OPPO",
  "vivo",
  "OnePlus",
  "Google",
  "Sony",
  "Motorola",
  "Realme",
  "Honor",
] as const;

export const PHONE_CATEGORIES = [
  "旗舰机",
  "中端机",
  "入门机",
  "游戏手机",
  "折叠屏",
  "拍照手机",
] as const;
