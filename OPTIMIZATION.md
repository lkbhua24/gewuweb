# 格物 (Gewu) 项目优化文档

> 生成日期：2026-04-26
> 版本：v1.0

## 📋 项目概述

**项目名称**：格物 (Gewu) - 手机测评社区平台
**技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Supabase
**项目规模**：80+ 组件，涵盖手机测评、社区交流、用户系统等功能

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
    formats: ['image/avif', 'image/webp'], // 添加现代图片格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 启用压缩
  compress: true,
};
```

**实施优先级**：⭐⭐⭐⭐⭐

### 2. 组件懒加载

**建议**：对非首屏组件实施懒加载

```typescript
// 使用动态导入
import dynamic from 'next/dynamic';

const HeroTransitionOverlay = dynamic(
  () => import('@/components/ranking/hero-transition-overlay'),
  { ssr: false }
);

const ComparePanel = dynamic(
  () => import('@/components/phones/compare-panel'),
  { ssr: false }
);
```

**高收益组件**：
- `hero-transition-overlay.tsx` - 动画组件
- `compare-panel.tsx` - 对比功能面板
- `score-radar-chart.tsx` - 图表组件
- `aura-background.tsx` - 背景特效

### 3. CSS 优化

**现状**：使用 Tailwind CSS v4，globals.css 约 2000+ 行

**优化建议**：
1. **拆分 CSS 文件**：
   ```
   src/styles/
   ├── globals.css          # 全局基础样式
   ├── utilities.css        # 工具类
   ├── animations.css       # 动画样式
   └── themes.css           # 主题样式
   ```

2. **使用 @layer 组织**：
   ```css
   @layer base { /* 基础样式 */ }
   @layer components { /* 组件样式 */ }
   @layer utilities { /* 工具类 */ }
   ```

3. **移除未使用样式**：
   ```bash
   npm install -D @fullhuman/postcss-purgecss
   ```

---

## 📦 代码结构优化

### 1. 组件组织

**当前结构**：
```
src/components/
├── ui/               # shadcn/ui 组件
├── layout/           # 布局组件
├── phones/           # 手机相关组件 (17个)
├── ranking/          # 排行榜组件
├── community/        # 社区组件
├── theme/            # 主题组件
└── shared/           # 共享组件
```

**优化建议**：
1. **按功能域分组**：
   ```
   src/components/
   ├── ui/               # 基础UI组件
   ├── layout/           # 布局组件
   ├── features/         # 功能组件
   │   ├── phones/
   │   ├── ranking/
   │   ├── community/
   │   └── shopping/
   └── shared/           # 共享组件
   ```

2. **组件索引导出**：
   ```typescript
   // src/components/features/phones/index.ts
   export { PhoneCard } from './phone-card';
   export { ComparePanel } from './compare-panel';
   // ... 其他导出
   ```

### 2. Hooks 优化

**当前 Hooks**：
- `use-auth.ts` - 认证
- `use-media-query.ts` - 媒体查询
- `use-aura-theme.ts` - 主题
- `use-edge-swipe.ts` - 边缘滑动
- `use-hero-transition.ts` - 英雄区过渡

**建议新增**：
```typescript
// use-debounce.ts - 防抖
// use-throttle.ts - 节流
// use-local-storage.ts - 本地存储
// use-intersection-observer.ts - 视口检测
// use-fetch.ts - 数据获取
```

### 3. 类型定义优化

**建议**：集中管理类型定义
```
src/types/
├── index.ts          # 统一导出
├── models/           # 数据模型
├── api/              # API 类型
└── components/       # 组件 Props
```

---

## 🔒 安全优化

### 1. 环境变量管理

**建议**：
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

### 2. Supabase 安全

**当前配置**：`src/lib/supabase/middleware.ts`

**优化建议**：
1. 启用 RLS (Row Level Security)
2. 设置适当的 CORS 策略
3. 限制 API 请求频率

### 3. XSS 防护

**建议**：
- 对用户输入进行转义
- 使用 DOMPurify 处理富文本
- 设置 CSP (Content Security Policy)

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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          },
        ],
      },
    ];
  },
};
```

---

## 🔍 SEO 优化

### 1. 元数据优化

**现状**：`layout.tsx` 已配置基础 metadata

**优化建议**：
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
  robots: {
    index: true,
    follow: true,
  },
};
```

### 2. 结构化数据

**建议**：添加 JSON-LD
```typescript
// 产品页面
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: phone.name,
  image: phone.images,
  description: phone.description,
  brand: {
    '@type': 'Brand',
    name: phone.brand,
  },
};
```

### 3. 路由优化

**建议**：
- `/phones/[id]` → 规范 URL
- `/phones/compare?ids=1,2,3` → 对比页面优化
- 添加 sitemap.xml

---

## ⚡ 构建与部署优化

### 1. Next.js 配置优化

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // 输出静态导出（如需要）
  // output: 'export',
  
  // 启用 React Strict Mode
  reactStrictMode: true,
  
  // 禁用 x-powered-by
  poweredByHeader: false,
  
  // 启用 gzip 压缩
  compress: true,
  
  // 实验性功能
  experimental: {
    // 优化包体积
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // 图片优化
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

### 3. 依赖优化

**建议审查的依赖**：
| 依赖 | 现状 | 建议 |
|------|------|------|
| framer-motion | 使用中 | 仅导入需要的功能 |
| lucide-react | 使用中 | 使用 tree-shaking |
| @base-ui/react | 已安装 | 评估是否必要 |

---

## 🧪 测试策略

### 1. 测试框架配置

```bash
# 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 2. 测试建议

**优先级排序**：
1. **单元测试**：工具函数 (`lib/utils.ts`, `lib/phone-utils.ts`)
2. **组件测试**：核心 UI 组件
3. **集成测试**：关键用户流程
4. **E2E 测试**：完整业务流程

---

## 📱 移动端优化

### 1. 触摸优化

**已有**：`use-edge-swipe.ts` 边缘滑动检测

**建议**：
```typescript
// 添加触摸反馈
@media (hover: none) {
  .touch-feedback:active {
    opacity: 0.7;
    transform: scale(0.98);
  }
}
```

### 2. 响应式断点

**当前**：使用 Tailwind 默认断点

**建议自定义**：
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
- [ ] 添加动态导入懒加载
- [ ] 优化 next.config.ts

### 第二阶段（短期）
- [ ] 重构组件目录结构
- [ ] 添加常用 Hooks
- [ ] 完善 SEO 元数据

### 第三阶段（中期）
- [ ] 配置测试框架
- [ ] 添加 Bundle 分析
- [ ] 实施安全加固

### 第四阶段（长期）
- [ ] 性能监控
- [ ] 错误追踪
- [ ] 用户行为分析

---

## 📊 性能基准

### 当前预估指标

| 指标 | 目标值 | 优先级 |
|------|--------|--------|
| First Contentful Paint | < 1.8s | ⭐⭐⭐⭐⭐ |
| Largest Contentful Paint | < 2.5s | ⭐⭐⭐⭐⭐ |
| Time to Interactive | < 3.8s | ⭐⭐⭐⭐ |
| Cumulative Layout Shift | < 0.1 | ⭐⭐⭐⭐ |

### 监控工具推荐

1. **Vercel Analytics** - 内置性能监控
2. **Google PageSpeed Insights** - 性能评分
3. **Lighthouse CI** - 自动化审计

---

## 📝 总结

本项目是一个功能完善的 Next.js 应用，具有良好的组件化架构。主要优化方向：

1. **性能**：图片优化、懒加载、代码分割
2. **结构**：目录重构、类型统一
3. **安全**：环境变量验证、CSP 配置
4. **SEO**：结构化数据、元数据完善
5. **质量**：测试覆盖、代码规范

建议按照优先级逐步实施，每次优化后使用 Lighthouse 进行验证。

---

*文档生成时间：2026-04-26*
*维护者：开发团队*
