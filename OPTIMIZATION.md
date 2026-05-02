# 格物 (Gewu) 项目优化文档

> 生成日期：2026-04-26
> 版本：v2.1

## 📋 项目概述

**项目名称**：格物 (Gewu) - 手机测评社区平台
**技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Supabase
**项目规模**：100+ 组件，涵盖手机测评、社区交流、用户系统、主题展示等功能

---

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # 认证相关页面
│   ├── community/         # 社区功能
│   ├── phones/            # 手机库页面
│   ├── ranking/           # 排行榜
│   ├── shopping/          # 购物功能
│   ├── profile/           # 用户中心
│   └── theme-demo/        # 主题展示
├── components/
│   ├── ui/                # shadcn/ui 基础组件
│   ├── layout/            # 布局组件 (Header, Footer, MobileNav)
│   ├── phones/            # 手机相关组件 (20+)
│   ├── ranking/           # 排行榜组件
│   ├── community/         # 社区组件
│   ├── shopping/          # 购物组件
│   ├── theme/             # 主题展示组件 (15+)
│   └── shared/            # 共享组件
├── hooks/                 # 自定义 Hooks
├── lib/                   # 工具函数
├── types/                 # TypeScript 类型
└── config/                # 配置文件
```

---

## 🆕 最新功能更新 (v2.0)

### 主题展示系统
- `dynamic-theme-showcase.tsx` - 动态主题展示
- `particle-background.tsx` - 粒子背景效果
- `particle-showcase.tsx` - 粒子效果展示
- `phone-3d-showcase.tsx` - 3D手机展示
- `phone-detail-page.tsx` - 手机详情页
- `phone-info-panel.tsx` - 手机信息面板
- `phone-specs-grid.tsx` - 规格网格展示
- `price-chart.tsx` - 价格趋势图表
- `price-comparison-matrix.tsx` - 价格对比矩阵
- `purchase-decision-bar.tsx` - 购买决策栏
- `review-sentiment-analysis.tsx` - 评论情感分析
- `score-dashboard.tsx` - 评分仪表盘
- `visual-mood-board.tsx` - 视觉心情板

### 新增 Hooks
- `use-dynamic-theme.ts` - 动态主题管理
- `use-theme-css-variables.ts` - CSS变量主题管理

### 手机库功能增强
- `phone-library-grid.tsx` - 手机库网格布局
- `phone-detail-header.tsx` - 详情页头部
- `score-radar-chart.tsx` - 雷达图评分
- `category-detail-panel.tsx` - 分类详情面板

### 社区功能增强 (v2.1)
- `community-background.tsx` - 社区页面背景
- `feed-tabs.tsx` - 内容流标签切换
- `heat-indicator.tsx` - 热度指示器
- `left-sidebar.tsx` - 左侧边栏
- `like-button.tsx` - 点赞按钮组件
- `post-composer.tsx` - 发帖编辑器
- `right-sidebar.tsx` - 右侧边栏
- `trending-bar.tsx` -  trending 热门栏

### 布局组件
- `sidebar.tsx` - 侧边栏导航

### API 层 (v2.1)
- `lib/api/contract.ts` - API 契约定义
- `lib/api/client.ts` - API 客户端
- `lib/api/mock.ts` - Mock 数据

---

## 🚀 性能优化建议

### 1. 图片优化

**现状分析**：
- `next.config.ts` 已配置 Supabase 图片域名
- 需要进一步优化图片加载策略

**优化建议**：
```typescript
// next.config.ts 优化
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
};
```

### 2. 组件懒加载

**建议**：对主题展示组件实施懒加载

```typescript
// 动态导入主题组件
import dynamic from 'next/dynamic';

const ParticleShowcase = dynamic(
  () => import('@/components/theme/particle-showcase'),
  { ssr: false, loading: () => <Skeleton /> }
);

const Phone3DShowcase = dynamic(
  () => import('@/components/theme/phone-3d-showcase'),
  { ssr: false }
);
```

### 3. 主题系统优化

**CSS 变量管理**：
```typescript
// 使用 CSS 变量实现动态主题
:root {
  --theme-primary: hsl(var(--primary));
  --theme-background: hsl(var(--background));
  --theme-card: hsl(var(--card));
}

// 动态主题切换
[data-theme="dark"] {
  --primary: 0 0% 98%;
  --background: 240 10% 3.9%;
}
```

---

## 📦 代码结构优化

### 1. 组件组织优化

**当前结构**：
```
src/components/
├── ui/               # 基础UI组件 (shadcn)
├── layout/           # 布局组件
├── phones/           # 手机功能 (20+ 组件)
├── ranking/          # 排行榜
├── community/        # 社区
├── theme/            # 主题展示 (15+ 组件)
└── shared/           # 共享组件
```

**优化建议**：
1. **主题组件分组**：
   ```
   src/components/theme/
   ├── showcase/       # 展示类组件
   ├── charts/         # 图表组件
   ├── backgrounds/    # 背景效果
   └── panels/         # 面板组件
   ```

2. **添加组件索引**：
   ```typescript
   // src/components/theme/index.ts
   export { DynamicThemeShowcase } from './dynamic-theme-showcase';
   export { ParticleBackground } from './particle-background';
   export { ScoreDashboard } from './score-dashboard';
   // ...
   ```

### 2. Hooks 优化

**当前 Hooks 列表**：
- `use-auth.ts` - 认证
- `use-media-query.ts` - 媒体查询
- `use-aura-theme.ts` - Aura主题
- `use-edge-swipe.ts` - 边缘滑动
- `use-hero-transition.ts` - 英雄区过渡
- `use-dynamic-theme.ts` - 动态主题
- `use-theme-css-variables.ts` - CSS变量主题

**建议新增**：
```typescript
// use-intersection-observer.ts - 视口检测（用于懒加载）
// use-debounce.ts - 防抖
// use-local-storage.ts - 本地存储
// use-scroll-position.ts - 滚动位置
// use-animation-frame.ts - 动画帧管理
```

---

## 🎨 主题系统优化

### 1. 动态主题架构

**当前实现**：`use-dynamic-theme.ts` + `use-theme-css-variables.ts`

**优化建议**：
```typescript
// 主题配置集中管理
export const themes = {
  light: {
    primary: '220 90% 56%',
    background: '0 0% 100%',
    card: '0 0% 98%',
  },
  dark: {
    primary: '0 0% 98%',
    background: '240 10% 3.9%',
    card: '240 10% 5%',
  },
  // 品牌定制主题
  brand: {
    primary: '200 100% 50%',
    // ...
  }
};
```

### 2. 粒子效果优化

**组件**：`particle-background.tsx`, `particle-showcase.tsx`

**优化建议**：
- 使用 `requestAnimationFrame` 优化动画性能
- 实现粒子数量自适应（根据设备性能）
- 支持减少动画偏好设置 `prefers-reduced-motion`

---

## 🔒 安全优化

### 1. 环境变量管理

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

### 2. CSP 配置

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://*.supabase.co data:",
              "connect-src 'self' https://*.supabase.co",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

---

## 🔍 SEO 优化

### 1. 元数据配置

```typescript
// src/lib/seo.ts
export const defaultMetadata = {
  metadataBase: new URL('https://gewu.example.com'),
  title: {
    default: '格物 - 手机测评社区',
    template: '%s | 格物',
  },
  description: '最专业的手机测评平台，提供真实用户评测、参数对比、购买建议',
  keywords: ['手机测评', '手机对比', '购机建议', '数码社区'],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '格物',
  },
};
```

### 2. 结构化数据

```typescript
// 产品页面 JSON-LD
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: phone.name,
  image: phone.images,
  description: phone.description,
  brand: { '@type': 'Brand', name: phone.brand },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: phone.score,
    reviewCount: phone.reviewCount,
  },
};
```

---

## ⚡ 构建与部署优化

### 1. Next.js 配置

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',  // 如果使用图表库
    ],
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};
```

### 2. Bundle 分析

```bash
# 安装分析工具
npm install -D @next/bundle-analyzer

# 分析命令
ANALYZE=true npm run build
```

---

## 📱 移动端优化

### 1. 触摸交互优化

**已有**：`use-edge-swipe.ts` 边缘滑动检测

**新增建议**：
```css
/* 触摸反馈 */
@media (hover: none) {
  .touch-feedback:active {
    opacity: 0.7;
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. 响应式断点

```javascript
// tailwind.config.ts
screens: {
  'xs': '375px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

---

## 🎯 优先级路线图

### 第一阶段（立即执行）
- [ ] 配置图片格式支持 (avif/webp)
- [ ] 为主题组件添加懒加载
- [ ] 优化 next.config.ts

### 第二阶段（短期）
- [ ] 重构 theme 目录结构
- [ ] 添加常用 Hooks (debounce, intersection-observer)
- [ ] 完善 SEO 元数据

### 第三阶段（中期）
- [ ] 配置测试框架 (Vitest)
- [ ] 添加 Bundle 分析
- [ ] 实施安全加固

### 第四阶段（长期）
- [ ] 性能监控接入
- [ ] 错误追踪 (Sentry)
- [ ] 用户行为分析

---

## 📊 性能基准

| 指标 | 目标值 | 优先级 |
|------|--------|--------|
| First Contentful Paint | < 1.8s | ⭐⭐⭐⭐⭐ |
| Largest Contentful Paint | < 2.5s | ⭐⭐⭐⭐⭐ |
| Time to Interactive | < 3.8s | ⭐⭐⭐⭐ |
| Cumulative Layout Shift | < 0.1 | ⭐⭐⭐⭐ |

---

## 📝 组件清单

### UI 组件 (shadcn)
- Button, Card, Input, Badge, Avatar
- Dialog, Dropdown, Sheet, Tooltip
- Tabs, Table, ScrollArea, Skeleton
- NavigationMenu, Separator

### 业务组件
- **手机模块**：PhoneCard, ComparePanel, PhoneLibraryGrid, ScoreRadarChart
- **排行榜模块**：RankingCard, ColorSelector, HeroTransitionOverlay
- **社区模块**：CircleCard, PostCard
- **主题模块**：15+ 展示组件
- **布局模块**：Header, Footer, MobileNav

---

## 🧪 测试策略

```bash
# 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom

# 测试优先级
1. 工具函数 (lib/utils.ts, lib/phone-utils.ts)
2. 核心 Hooks (use-auth.ts, use-dynamic-theme.ts)
3. 关键 UI 组件
4. 页面集成测试
```

---

## 📚 文档维护

- 本文档版本：v2.1
- 最后更新：2026-04-26
- 维护者：开发团队
- 更新频率：每迭代周期

---

*本文档随代码一起推送至 GitHub 仓库*
