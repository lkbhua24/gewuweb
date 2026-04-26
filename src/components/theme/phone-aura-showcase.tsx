"use client";

import { useState } from "react";
import {
  type PhoneColorProfile,
  createPhoneColorProfile,
  PRESET_AURA_THEMES,
  hexToHsb,
  generateAuraColor,
} from "@/lib/color-theme";
import { AuraBackground, AuraCard, AuraText, AuraButton } from "./aura-background";
import { cn } from "@/lib/utils";

// ============================================================================
// 手机氛围色展示组件 - 用于演示和测试
// ============================================================================

const DEMO_PHONES = [
  { brand: "Apple", model: "iPhone 16 Pro", color: "#555555" },
  { brand: "Samsung", model: "Galaxy S24 Ultra", color: "#1428A0" },
  { brand: "Xiaomi", model: "14 Ultra", color: "#FF6900" },
  { brand: "OPPO", model: "Find X7 Ultra", color: "#009B77" },
  { brand: "vivo", model: "X100 Pro", color: "#415FFF" },
  { brand: "Huawei", model: "Mate 60 Pro", color: "#CF0A2C" },
  { brand: "OnePlus", model: "12", color: "#F50514" },
  { brand: "Google", model: "Pixel 8 Pro", color: "#4285F4" },
  { brand: "Sony", model: "Xperia 1 VI", color: "#000000" },
  { brand: "Nothing", model: "Phone (2)", color: "#000000" },
];

export function PhoneAuraShowcase() {
  const [selectedPhone, setSelectedPhone] = useState(DEMO_PHONES[0]);
  const [customHex, setCustomHex] = useState("#00D9FF");
  const [saturationRatio, setSaturationRatio] = useState(0.25);
  const [brightnessTarget, setBrightnessTarget] = useState(96);

  const profile: PhoneColorProfile = createPhoneColorProfile(
    selectedPhone.brand,
    selectedPhone.model,
    selectedPhone.color
  );

  const customProfile: PhoneColorProfile = createPhoneColorProfile(
    "自定义",
    "颜色",
    customHex
  );

  const hsb = hexToHsb(selectedPhone.color);
  const auraColorPreview = generateAuraColor(selectedPhone.color, {
    saturationRatio,
    brightnessTarget,
    opacity: 0.5,
  });

  return (
    <div className="space-y-8 p-6">
      {/* 标题 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">一机一色 · 动态主题色彩系统</h2>
        <p className="text-sm text-gray-400">
          从手机官方主视觉提取 HEX 主色，转换为 HSB 后生成专属氛围色
        </p>
      </div>

      {/* 手机选择器 */}
      <div className="grid grid-cols-5 gap-2">
        {DEMO_PHONES.map((phone) => (
          <button
            key={`${phone.brand}-${phone.model}`}
            onClick={() => setSelectedPhone(phone)}
            className={cn(
              "p-3 rounded-xl text-xs text-center transition-all duration-200",
              "border border-white/10 hover:border-white/20",
              selectedPhone.brand === phone.brand && selectedPhone.model === phone.model
                ? "bg-white/10 border-white/30"
                : "bg-white/5"
            )}
          >
            <div
              className="w-6 h-6 rounded-full mx-auto mb-1"
              style={{ backgroundColor: phone.color }}
            />
            <div className="text-white font-medium">{phone.brand}</div>
            <div className="text-gray-500 truncate">{phone.model}</div>
          </button>
        ))}
      </div>

      {/* 主展示区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧: 色彩转换详情 */}
        <AuraCard
          brand={selectedPhone.brand}
          model={selectedPhone.model}
          customHex={selectedPhone.color}
          variant="glass"
          className="p-6"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              {selectedPhone.brand} {selectedPhone.model}
            </h3>

            {/* 颜色转换流程 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">原色 HEX</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: selectedPhone.color }}
                  />
                  <code className="text-sm text-cyan-400">{selectedPhone.color}</code>
                </div>
              </div>

              {hsb && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-16">HSB 值</span>
                  <code className="text-sm text-purple-400">
                    H:{hsb.h}° S:{hsb.s}% B:{hsb.b}%
                  </code>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">氛围色</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: auraColorPreview }}
                  />
                  <code className="text-sm text-emerald-400 text-xs truncate max-w-[200px]">
                    {auraColorPreview}
                  </code>
                </div>
              </div>
            </div>

            {/* 转换规则可视化 */}
            <div className="mt-4 p-4 rounded-xl bg-black/30 space-y-3">
              <div className="text-xs text-gray-500 mb-2">转换规则</div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">饱和度比例</span>
                  <span className="text-cyan-400">{Math.round(saturationRatio * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={saturationRatio * 100}
                  onChange={(e) => setSaturationRatio(Number(e.target.value) / 100)}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">亮度目标</span>
                  <span className="text-cyan-400">{brightnessTarget}%</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  value={brightnessTarget}
                  onChange={(e) => setBrightnessTarget(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </AuraCard>

        {/* 右侧: 实时预览 */}
        <div className="space-y-4">
          <AuraBackground
            brand={selectedPhone.brand}
            model={selectedPhone.model}
            customHex={selectedPhone.color}
            intensity="normal"
            className="rounded-2xl h-48 flex items-center justify-center"
          >
            <div className="text-center space-y-2">
              <AuraText
                brand={selectedPhone.brand}
                model={selectedPhone.model}
                customHex={selectedPhone.color}
                gradient
                className="text-2xl font-bold"
              >
                氛围晕染效果
              </AuraText>
              <p className="text-sm text-white/60">底层光晕 · 柔和晕染</p>
            </div>
          </AuraBackground>

          <div className="grid grid-cols-2 gap-4">
            <AuraCard
              brand={selectedPhone.brand}
              model={selectedPhone.model}
              customHex={selectedPhone.color}
              variant="default"
              className="p-4"
            >
              <div className="text-xs text-gray-500 mb-2">卡片样式</div>
              <AuraText
                brand={selectedPhone.brand}
                model={selectedPhone.model}
                customHex={selectedPhone.color}
                className="text-sm font-medium"
              >
                默认卡片
              </AuraText>
            </AuraCard>

            <AuraCard
              brand={selectedPhone.brand}
              model={selectedPhone.model}
              customHex={selectedPhone.color}
              variant="outline"
              className="p-4"
            >
              <div className="text-xs text-gray-500 mb-2">边框样式</div>
              <AuraText
                brand={selectedPhone.brand}
                model={selectedPhone.model}
                customHex={selectedPhone.color}
                className="text-sm font-medium"
              >
                轮廓卡片
              </AuraText>
            </AuraCard>
          </div>

          <div className="flex gap-3">
            <AuraButton
              brand={selectedPhone.brand}
              model={selectedPhone.model}
              customHex={selectedPhone.color}
              variant="filled"
              className="flex-1"
            >
              填充按钮
            </AuraButton>
            <AuraButton
              brand={selectedPhone.brand}
              model={selectedPhone.model}
              customHex={selectedPhone.color}
              variant="outline"
              className="flex-1"
            >
              轮廓按钮
            </AuraButton>
            <AuraButton
              brand={selectedPhone.brand}
              model={selectedPhone.model}
              customHex={selectedPhone.color}
              variant="ghost"
              className="flex-1"
            >
              幽灵按钮
            </AuraButton>
          </div>
        </div>
      </div>

      {/* 自定义颜色测试 */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">自定义颜色测试</h3>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            className="w-12 h-12 rounded-xl border border-white/20 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm w-32"
          />
          <AuraBackground
            customHex={customHex}
            intensity="subtle"
            className="flex-1 h-12 rounded-xl flex items-center px-4"
          >
            <span className="text-sm text-white/80">实时预览: {customHex}</span>
          </AuraBackground>
        </div>
      </div>

      {/* 预设主题 */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">预设主题</h3>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(PRESET_AURA_THEMES).map(([key, theme]) => (
            <AuraBackground
              key={key}
              customHex={theme.auraColor}
              intensity="subtle"
              className="p-4 rounded-xl"
            >
              <div className="text-xs text-white/60 capitalize">{key.replace("-", " ")}</div>
              <div
                className="mt-2 h-8 rounded-lg"
                style={{ background: theme.auraGradient }}
              />
            </AuraBackground>
          ))}
        </div>
      </div>
    </div>
  );
}
