"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Settings,
  LogOut,
  Bookmark,
  MessageCircle,
  FileText,
  Heart,
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  Eye,
  Share2,
  ChevronRight,
  Edit3,
  Camera,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParticleBackground } from "@/components/theme/particle-background";

// ============================================================================
// 个人中心主页面
// 设计原则：科技感 + 沉浸感 + 信息密度 + 即时反馈
// ============================================================================

// --- 模拟数据 ---
const USER_DATA = {
  name: "极物用户",
  handle: "@gewu_user",
  email: "user@example.com",
  avatar: null,
  level: "资深搞机党",
  joinDate: "2024-03-15",
  bio: "热爱数码科技，专注手机评测与对比",
};

const STATS_DATA = [
  { label: "帖子", value: 128, trend: 12, icon: FileText },
  { label: "获赞", value: 3456, trend: 8, icon: Heart },
  { label: "收藏", value: 89, trend: -3, icon: Bookmark },
  { label: "关注", value: 234, trend: 5, icon: Eye },
  { label: "粉丝", value: 567, trend: 15, icon: Share2 },
  { label: "评论", value: 456, trend: 6, icon: MessageCircle },
];

const ACTIVITY_DATA = [
  { id: 1, type: "post", title: "iPhone 16 Pro 深度评测：A18 Pro 性能解析", date: "2小时前", heat: 98 },
  { id: 2, type: "comment", title: "回复了 小米15 Ultra 拍照对比帖子", date: "5小时前", heat: 76 },
  { id: 3, type: "like", title: "赞了 Galaxy S25 Ultra 续航测试", date: "1天前", heat: 65 },
  { id: 4, type: "collect", title: "收藏了 2024年旗舰手机横评", date: "2天前", heat: 92 },
  { id: 5, type: "post", title: "折叠屏手机选购指南：横折 vs 竖折", date: "3天前", heat: 87 },
];

const BADGES_DATA = [
  { id: 1, name: "评测达人", desc: "发布10篇评测", icon: Zap, color: "var(--profile-primary)", glow: "var(--profile-primary-glow)" },
  { id: 2, name: "热门作者", desc: "单篇热度破千", icon: TrendingUp, color: "var(--profile-highlight)", glow: "var(--profile-highlight-glow)" },
  { id: 3, name: "社区元老", desc: "入驻满一年", icon: Award, color: "var(--profile-accent)", glow: "var(--profile-accent-glow)" },
];

const NAV_ITEMS = [
  { id: "posts", label: "我的帖子", icon: FileText, href: "#" },
  { id: "collections", label: "我的收藏", icon: Bookmark, href: "#" },
  { id: "comments", label: "我的评论", icon: MessageCircle, href: "#" },
  { id: "likes", label: "我的点赞", icon: Heart, href: "#" },
];

// --- 动画变体 ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// --- 子组件 ---

function StatCard({ stat, index }: { stat: typeof STATS_DATA[0]; index: number }) {
  const Icon = stat.icon;
  const isPositive = stat.trend >= 0;

  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--profile-card)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--profile-card-border)",
      }}
    >
      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          border: "1px solid var(--profile-card-hover-border)",
          boxShadow: "var(--profile-shadow-card-hover)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: "var(--profile-primary-light)",
              border: "1px solid var(--profile-primary-glow)",
            }}
          >
            <Icon className="w-5 h-5" style={{ color: "var(--profile-primary)" }} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-green-400" : "text-red-400"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(stat.trend)}%
          </div>
        </div>

        <div className="text-2xl font-bold font-mono" style={{ color: "var(--profile-text-primary)" }}>
          {stat.value.toLocaleString()}
        </div>
        <div className="text-sm mt-1" style={{ color: "var(--profile-text-tertiary)" }}>
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

function ActivityItem({ activity, index }: { activity: typeof ACTIVITY_DATA[0]; index: number }) {
  const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
    post: { label: "发布", color: "var(--profile-primary)", bg: "var(--profile-primary-light)" },
    comment: { label: "评论", color: "var(--profile-highlight)", bg: "var(--profile-highlight-light)" },
    like: { label: "点赞", color: "var(--profile-accent)", bg: "var(--profile-accent-light)" },
    collect: { label: "收藏", color: "var(--profile-success)", bg: "var(--profile-success-light)" },
  };

  const config = typeConfig[activity.type];

  return (
    <motion.div
      variants={itemVariants}
      className="group flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/[0.03] cursor-pointer"
    >
      {/* 时间线节点 */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: config.color, boxShadow: `0 0 8px ${config.color}` }}
        />
        {index < ACTIVITY_DATA.length - 1 && (
          <div className="w-px h-full min-h-[40px] bg-white/10" />
        )}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{ color: config.color, background: config.bg }}
          >
            {config.label}
          </span>
          <span className="text-xs" style={{ color: "var(--profile-text-disabled)" }}>
            {activity.date}
          </span>
        </div>
        <p className="text-sm font-medium truncate group-hover:text-[var(--profile-primary)] transition-colors"
          style={{ color: "var(--profile-text-secondary)" }}
        >
          {activity.title}
        </p>
      </div>

      {/* 热度 */}
      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--profile-text-tertiary)" }}>
        <Zap className="w-3.5 h-3.5" style={{ color: activity.heat > 80 ? "var(--profile-accent)" : undefined }} />
        {activity.heat}
      </div>
    </motion.div>
  );
}

function BadgeCard({ badge }: { badge: typeof BADGES_DATA[0] }) {
  const Icon = badge.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="group relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "var(--profile-card)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--profile-card-border)",
      }}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${badge.color}15`,
          border: `1px solid ${badge.glow}`,
          boxShadow: `0 0 20px ${badge.glow}`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color: badge.color }} />
      </div>
      <div>
        <div className="text-sm font-semibold" style={{ color: "var(--profile-text-primary)" }}>
          {badge.name}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--profile-text-tertiary)" }}>
          {badge.desc}
        </div>
      </div>
    </motion.div>
  );
}

function NavItem({ item, isActive, onClick }: { item: typeof NAV_ITEMS[0]; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "text-white"
          : "hover:bg-white/[0.03]"
      )}
      style={{
        color: isActive ? undefined : "var(--profile-text-tertiary)",
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeNavBg"
          className="absolute inset-0 rounded-xl"
          style={{
            background: "var(--profile-primary-light)",
            border: "1px solid var(--profile-primary-glow)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-5 h-5 relative z-10" style={{ color: isActive ? "var(--profile-primary)" : undefined }} />
      <span className="relative z-10">{item.label}</span>
      {isActive && (
        <ChevronRight className="w-4 h-4 ml-auto relative z-10" style={{ color: "var(--profile-primary)" }} />
      )}
    </button>
  );
}

// --- Toast 提示组件 ---

function ProfileToast({ message, type, isVisible, onClose }: {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "profile-toast",
        type === "success" ? "profile-toast-success" : "profile-toast-error"
      )}
    >
      <div className="profile-toast-content">
        {type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        {message}
      </div>
    </motion.div>
  );
}

// --- 头像上传与裁剪组件 ---

function AvatarUpload({ currentAvatar, onAvatarChange }: {
  currentAvatar: string | null;
  onAvatarChange: (avatar: string) => void;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: "图片大小不能超过5MB", type: "error" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleConfirmCrop = useCallback(() => {
    if (previewImage) {
      // 模拟上传延迟
      setTimeout(() => {
        onAvatarChange(previewImage);
        setIsCropping(false);
        setPreviewImage(null);
        setToast({ message: "头像更新成功", type: "success" });
      }, 800);
    }
  }, [previewImage, onAvatarChange]);

  const handleCancelCrop = useCallback(() => {
    setIsCropping(false);
    setPreviewImage(null);
  }, []);

  return (
    <>
      {/* 头像容器 */}
      <div className="avatar-wrapper" onClick={handleAvatarClick}>
        {currentAvatar ? (
          <img src={currentAvatar} alt="头像" className="avatar-image" />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold text-white"
            style={{ background: "var(--profile-gradient-primary)" }}
          >
            {USER_DATA.name.slice(0, 1)}
          </div>
        )}
        {/* 编辑按钮 */}
        <div className="avatar-edit">
          <Pencil className="w-4 h-4 text-white" />
        </div>
        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="profile-cover-input"
          onChange={handleFileChange}
        />
      </div>

      {/* 裁剪模态框 */}
      <AnimatePresence>
        {isCropping && previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="avatar-crop-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="avatar-crop-container"
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: "var(--profile-text-primary)" }}>
                裁剪头像
              </h3>

              {/* 裁剪区域 */}
              <div className="avatar-crop-area">
                <img
                  src={previewImage}
                  alt="预览"
                  className="avatar-crop-image"
                />
                <div className="avatar-crop-mask" />
              </div>

              {/* 操作按钮 */}
              <div className="avatar-crop-actions">
                <button
                  className="avatar-crop-btn avatar-crop-btn-cancel"
                  onClick={handleCancelCrop}
                >
                  取消
                </button>
                <button
                  className="avatar-crop-btn avatar-crop-btn-confirm"
                  onClick={handleConfirmCrop}
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  确认
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast 提示 */}
      <AnimatePresence>
        {toast && (
          <ProfileToast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --- 封面区域组件 ---

function ProfileHeader() {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div
      className={cn(
        "profile-header",
        !coverImage && "profile-header-default"
      )}
    >
      {/* 自定义封面图片 */}
      {coverImage && (
        <img
          src={coverImage}
          alt="封面"
          className="profile-header-image"
        />
      )}

      {/* 粒子纹理叠加 - 默认背景时显示 */}
      {!coverImage && <div className="profile-header-pattern" />}

      {/* 粒子背景 - 默认背景时显示 */}
      {!coverImage && (
        <div className="absolute inset-0">
          <ParticleBackground
            primaryColor="var(--profile-primary)"
            highlightColor="var(--profile-highlight)"
            particleCount={200}
            glowPosition={{ x: 0.5, y: 0.3 }}
          />
        </div>
      )}

      {/* 遮罩 - 保证文字可读性 */}
      <div className="profile-header-overlay" />

      {/* 更换封面按钮 */}
      <button
        className="profile-cover-btn"
        onClick={handleCoverClick}
        type="button"
      >
        <Camera className="w-4 h-4" />
        更换封面
      </button>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="profile-cover-input"
        onChange={handleFileChange}
      />

      {/* 用户信息 - 叠加在封面上 */}
      <div className="absolute inset-0 flex items-end pb-6">
        <div className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-end gap-5"
          >
            {/* 头像 - 带上传功能 */}
            <AvatarUpload currentAvatar={avatar} onAvatarChange={setAvatar} />

            {/* 用户信息 */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--profile-text-primary)" }}>
                  {USER_DATA.name}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--profile-primary-light)",
                    color: "var(--profile-primary)",
                    border: "1px solid var(--profile-primary-glow)",
                  }}
                >
                  {USER_DATA.level}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--profile-text-tertiary)" }}>
                {USER_DATA.handle} · {USER_DATA.bio}
              </p>
            </div>

            {/* 编辑按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--profile-primary-light)",
                color: "var(--profile-primary)",
                border: "1px solid var(--profile-primary-glow)",
              }}
            >
              <Edit3 className="w-4 h-4" />
              编辑资料
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- 主页面组件 ---

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "var(--profile-bg)" }}
    >
      {/* 封面区域 */}
      <ProfileHeader />

      {/* 主内容区 */}
      <div
        ref={sectionRef}
        className="max-w-[var(--container-max-width)] mx-auto px-4 md:px-6 lg:px-8 pb-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* 左侧导航栏 */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div
              className="sticky top-24 rounded-2xl p-4"
              style={{
                background: "var(--profile-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--profile-card-border)",
              }}
            >
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <Link href="/profile/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-[var(--profile-text-tertiary)] hover:text-[var(--profile-text-primary)] hover:bg-white/[0.03]"
                  >
                    <Settings className="w-4 h-4" />
                    设置
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 中间内容区 */}
          <div className="lg:col-span-6 space-y-6">
            {/* 数据统计卡片 */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STATS_DATA.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </motion.div>

            {/* 动态时间线 */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-5"
              style={{
                background: "var(--profile-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--profile-card-border)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold" style={{ color: "var(--profile-text-primary)" }}>
                  最近动态
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--profile-primary)] hover:text-[var(--profile-highlight)] hover:bg-[var(--profile-primary-light)]"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-1">
                {ACTIVITY_DATA.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* 右侧数据面板 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 成就徽章 */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-5"
              style={{
                background: "var(--profile-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--profile-card-border)",
              }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--profile-text-primary)" }}>
                成就徽章
              </h2>
              <div className="space-y-3">
                {BADGES_DATA.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </motion.div>

            {/* 活跃度环形图 */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-5"
              style={{
                background: "var(--profile-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--profile-card-border)",
              }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--profile-text-primary)" }}>
                活跃度
              </h2>
              <div className="flex items-center justify-center">
                <ActivityRing score={87} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold font-mono" style={{ color: "var(--profile-primary)" }}>87</div>
                  <div className="text-xs mt-1" style={{ color: "var(--profile-text-tertiary)" }}>综合评分</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono" style={{ color: "var(--profile-success)" }}>Top 5%</div>
                  <div className="text-xs mt-1" style={{ color: "var(--profile-text-tertiary)" }}>社区排名</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- 活跃度环形图组件 ---

function ActivityRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 70;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="activityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--profile-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--profile-highlight)" />
          </linearGradient>
        </defs>

        {/* 背景圆环 */}
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />

        {/* 进度圆环 */}
        <motion.circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="url(#activityGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
        />
      </svg>

      {/* 中心分数 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: "var(--profile-text-primary)" }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: "var(--profile-text-tertiary)" }}>
          / 100
        </span>
      </div>
    </div>
  );
}
