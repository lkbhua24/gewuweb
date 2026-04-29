"use client";

import { useEffect, useState } from "react";
import { PhoneDetailPage } from "@/components/theme/phone-detail-page";
import { getPhonePrimaryColor } from "@/lib/color-theme";

// ============================================================================
// 手机详情页 - 集成完整主题详情页组件
// ============================================================================

// 手机品牌中文映射
const BRAND_CN_MAP: Record<string, string> = {
  "Apple": "苹果",
  "Xiaomi": "小米",
  "Huawei": "华为",
  "Samsung": "三星",
  "OPPO": "OPPO",
  "vivo": "vivo",
  "OnePlus": "一加",
  "iQOO": "iQOO",
  "Honor": "荣耀",
  "Meizu": "魅族",
  "Redmi": "Redmi",
  "realme": "真我",
  "Nubia": "努比亚",
};

// 手机数据（与 phone-library-grid.tsx 共享的数据）
const rawPhonesData = [
  { id: "1", brand: "Apple", model: "iPhone 16 Pro Max", price: 9999, releaseDate: "2024-09-20", specs: { chip: "A18 Pro", screen: "6.9英寸 OLED", battery: "4685mAh", charging: "40W", camera: "48MP+12MP+12MP", os: "iOS 18" }, tagline: "钛金属设计 · 影像旗舰" },
  { id: "2", brand: "Apple", model: "iPhone 16 Pro", price: 7999, releaseDate: "2024-09-20", specs: { chip: "A18 Pro", screen: "6.3英寸 OLED", battery: "3582mAh", charging: "40W", camera: "48MP+12MP+12MP", os: "iOS 18" }, tagline: "钛金属设计 · 专业影像" },
  { id: "3", brand: "Xiaomi", model: "小米 15 Ultra", price: 5999, releaseDate: "2025-02-27", specs: { chip: "骁龙8至尊版", screen: "6.73英寸 OLED", battery: "6000mAh", charging: "90W", camera: "50MP+50MP+50MP", os: "HyperOS 2" }, tagline: "徕卡影像 · 极致光学" },
  { id: "4", brand: "Xiaomi", model: "小米 15 Pro", price: 4999, releaseDate: "2024-10-29", specs: { chip: "骁龙8至尊版", screen: "6.73英寸 OLED", battery: "5400mAh", charging: "120W", camera: "50MP+50MP+50MP", os: "HyperOS 2" }, tagline: "骁龙8至尊版 · 2K屏" },
  { id: "5", brand: "Samsung", model: "Galaxy S25 Ultra", price: 9699, releaseDate: "2025-01-23", specs: { chip: "骁龙8至尊版", screen: "6.9英寸 OLED", battery: "5000mAh", charging: "45W", camera: "200MP+50MP+10MP+10MP", os: "One UI 7" }, tagline: "钛金属设计 · 2亿像素" },
  { id: "6", brand: "Samsung", model: "Galaxy S25+", price: 7999, releaseDate: "2025-01-23", specs: { chip: "骁龙8至尊版", screen: "6.7英寸 OLED", battery: "4900mAh", charging: "45W", camera: "50MP+12MP+10MP", os: "One UI 7" }, tagline: "AI智能 · 顶级屏幕" },
  { id: "7", brand: "Huawei", model: "Mate 70 Pro+", price: 8499, releaseDate: "2024-11-26", specs: { chip: "麒麟9020", screen: "6.9英寸 OLED", battery: "5700mAh", charging: "100W", camera: "50MP+48MP+40MP", os: "HarmonyOS NEXT" }, tagline: "鸿蒙NEXT · 卫星通信" },
  { id: "8", brand: "Huawei", model: "Mate 70 Pro", price: 6999, releaseDate: "2024-11-26", specs: { chip: "麒麟9000S", screen: "6.9英寸 OLED", battery: "5500mAh", charging: "88W", camera: "50MP+48MP+40MP", os: "HarmonyOS NEXT" }, tagline: "纯血鸿蒙 · 自研芯片" },
  { id: "9", brand: "OnePlus", model: "一加 13", price: 4499, releaseDate: "2024-11-01", specs: { chip: "骁龙8至尊版", screen: "6.82英寸 OLED", battery: "6000mAh", charging: "100W", camera: "50MP+50MP+50MP", os: "ColorOS 15" }, tagline: "骁龙8至尊版 · 游戏旗舰" },
  { id: "10", brand: "OnePlus", model: "一加 13T", price: 3499, releaseDate: "2025-04-25", specs: { chip: "骁龙8 Gen3", screen: "6.3英寸 OLED", battery: "5500mAh", charging: "80W", camera: "50MP+8MP", os: "ColorOS 15" }, tagline: "小屏旗舰 · 性能怪兽" },
  { id: "11", brand: "OPPO", model: "Find X8 Pro", price: 5299, releaseDate: "2024-10-24", specs: { chip: "天玑9400", screen: "6.78英寸 OLED", battery: "5910mAh", charging: "80W", camera: "50MP+50MP+50MP", os: "ColorOS 15" }, tagline: "天玑9400 · 影像大师" },
  { id: "12", brand: "OPPO", model: "Find X8", price: 4199, releaseDate: "2024-10-24", specs: { chip: "天玑9400", screen: "6.59英寸 OLED", battery: "5630mAh", charging: "80W", camera: "50MP+50MP", os: "ColorOS 15" }, tagline: "无影抓拍 · 轻薄旗舰" },
  { id: "13", brand: "vivo", model: "X200 Ultra", price: 5999, releaseDate: "2025-04-20", specs: { chip: "骁龙8至尊版", screen: "6.8英寸 OLED", battery: "5500mAh", charging: "90W", camera: "50MP+50MP+200MP", os: "OriginOS 5" }, tagline: "蔡司影像 · 演唱会神器" },
  { id: "14", brand: "vivo", model: "X200 Pro", price: 4999, releaseDate: "2024-10-14", specs: { chip: "天玑9400", screen: "6.78英寸 OLED", battery: "6000mAh", charging: "90W", camera: "50MP+50MP+200MP", os: "OriginOS 5" }, tagline: "蓝晶×天玑 · 影像旗舰" },
  { id: "15", brand: "Redmi", model: "K80 Pro", price: 3299, releaseDate: "2024-11-27", specs: { chip: "骁龙8 Gen3", screen: "6.67英寸 OLED", battery: "6000mAh", charging: "120W", camera: "50MP+8MP+2MP", os: "HyperOS 2" }, tagline: "骁龙8 Gen3 · 游戏神机" },
  { id: "16", brand: "Redmi", model: "K80", price: 2499, releaseDate: "2024-11-27", specs: { chip: "骁龙8 Gen2", screen: "6.67英寸 OLED", battery: "6550mAh", charging: "90W", camera: "50MP+8MP", os: "HyperOS 2" }, tagline: "6550mAh · 续航怪兽" },
  { id: "17", brand: "realme", model: "GT7 Pro", price: 3599, releaseDate: "2024-11-04", specs: { chip: "骁龙8至尊版", screen: "6.78英寸 OLED", battery: "6500mAh", charging: "120W", camera: "50MP+8MP", os: "realme UI 6" }, tagline: "骁龙8至尊版 · 电竞屏" },
  { id: "18", brand: "iQOO", model: "13", price: 3999, releaseDate: "2024-10-30", specs: { chip: "骁龙8至尊版", screen: "6.82英寸 OLED", battery: "6150mAh", charging: "120W", camera: "50MP+50MP", os: "OriginOS 5" }, tagline: "电竞旗舰 · 自研芯片" },
  { id: "19", brand: "Honor", model: "Magic7 Pro", price: 5699, releaseDate: "2024-10-30", specs: { chip: "骁龙8至尊版", screen: "6.8英寸 OLED", battery: "5850mAh", charging: "100W", camera: "50MP+50MP+50MP", os: "MagicOS 9" }, tagline: "AI智能 · 鹰眼相机" },
  { id: "20", brand: "Nubia", model: "Z70 Ultra", price: 4599, releaseDate: "2025-05-15", specs: { chip: "骁龙8至尊版", screen: "6.8英寸 OLED", battery: "6000mAh", charging: "80W", camera: "50MP+50MP+50MP", os: "MyOS 15" }, tagline: "真全面屏 · 影像旗舰" },
  { id: "21", brand: "Meizu", model: "21 Pro", price: 3999, releaseDate: "2024-03-01", specs: { chip: "骁龙8 Gen3", screen: "6.79英寸 OLED", battery: "5050mAh", charging: "80W", camera: "50MP+13MP+10MP", os: "Flyme 11" }, tagline: "单手大屏 · Flyme经典" },
  { id: "22", brand: "Huawei", model: "Mate X6", price: 12999, releaseDate: "2024-11-26", specs: { chip: "麒麟9100", screen: "7.93英寸 折叠", battery: "5200mAh", charging: "66W", camera: "50MP+48MP+40MP", os: "HarmonyOS NEXT" }, tagline: "折叠旗舰 · 轻薄可靠" },
  { id: "23", brand: "Samsung", model: "Galaxy Z Fold6", price: 13999, releaseDate: "2024-07-24", specs: { chip: "骁龙8 Gen3", screen: "7.6英寸 折叠", battery: "4400mAh", charging: "25W", camera: "50MP+12MP+10MP", os: "One UI 7" }, tagline: "折叠大屏 · AI生产力" },
  { id: "24", brand: "vivo", model: "X200 Pro mini", price: 4299, releaseDate: "2024-10-14", specs: { chip: "天玑9400", screen: "6.31英寸 OLED", battery: "5700mAh", charging: "90W", camera: "50MP+50MP+50MP", os: "OriginOS 5" }, tagline: "小屏旗舰 · 大电池" },
];

// 手机数据映射
const phonesData = rawPhonesData.map(p => ({
  ...p,
  brandCN: BRAND_CN_MAP[p.brand] || p.brand,
}));

export default function PhoneDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [phone, setPhone] = useState<typeof phonesData[0] | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      const foundPhone = phonesData.find(p => p.id === id);
      setPhone(foundPhone || null);
    });
  }, [params]);

  if (!id) return null;

  // 如果没有找到手机数据，显示默认信息
  const displayPhone = phone || {
    id,
    brand: "品牌",
    brandCN: "品牌",
    model: `手机型号 #${id}`,
    price: 5999,
    releaseDate: "2025-01-01",
    specs: {
      chip: "未知",
      screen: "未知",
      battery: "未知",
      charging: "未知",
      camera: "未知",
      os: "未知",
    },
    tagline: "敬请期待",
  };

  // 格式化价格显示
  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()} 起`;
  };

  // 格式化发布日期
  const formatReleaseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  return (
    <PhoneDetailPage
      brand={displayPhone.brandCN}
      model={displayPhone.model}
      tagline={displayPhone.tagline}
      releaseDate={formatReleaseDate(displayPhone.releaseDate)}
      startingPrice={formatPrice(displayPhone.price)}
    />
  );
}
