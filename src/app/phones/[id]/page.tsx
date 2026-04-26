import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "手机详情",
  description: "手机详细参数与评价",
};

export default async function PhoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href="/phones"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        返回手机库
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square flex items-center justify-center rounded-xl bg-muted">
          <span className="text-6xl">📱</span>
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="secondary" className="mb-2">旗舰机</Badge>
            <h1 className="text-2xl md:text-3xl font-bold">手机型号 #{id}</h1>
            <p className="text-muted-foreground mt-1">品牌名称</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">¥5,999</span>
            <span className="text-sm text-muted-foreground line-through">¥6,999</span>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <ShoppingCart className="mr-2 size-4" />
              查看好价
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="size-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="size-4" />
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="specs">
            <TabsList className="w-full">
              <TabsTrigger value="specs" className="flex-1">参数</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">评价</TabsTrigger>
              <TabsTrigger value="deals" className="flex-1">好价</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">基本参数</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    连接 Supabase 后将展示完整参数
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">暂无评价，成为第一个评价者</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="deals" className="mt-4">
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">暂无好价信息</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
