"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommunityBackground } from "@/components/community/community-background";
import { TrendingBar } from "@/components/community/trending-bar";
import { LeftSidebar } from "@/components/community/left-sidebar";
import { RightSidebar } from "@/components/community/right-sidebar";
import { PostComposer } from "@/components/community/post-composer";
import { FeedTabs } from "@/components/community/feed-tabs";
import { PostCard } from "@/components/community/post-card";
import { Flame } from "lucide-react";

// 列表入场动画变体
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const placeholderPosts = [
  { 
    title: "iPhone 16 Pro Max 一个月深度体验", 
    content: "用了一个月，说说我的真实感受。续航比上一代有明显提升，拍照夜景模式进步很大...", 
    authorName: "数码老司机",
    authorRole: "资深用户",
    circleName: "苹果圈",
    tags: ["#iPhone", "#深度体验"],
    viewsCount: 125000,  // boom - 阅读>10w
    likesCount: 328, 
    commentsCount: 89, 
    createdAt: "2小时前",
    isHot: true,
  },
  { 
    title: "小米 15 Ultra 拍照对比评测", 
    content: "和上代对比，影像提升有多大？这次的主摄升级确实惊艳，特别是在弱光环境下...", 
    authorName: "拍照达人",
    authorRole: "摄影达人",
    circleName: "小米圈",
    tags: ["#小米", "#摄影"],
    viewsCount: 58000,   // hot - 阅读>5w
    likesCount: 256, 
    commentsCount: 67, 
    createdAt: "5小时前",
    isHot: true,
  },
  { 
    title: "2025年最值得买的折叠屏手机", 
    content: "横评三款主流折叠屏，帮你做选择。从便携性、续航、屏幕素质三个维度分析...", 
    authorName: "科技博主",
    circleName: "搞机圈",
    tags: ["#折叠屏", "#选购指南"],
    viewsCount: 12000,   // discussing - 评论>100
    likesCount: 189, 
    commentsCount: 156, 
    createdAt: "8小时前",
    isHot: false,
  },
  { 
    title: "安卓阵营快充横评：谁才是充电之王？", 
    content: "测试了市面上主流的120W、150W、240W快充方案，实测数据和官方标称有多大差距？", 
    authorName: "充电狂魔",
    authorRole: "测试达人",
    circleName: "搞机圈",
    tags: ["#快充", "#测试"],
    viewsCount: 1800,    // cold - 普通
    likesCount: 156, 
    commentsCount: 38, 
    createdAt: "12小时前",
    isHot: false,
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("recommend");

  return (
    <CommunityBackground>
      {/* 顶部趋势条 */}
      <TrendingBar />
      
      {/* 三栏布局容器 - 使用 Grid 布局确保不溢出 */}
      <div className="px-4 py-6 overflow-x-hidden">
        <div className="community-grid-layout">
          {/* 左侧栏 - 固定在左侧 */}
          <LeftSidebar />
          
          {/* 中间主内容区 */}
          <main className="min-w-0">
            {/* 发布框 */}
            <PostComposer />
            
            {/* 筛选标签 */}
            <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {/* 内容区域 - AnimatePresence 实现切换动画 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                layout
              >
                {/* 推荐讨论（仅推荐标签显示） */}
                {activeTab === "recommend" && (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 rounded-2xl border-l-4 overflow-hidden"
                    style={{ 
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      borderLeftColor: "var(--community-primary)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-[var(--community-primary)]" />
                      <span className="text-sm font-medium text-[var(--community-primary)]">推荐讨论</span>
                    </div>
                    <p className="text-sm text-white/70">根据你的兴趣，为你推荐可能感兴趣的讨论内容</p>
                  </motion.div>
                )}
                
                {/* 帖子流 */}
                <motion.div 
                  layout
                  className="space-y-4"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {placeholderPosts.map((post, index) => (
                    <motion.div 
                      key={`${activeTab}-${index}`}
                      className="relative pl-3"
                      variants={itemVariants}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {post.isHot && (
                        <div className="absolute left-0 top-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--community-accent)]/20 text-[var(--community-accent)] text-xs font-medium z-10">
                          <Flame className="w-3 h-3" />
                          热门
                        </div>
                      )}
                      <PostCard {...post} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </main>

          {/* 右侧栏 - 固定在右侧 */}
          <RightSidebar />
        </div>
      </div>
    </CommunityBackground>
  );
}
