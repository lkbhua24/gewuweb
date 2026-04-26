import type { Metadata } from "next";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "圈子详情",
  description: "圈子帖子列表",
};

export default async function CircleDetailPage({
  params,
}: {
  params: Promise<{ circleId: string }>;
}) {
  const { circleId } = await params;

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        返回社区
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">圈子 #{circleId}</h1>
          <Badge variant="secondary">
            <Users className="mr-1 size-3" />
            12.8k 成员
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">圈子描述信息</p>
        <Button size="sm" className="mt-3">加入圈子</Button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center py-8">
          连接 Supabase 后将展示圈子帖子
        </p>
      </div>
    </div>
  );
}
