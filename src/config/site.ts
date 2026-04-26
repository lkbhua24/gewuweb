export const siteConfig = {
  name: "极物",
  description: "查参数、看评价、比价格、聊搞机的第一站",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    twitter: "",
    github: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
