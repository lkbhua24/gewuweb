"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { PhoneDetailHeader } from "@/components/phones/phone-detail-header";
import { ScoreRadarChart } from "@/components/phones/score-radar-chart";
import { CategoryDetailPanel } from "@/components/phones/category-detail-panel";
import { ReviewCapsuleList, MOCK_REVIEWS } from "@/components/phones/review-capsule-card";
import { loadPersistedHeroState, useHeroTransition } from "@/hooks/use-hero-transition";
import { getPhonePrimaryColor } from "@/lib/color-theme";
import type { PhoneRanking, RankingType } from "@/types/ranking";
import { RANKING_CATEGORIES } from "@/types/ranking";
import { MOCK_RANKINGS } from "@/app/ranking/page";

// ============================================================================
// 手机详情页 - 包含完整参数呈现、雷达图、评论
// 支持返回手势动画
// ============================================================================

export default function PhoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [hasHeroTransition, setHasHeroTransition] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<RankingType>("comprehensive");
  const [isReturning, setIsReturning] = useState(false);
  const contentControls = useAnimation();
  const { state: heroState } = useHeroTransition();

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      // 检查是否有 Hero 转场状态
      const persisted = loadPersistedHeroState();
      if (persisted && persisted.targetPhoneId === id) {
        setHasHeroTransition(true);
        // 从持久化状态恢复榜单维度
        if (persisted.phoneData?.scoreLabel) {
          const category = RANKING_CATEGORIES.find(
            (c) => c.label === persisted.phoneData?.scoreLabel
          );
          if (category) {
            setCurrentCategory(category.id);
          }
        }
      }
    });
  }, [params]);

  // 监听返回状态
  useEffect(() => {
    if (heroState.phase === "returning") {
      setIsReturning(true);
      // 内容区向下淡出
      contentControls.start({
        opacity: 0,
        y: 40,
        transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
      });
    }
  }, [heroState.phase, contentControls]);

  // 从 mock 数据中获取手机信息
  const phone = useMemo(() => {
    if (!id) return null;
    for (const category of Object.keys(MOCK_RANKINGS) as RankingType[]) {
      const found = MOCK_RANKINGS[category].find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  const themeColor = phone ? getPhonePrimaryColor(phone.brand) : "#00D9FF";

  if (!id) return null;

  // 如果没有找到手机数据，显示基础信息
  const displayPhone: PhoneRanking = phone || {
    id,
    brand: "品牌",
    model: `手机型号 #${id}`,
    priceCny: 5999,
    rank: 1,
    screenType: "flat",
    imageUrl: null,
    scores: {
      overall: 9.2,
      performance: 9.5,
      screen: 9.0,
      battery: 8.5,
      camera: 9.3,
      buildQuality: 9.1,
      appearance: 8.8,
      valueForMoney: 8.2,
      userExperience: 9.0,
      heat: 8.7,
      discussion: 8.9,
    },
    colorOptions: [
      { id: "default", name: "默认色", hex: "#00D9FF", isDefault: true },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0f111a]">
      {/* 头部区域 - Hero 转场目标 */}
      <PhoneDetailHeader phoneId={id} />

      {/* 内容区域 - 阶段二：从底部滑入 / 返回时向下淡出 */}
      <motion.div
        className="px-4 py-6 max-w-4xl mx-auto"
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={isReturning ? contentControls : {
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: hasHeroTransition ? 0.3 : 0,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* 主体内容：雷达图 + 维度详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 左侧：雷达图 */}
          <motion.div
            className="bg-[#151821] rounded-xl border border-white/5 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isReturning ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: hasHeroTransition ? 0.35 : 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/80 font-ranking-cn">
                多维度评分
              </h3>
              <Badge
                variant="secondary"
                className="text-[10px] bg-white/5 text-white/50 border-white/[0.06]"
              >
                {RANKING_CATEGORIES.find((c) => c.id === currentCategory)?.label}
              </Badge>
            </div>
            <ScoreRadarChart
              scores={displayPhone.scores}
              currentCategory={currentCategory}
              themeColor={themeColor}
            />
          </motion.div>

          {/* 右侧：当前榜单维度详情 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isReturning ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              delay: hasHeroTransition ? 0.4 : 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <CategoryDetailPanel
              phone={displayPhone}
              category={currentCategory}
              themeColor={themeColor}
            />
          </motion.div>
        </div>

        {/* Tabs 区域：参数 / 评价 / 好价 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isReturning ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: hasHeroTransition ? 0.45 : 0.15,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="w-full bg-[#151821] border border-white/5 h-11">
              <TabsTrigger
                value="specs"
                className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-ranking-cn"
              >
                参数规格
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-ranking-cn"
              >
                用户评价
              </TabsTrigger>
              <TabsTrigger
                value="deals"
                className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white text-xs font-ranking-cn"
              >
                好价信息
              </TabsTrigger>
            </TabsList>

            {/* 参数规格 */}
            <TabsContent value="specs" className="mt-4">
              <Card className="bg-[#151821] border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white/70 font-ranking-cn">
                    基本参数
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <SpecItem label="品牌" value={displayPhone.brand} />
                    <SpecItem label="型号" value={displayPhone.model} />
                    <SpecItem label="价格" value={`¥${displayPhone.priceCny?.toLocaleString() || "-"}`} />
                    <SpecItem label="屏幕类型" value={displayPhone.screenType === "foldable" ? "折叠屏" : displayPhone.screenType === "curved" ? "曲面屏" : displayPhone.screenType === "waterfall" ? "瀑布屏" : "直屏"} />
                    <SpecItem label="综合评分" value={displayPhone.scores.overall.toFixed(1)} themeColor={themeColor} />
                    <SpecItem label="性能评分" value={displayPhone.scores.performance.toFixed(1)} />
                    <SpecItem label="影像评分" value={displayPhone.scores.camera.toFixed(1)} />
                    <SpecItem label="续航评分" value={displayPhone.scores.battery.toFixed(1)} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 用户评价 - 胶囊评论卡片 */}
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/80 font-ranking-cn">
                    用户评价
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white/40 hover:text-white/70 h-7"
                  >
                    查看全部
                    <ChevronRight className="size-3 ml-1" />
                  </Button>
                </div>
                <ReviewCapsuleList reviews={MOCK_REVIEWS} themeColor={themeColor} />
              </div>
            </TabsContent>

            {/* 好价信息 */}
            <TabsContent value="deals" className="mt-4">
              <Card className="bg-[#151821] border-white/5">
                <CardContent className="py-8 text-center">
                  <ShoppingCart className="size-8 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/40 font-ranking-cn mb-1">
                    暂无好价信息
                  </p>
                  <p className="text-xs text-white/20 font-ranking-cn">
                    连接电商平台后将展示实时价格
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// 参数项组件
// ============================================================================

function SpecItem({
  label,
  value,
  themeColor,
}: {
  label: string;
  value: string;
  themeColor?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5">
      <span className="text-xs text-white/40 font-ranking-cn">{label}</span>
      <span
        className="text-sm text-white/80 font-ranking-cn"
        style={themeColor ? { color: themeColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
