"use client";

import { Card } from "@/components/ui/card";
import { PhoneSilhouetteSVG } from "./phone-silhouette-svg";
import { HeatBadge } from "./heat-badge";
import { CompareCheckbox } from "./compare-checkbox";
import { cn } from "@/lib/utils";
import { formatPrice, formatAvgPrice } from "@/lib/phone-utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Phone, PhoneOutlineType } from "@/types/phone-library";

interface PhoneCardProps {
  phone: Phone;
}

export function PhoneCard({ phone }: PhoneCardProps) {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  // 格式化参数显示
  const formatSpec = (value?: string) => {
    if (!value) return "";
    // 简化芯片名称
    return value
      .replace("骁龙 ", "")
      .replace("天玑 ", "")
      .replace("麒麟", "")
      .replace("Apple ", "");
  };

  const specItems = [
    formatSpec(phone.specs.chip),
    phone.specs.screen,
    phone.specs.battery
  ].filter(Boolean);

  // 从 outlineSVG 推断手机轮廓类型
  const getOutlineType = (svg: string): PhoneOutlineType => {
    if (svg.includes("triple")) return "triple-camera";
    if (svg.includes("quad")) return "quad-camera";
    if (svg.includes("foldable") || svg.includes("折叠")) return "foldable";
    if (svg.includes("curved") || svg.includes("曲面")) return "curved";
    return "flat";
  };

  const phoneType = getOutlineType(phone.outlineSVG);

  // 格式化价格显示（带均价后缀）
  const priceDisplay = formatAvgPrice(phone.price);

  // 点击进入详情页，记录来源为手机库
  const handleCardClick = () => {
    router.push(`/phones/${phone.id}?from=phones`);
  };

  // 阻止对比复选框事件冒泡
  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleCardClick}
      className={cn(
        "phone-card group cursor-pointer focus:outline-none",
        "bg-white/[0.03] border-white/[0.06]",
        "focus:ring-2 focus:ring-[#00e5ff]/50 focus:ring-offset-2 focus:ring-offset-background",
        isFocused && "phone-card-focused"
      )}
    >
      <div className="phone-card-content">
        {/* 顶部行 */}
        <div className="phone-card-header">
          {/* 左侧：品牌 + 定位标签 */}
          <div className="flex items-center">
            <span className="phone-card-brand">{phone.brand}</span>
            {phone.category && (
              <span className="phone-card-tag">{phone.category}</span>
            )}
          </div>

          {/* 右侧：热度徽章 */}
          <HeatBadge 
            score={phone.heatScore} 
            isEditorsPick={phone.isEditorsPick}
          />
        </div>

        {/* 中部视觉区 */}
        <div className="phone-card-visual" aria-hidden="true">
          <PhoneSilhouetteSVG type={phoneType} />
        </div>

        {/* 底部信息 */}
        <div className="phone-card-info">
          <h3 className="phone-card-model">{phone.model}</h3>
          <p className="phone-card-price">
            {priceDisplay.main}
            {priceDisplay.suffix && (
              <span className="price-note">{priceDisplay.suffix}</span>
            )}
          </p>
        </div>
      </div>

      {/* 参数滑出条 */}
      {specItems.length > 0 && (
        <div className="phone-card-specs">
          <div className="phone-card-specs-content">
            {specItems.map((item, index) => (
              <span key={index} className="flex items-center">
                <span className="phone-card-spec-item">{item}</span>
                {index < specItems.length - 1 && (
                  <span className="phone-card-spec-separator">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 对比复选框 */}
      <div className="compare-checkbox-container" onClick={handleCompareClick}>
        <CompareCheckbox
          phoneId={phone.id}
          brand={phone.brand}
          model={phone.model}
          price={phone.price}
          outlineType={phoneType}
          specs={{
            chip: phone.specs.chip,
            screen: phone.specs.screen,
            battery: phone.specs.battery
          }}
        />
      </div>
    </Card>
  );
}
