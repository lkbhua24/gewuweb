import type { Metadata } from "next";
import { DealCard } from "@/components/shopping/deal-card";
import { SearchBar } from "@/components/shared/search-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "导购好价",
  description: "全网手机好价推荐，真实用户评价，历史价格追踪",
};

const placeholderDeals = [
  { title: "iPhone 16 Pro Max 256GB", platform: "京东", price: 8999, originalPrice: 9999 },
  { title: "小米 15 Ultra 16+512GB", platform: "天猫", price: 5499, originalPrice: 5999 },
  { title: "Samsung Galaxy S25 Ultra", platform: "拼多多", price: 8499, originalPrice: 9699 },
  { title: "一加 13 16+512GB", platform: "京东", price: 3999, originalPrice: 4499 },
  { title: "OPPO Find X8 Pro", platform: "天猫", price: 4799, originalPrice: 5299 },
  { title: "vivo X200 Pro", platform: "京东", price: 4599, originalPrice: 4999 },
];

export default function ShoppingPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">导购好价</h1>
          <p className="text-sm text-muted-foreground">全网比价，买到最值</p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar placeholder="搜索好价..." />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="flagship">旗舰</TabsTrigger>
          <TabsTrigger value="midrange">中端</TabsTrigger>
          <TabsTrigger value="budget">入门</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {placeholderDeals.map((deal) => (
          <DealCard key={deal.title} {...deal} />
        ))}
      </div>
    </div>
  );
}
