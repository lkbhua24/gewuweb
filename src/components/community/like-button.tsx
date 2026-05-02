"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  initialLikes: number;
  initialLiked?: boolean;
}

// 粒子配置：6-8个小圆点
const PARTICLES = 8;
const particleColors = [
  "#ec4899", // 品红
  "#f472b6", // 粉红
  "#fb7185", // 玫瑰
  "#fbbf24", // 琥珀
  "#f59e0b", // 橙
];

export function LikeButton({ initialLikes, initialLiked = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [showParticles, setShowParticles] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);

  const handleLike = () => {
    if (!liked) {
      // 点赞
      setLiked(true);
      setLikes(likes + 1);
      setShowParticles(true);
      setShowPlusOne(true);

      // 粒子动画结束后重置
      setTimeout(() => setShowParticles(false), 600);
      // +1 数字动画结束后重置
      setTimeout(() => setShowPlusOne(false), 800);
    } else {
      // 取消点赞
      setLiked(false);
      setLikes(likes - 1);
    }
  };

  // 生成粒子
  const generateParticles = () => {
    return Array.from({ length: PARTICLES }).map((_, i) => {
      const angle = (360 / PARTICLES) * i;
      const distance = 30 + Math.random() * 15;
      const color = particleColors[i % particleColors.length];

      return (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            left: "50%",
            top: "50%",
            marginLeft: -4,
            marginTop: -4,
          }}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            x: Math.cos((angle * Math.PI) / 180) * distance,
            y: Math.sin((angle * Math.PI) / 180) * distance,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      );
    });
  };

  return (
    <button
      onClick={handleLike}
      className="relative flex items-center gap-1.5 text-xs transition-colors"
      style={{ color: liked ? "#ec4899" : "rgba(255,255,255,0.5)" }}
    >
      {/* 粒子容器 */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {generateParticles()}
          </div>
        )}
      </AnimatePresence>

      {/* 心形图标 */}
      <motion.div
        animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          times: [0, 0.5, 1],
        }}
      >
        <Heart
          className="w-4 h-4"
          fill={liked ? "#ec4899" : "none"}
          stroke={liked ? "#ec4899" : "currentColor"}
        />
      </motion.div>

      {/* 点赞数 */}
      <span>{likes}</span>

      {/* +1 上浮淡出 */}
      <AnimatePresence>
        {showPlusOne && (
          <motion.span
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-[#ec4899]"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
