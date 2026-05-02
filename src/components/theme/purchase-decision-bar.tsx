"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CreditCard, Heart, Bell, Smartphone, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 模块五：购买决策入口
// ============================================================================

interface PhoneConfig {
  model: string;
  color: string;
  colorCode: string;
  variant: string;
  price: number;
}

interface TradeInDevice {
  brand: string;
  model: string;
  estimatedValue: number;
}

interface PurchaseDecisionBarProps {
  phone?: PhoneConfig;
  themeColor?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onFavorite?: (isFavorite: boolean) => void;
}

const DEFAULT_PHONE: PhoneConfig = {
  model: "Galaxy S25 Ultra",
  color: "钛蓝",
  colorCode: "#A8C8EC",
  variant: "12GB+512GB",
  price: 9699,
};

const TRADE_IN_DEVICES: TradeInDevice[] = [
  { brand: "Samsung", model: "Galaxy S24 Ultra", estimatedValue: 4500 },
  { brand: "Samsung", model: "Galaxy S23 Ultra", estimatedValue: 3200 },
  { brand: "Apple", model: "iPhone 15 Pro Max", estimatedValue: 4800 },
  { brand: "Apple", model: "iPhone 14 Pro Max", estimatedValue: 3500 },
  { brand: "Xiaomi", model: "14 Ultra", estimatedValue: 2800 },
  { brand: "OPPO", model: "Find X7 Ultra", estimatedValue: 2500 },
];

export function PurchaseDecisionBar({
  phone = DEFAULT_PHONE,
  themeColor = "#00D9FF",
  onAddToCart,
  onBuyNow,
  onFavorite,
}: PurchaseDecisionBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [showTradeIn, setShowTradeIn] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [priceAlertSet, setPriceAlertSet] = useState(false);
  const [selectedTradeIn, setSelectedTradeIn] = useState<TradeInDevice | null>(null);

  // 滚动检测显示购买栏
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const shouldShow = scrollY > 300 || scrollY + windowHeight > documentHeight - 500;
          setIsVisible(shouldShow);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFavorite = useCallback(() => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavorite?.(newState);
  }, [isFavorite, onFavorite]);

  const handleSetPriceAlert = () => {
    if (targetPrice && Number(targetPrice) < phone.price) {
      setPriceAlertSet(true);
      setTimeout(() => {
        setShowPriceAlert(false);
        setPriceAlertSet(false);
        setTargetPrice("");
      }, 2000);
    }
  };

  const finalPrice = selectedTradeIn 
    ? phone.price - selectedTradeIn.estimatedValue 
    : phone.price;

  return (
    <>
      {/* 底部固定购买栏 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a14]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                {/* 左侧：商品信息 */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-white/20"
                    style={{ backgroundColor: phone.colorCode }}
                  />
                  <div className="hidden sm:block">
                    <div className="text-sm text-white font-medium">
                      {phone.model} · {phone.color}
                    </div>
                    <div className="text-xs text-gray-400">{phone.variant}</div>
                  </div>
                </div>

                {/* 中间：价格 */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-400">¥</span>
                  <span className="text-xl font-bold text-white">
                    {finalPrice.toLocaleString()}
                  </span>
                  {selectedTradeIn && (
                    <span className="text-xs text-green-400 ml-2">
                      省¥{selectedTradeIn.estimatedValue}
                    </span>
                  )}
                </div>

                {/* 右侧：操作按钮 */}
                <div className="flex items-center gap-2">
                  {/* 降价提醒 */}
                  <motion.button
                    onClick={() => setShowPriceAlert(true)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${themeColor}20` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">降价提醒</span>
                  </motion.button>

                  {/* 以旧换新 */}
                  <motion.button
                    onClick={() => setShowTradeIn(true)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${themeColor}20` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">以旧换新</span>
                  </motion.button>

                  {/* 加入购物车 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddToCart}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">加入购物车</span>
                  </motion.button>

                  {/* 立即购买 */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: `0 4px 20px ${themeColor}60`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBuyNow}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-medium text-sm transition-shadow duration-200"
                    style={{
                      backgroundColor: themeColor,
                      color: "#0a0a14",
                      boxShadow: `0 0 0 ${themeColor}40`
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>立即购买</span>
                  </motion.button>

                  {/* 收藏 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFavorite}
                    className={cn(
                      "p-2 rounded-lg border transition-colors",
                      isFavorite
                        ? "bg-red-500/20 border-red-500/50 text-red-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 降价提醒弹窗 */}
      <AnimatePresence>
        {showPriceAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowPriceAlert(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-2xl border border-white/10 p-6 w-full max-w-md"
            >
              {priceAlertSet ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">设置成功</h3>
                  <p className="text-gray-400">降价至 ¥{targetPrice} 时我们将通知您</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4">降价提醒</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    当前价格 ¥{phone.price.toLocaleString()}，设置目标价格，降价时推送通知
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">目标价格</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                        <input
                          type="number"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          placeholder="输入目标价格"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-8 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                        />
                      </div>
                      {targetPrice && Number(targetPrice) >= phone.price && (
                        <p className="text-red-400 text-xs mt-2">目标价格需低于当前价格</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowPriceAlert(false)}
                        className="flex-1 py-3 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSetPriceAlert}
                        disabled={!targetPrice || Number(targetPrice) >= phone.price}
                        className="flex-1 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: themeColor,
                          color: "#0a0a14",
                        }}
                      >
                        确认设置
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 以旧换新弹窗 */}
      <AnimatePresence>
        {showTradeIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowTradeIn(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-2xl border border-white/10 p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold text-white mb-2">以旧换新</h3>
              <p className="text-gray-400 text-sm mb-4">选择您的旧机型，自动计算抵扣金额</p>
              
              <div className="space-y-2 mb-6">
                {TRADE_IN_DEVICES.map((device) => (
                  <button
                    key={`${device.brand}-${device.model}`}
                    onClick={() => setSelectedTradeIn(selectedTradeIn?.model === device.model ? null : device)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                      selectedTradeIn?.model === device.model
                        ? "bg-white/10 border-white/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <div className="text-left">
                      <div className="text-white font-medium">{device.brand}</div>
                      <div className="text-sm text-gray-400">{device.model}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        抵扣 ¥{device.estimatedValue.toLocaleString()}
                      </div>
                      {selectedTradeIn?.model === device.model && (
                        <Check className="w-4 h-4 text-green-400 inline-block mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedTradeIn && (
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">原价</span>
                    <span className="text-white">¥{phone.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">旧机抵扣</span>
                    <span className="text-green-400">-¥{selectedTradeIn.estimatedValue.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">实付金额</span>
                    <span className="text-xl font-bold" style={{ color: themeColor }}>
                      ¥{finalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTradeIn(false);
                    setSelectedTradeIn(null);
                  }}
                  className="flex-1 py-3 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => setShowTradeIn(false)}
                  className="flex-1 py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: themeColor,
                    color: "#0a0a14",
                  }}
                >
                  确认
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// 演示组件
// ============================================================================

export function PurchaseDecisionBarDemo() {
  const [themeColor, setThemeColor] = useState("#00D9FF");
  const [showDemoContent, setShowDemoContent] = useState(false);

  const themes = [
    { name: "科技青", color: "#00D9FF" },
    { name: "钛蓝", color: "#A8C8EC" },
    { name: "钛灰", color: "#C5C0BC" },
    { name: "钛黑", color: "#1A1A1A" },
    { name: "钛雾金", color: "#E8D5B7" },
  ];

  const phones: Record<string, PhoneConfig> = {
    "#00D9FF": DEFAULT_PHONE,
    "#C4B5A0": { model: "iPhone 16 Pro", color: "沙漠钛金属", colorCode: "#C4B5A0", variant: "256GB", price: 8999 },
    "#2D5016": { model: "小米 15 Ultra", color: "经典黑银", colorCode: "#1A1A1A", variant: "16GB+512GB", price: 6499 },
  };

  return (
    <div className="min-h-screen bg-[#080c14] p-6">
      {/* 购买栏组件 */}
      <PurchaseDecisionBar
        phone={phones[themeColor] || DEFAULT_PHONE}
        themeColor={themeColor}
        onAddToCart={() => console.log("加入购物车")}
        onBuyNow={() => console.log("立即购买")}
        onFavorite={(isFav) => console.log("收藏:", isFav)}
      />

      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        {/* 标题 */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">购买决策入口</h1>
          <p className="text-gray-400">底部固定购买栏 + 降价提醒 + 以旧换新</p>
        </motion.div>

        {/* 主题切换 */}
        <motion.div
          className="flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {themes.map((theme) => (
            <button
              key={theme.color}
              onClick={() => setThemeColor(theme.color)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                themeColor === theme.color
                  ? "bg-white/20 border-white/40 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              )}
            >
              {theme.name}
            </button>
          ))}
        </motion.div>

        {/* 说明卡片 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FeatureCard
            icon={ShoppingCart}
            title="底部固定购买栏"
            description="滚动超过300px或接近底部时自动出现，包含商品信息、价格和操作按钮"
          />
          <FeatureCard
            icon={Bell}
            title="降价提醒"
            description="设置目标价格，当商品价格降至目标值时自动推送通知"
          />
          <FeatureCard
            icon={Smartphone}
            title="以旧换新"
            description="选择旧机型自动计算抵扣金额，实时显示实付价格"
          />
        </motion.div>

        {/* 演示说明 */}
        <motion.div
          className="bg-cyan-500/10 rounded-2xl border border-cyan-500/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">演示说明</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
              <span>向下滚动页面，底部购买栏会自动出现</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
              <span>点击"降价提醒"设置目标价格</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
              <span>点击"以旧换新"选择旧机型计算抵扣</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
              <span>切换主题色查看不同商品信息</span>
            </li>
          </ul>
        </motion.div>

        {/* 填充内容用于演示滚动 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">向下滚动查看购买栏</h3>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <h3 className="text-white font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
