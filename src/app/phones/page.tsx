import type { Metadata } from "next";
import { PhoneCard } from "@/components/phones/phone-card";
import { SearchBar } from "@/components/shared/search-bar";

export const metadata: Metadata = {
  title: "手机库",
  description: "全品牌手机参数查询，精准对比，助你选机",
};

const placeholderPhones = [
  { brand: "Apple", model: "iPhone 16 Pro Max", priceCny: 9999, category: "旗舰机" },
  { brand: "Xiaomi", model: "小米 15 Ultra", priceCny: 5999, category: "旗舰机" },
  { brand: "Samsung", model: "Galaxy S25 Ultra", priceCny: 9699, category: "旗舰机" },
  { brand: "Huawei", model: "Mate 70 Pro+", priceCny: 8499, category: "旗舰机" },
  { brand: "OnePlus", model: "一加 13", priceCny: 4499, category: "旗舰机" },
  { brand: "OPPO", model: "Find X8 Pro", priceCny: 5299, category: "旗舰机" },
];

export default function PhonesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">手机库</h1>
          <p className="text-sm text-muted-foreground">全品牌手机参数查询与对比</p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar placeholder="搜索手机型号..." />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {placeholderPhones.map((phone) => (
          <PhoneCard key={phone.model} {...phone} />
        ))}
      </div>
    </div>
  );
}
