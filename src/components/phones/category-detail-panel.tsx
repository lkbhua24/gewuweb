"use client";

import { motion } from "framer-motion";
import { Cpu, Camera, Battery, Monitor, Gem, Star, Coins, Flame, MessageCircle, Trophy } from "lucide-react";
import type { PhoneRanking, RankingType } from "@/types/ranking";
import { RANKING_CATEGORIES } from "@/types/ranking";

// ============================================================================
// 榜单维度专属详情面板
// 根据当前榜单维度展示对应的详细数据
// ============================================================================

interface CategoryDetailPanelProps {
  phone: PhoneRanking;
  category: RankingType;
  themeColor: string;
}

export function CategoryDetailPanel({ phone, category, themeColor }: CategoryDetailPanelProps) {
  const categoryInfo = RANKING_CATEGORIES.find((c) => c.id === category);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* 维度标题 */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1 h-5 rounded-full"
          style={{ backgroundColor: themeColor }}
        />
        <h3 className="text-sm font-medium text-white/80 font-ranking-cn">
          {categoryInfo?.label}详情
        </h3>
        <span className="text-xs text-white/30 font-ranking-cn">
          {categoryInfo?.subtitle}
        </span>
      </div>

      {/* 根据维度渲染不同内容 */}
      {category === "performance" && <PerformanceDetail phone={phone} themeColor={themeColor} />}
      {category === "camera" && <CameraDetail phone={phone} themeColor={themeColor} />}
      {category === "battery" && <BatteryDetail phone={phone} themeColor={themeColor} />}
      {category === "screen" && <ScreenDetail phone={phone} themeColor={themeColor} />}
      {category === "value" && <ValueDetail phone={phone} themeColor={themeColor} />}
      {category === "system" && <SystemDetail phone={phone} themeColor={themeColor} />}
      {category === "comprehensive" && <ComprehensiveDetail phone={phone} themeColor={themeColor} />}
    </motion.div>
  );
}

// ============================================================================
// 性能榜详情
// ============================================================================

function PerformanceDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const benchmark = phone.benchmark || 218;
  const chipset = phone.chipset || "A18 Pro";
  const cooling = phone.cooling || "VC液冷 + 石墨烯";

  // 模拟帧率数据
  const frameRates = [
    { game: "原神", fps: 59.2, temp: 42 },
    { game: "星铁", fps: 58.8, temp: 44 },
    { game: "王者荣耀", fps: 120, temp: 38 },
    { game: "和平精英", fps: 89.5, temp: 40 },
  ];

  return (
    <div className="space-y-4">
      {/* 跑分卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<Cpu className="size-4" />}
          label="跑分"
          value={`${benchmark}万`}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Cpu className="size-4" />}
          label="芯片"
          value={chipset}
          themeColor={themeColor}
          small
        />
        <MetricCard
          icon={<Flame className="size-4" />}
          label="散热"
          value={cooling}
          themeColor={themeColor}
          small
        />
      </div>

      {/* 帧率曲线 */}
      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">游戏帧率测试</h4>
        <div className="space-y-3">
          {frameRates.map((item) => (
            <div key={item.game} className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-16 font-ranking-cn">{item.game}</span>
              <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{ backgroundColor: `${themeColor}40` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.fps / 120) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <span className="text-[10px] font-ranking-num text-white/80">
                    {item.fps}fps
                  </span>
                </motion.div>
              </div>
              <span className="text-[10px] text-white/30 w-10 text-right font-ranking-num">
                {item.temp}°C
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 影像榜详情
// ============================================================================

function CameraDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const mainSensor = phone.mainSensor || "索尼 LYT-900";
  const focalLength = phone.focalLength || "13-120mm";

  const cameraSpecs = [
    { label: "主摄", value: mainSensor, aperture: "f/1.6" },
    { label: "长焦", value: "潜望 5x", aperture: "f/2.5" },
    { label: "超广角", value: "JN1", aperture: "f/2.2" },
    { label: "前置", value: "3200万", aperture: "f/2.0" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Camera className="size-4" />}
          label="主摄 CMOS"
          value={mainSensor}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Camera className="size-4" />}
          label="焦段覆盖"
          value={focalLength}
          themeColor={themeColor}
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">相机配置</h4>
        <div className="grid grid-cols-2 gap-3">
          {cameraSpecs.map((spec) => (
            <div key={spec.label} className="bg-white/5 rounded-lg p-3">
              <div className="text-[10px] text-white/40 mb-1">{spec.label}</div>
              <div className="text-sm text-white/80 font-ranking-cn">{spec.value}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{spec.aperture}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 续航榜详情
// ============================================================================

function BatteryDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const batteryLife = phone.batteryLife || 8.5;
  const chargingPower = phone.chargingPower || 120;
  const batteryCapacity = phone.batteryCapacity || 5500;

  // 模拟续航测试数据
  const usageData = [
    { scene: "视频播放", hours: 18.5 },
    { scene: "游戏", hours: 6.2 },
    { scene: "社交", hours: 12.8 },
    { scene: "待机", hours: 480 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={<Battery className="size-4" />}
          label="电池容量"
          value={`${batteryCapacity}mAh`}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Battery className="size-4" />}
          label="充电功率"
          value={`${chargingPower}W`}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Battery className="size-4" />}
          label="续航时长"
          value={`${batteryLife}h`}
          themeColor={themeColor}
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">场景续航测试</h4>
        <div className="space-y-3">
          {usageData.map((item) => (
            <div key={item.scene} className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-16 font-ranking-cn">{item.scene}</span>
              <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{ backgroundColor: `${themeColor}40` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((item.hours / 24) * 100, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <span className="text-[10px] font-ranking-num text-white/80">
                    {item.hours}h
                  </span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 屏幕榜详情
// ============================================================================

function ScreenDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const peakBrightness = phone.peakBrightness || 4500;
  const dimming = phone.dimming || "3840Hz PWM";

  const screenSpecs = [
    { label: "分辨率", value: "2K+" },
    { label: "刷新率", value: "1-120Hz LTPO" },
    { label: "亮度", value: `${peakBrightness}nit` },
    { label: "调光", value: dimming },
    { label: "色域", value: "100% DCI-P3" },
    { label: "材质", value: "三星 E7" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Monitor className="size-4" />}
          label="峰值亮度"
          value={`${peakBrightness}nit`}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Monitor className="size-4" />}
          label="调光方式"
          value={dimming}
          themeColor={themeColor}
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">屏幕参数</h4>
        <div className="grid grid-cols-3 gap-3">
          {screenSpecs.map((spec) => (
            <div key={spec.label} className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-[10px] text-white/40 mb-1">{spec.label}</div>
              <div className="text-sm text-white/80 font-ranking-cn">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 性价比榜详情
// ============================================================================

function ValueDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const priceTierRank = phone.priceTierRank || "同价位第 1 名";
  const priceDrop = phone.priceDrop || 800;

  const valueMetrics = [
    { label: "性能/价格比", score: 9.5 },
    { label: "功能完整性", score: 9.2 },
    { label: "品牌溢价", score: 7.8 },
    { label: "售后价值", score: 8.5 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Coins className="size-4" />}
          label="同价位排名"
          value={priceTierRank}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Coins className="size-4" />}
          label="降价幅度"
          value={`¥${priceDrop}`}
          themeColor={themeColor}
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">性价比分析</h4>
        <div className="space-y-3">
          {valueMetrics.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-20 font-ranking-cn">{item.label}</span>
              <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: `${themeColor}50` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.score / 10) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-white/50 w-8 text-right font-ranking-num">
                {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 系统榜详情
// ============================================================================

function SystemDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const systemMetrics = [
    { label: "流畅度", score: phone.scores.userExperience },
    { label: "功能丰富度", score: 9.0 },
    { label: "稳定性", score: 9.3 },
    { label: "更新支持", score: 8.8 },
    { label: "生态联动", score: 9.1 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Star className="size-4" />}
          label="综合体验"
          value={phone.scores.userExperience.toFixed(1)}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<MessageCircle className="size-4" />}
          label="用户口碑"
          value={phone.scores.discussion.toFixed(1)}
          themeColor={themeColor}
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">系统体验维度</h4>
        <div className="space-y-3">
          {systemMetrics.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-20 font-ranking-cn">{item.label}</span>
              <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: `${themeColor}50` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.score / 10) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-white/50 w-8 text-right font-ranking-num">
                {item.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 综合榜详情
// ============================================================================

function ComprehensiveDetail({ phone, themeColor }: { phone: PhoneRanking; themeColor: string }) {
  const weakPoint = phone.weakPoint || "性价比偏低";

  const dimensionScores = [
    { label: "性能", score: phone.scores.performance, icon: <Cpu className="size-3" /> },
    { label: "影像", score: phone.scores.camera, icon: <Camera className="size-3" /> },
    { label: "续航", score: phone.scores.battery, icon: <Battery className="size-3" /> },
    { label: "屏幕", score: phone.scores.screen, icon: <Monitor className="size-3" /> },
    { label: "质感", score: phone.scores.buildQuality, icon: <Gem className="size-3" /> },
    { label: "体验", score: phone.scores.userExperience, icon: <Star className="size-3" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Trophy className="size-4" />}
          label="综合评分"
          value={phone.scores.overall.toFixed(1)}
          themeColor={themeColor}
        />
        <MetricCard
          icon={<Gem className="size-4" />}
          label="短板提示"
          value={weakPoint}
          themeColor={themeColor}
          small
        />
      </div>

      <div className="bg-surface-card rounded-xl border border-white/5 p-4">
        <h4 className="text-xs text-white/50 font-ranking-cn mb-3">各维度得分</h4>
        <div className="grid grid-cols-3 gap-3">
          {dimensionScores.map((item) => (
            <div key={item.label} className="bg-white/5 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-white/40 mb-1">
                {item.icon}
                <span className="text-[10px]">{item.label}</span>
              </div>
              <div
                className="text-lg font-ranking-num font-bold"
                style={{ color: themeColor }}
              >
                {item.score.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 通用指标卡片
// ============================================================================

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  themeColor: string;
  small?: boolean;
}

function MetricCard({ icon, label, value, themeColor, small }: MetricCardProps) {
  return (
    <motion.div
      className="bg-surface-card rounded-xl border border-white/5 p-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 text-white/40 mb-1.5">
        {icon}
        <span className="text-[10px] font-ranking-cn">{label}</span>
      </div>
      <div
        className={`font-ranking-cn font-semibold text-white/90 ${small ? "text-xs" : "text-sm"}`}
      >
        {value}
      </div>
    </motion.div>
  );
}
