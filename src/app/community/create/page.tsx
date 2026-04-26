import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "发帖",
  description: "发布新帖子",
};

export default function CreatePostPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        返回社区
      </Link>

      <h1 className="text-2xl font-bold mb-6">发布帖子</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">帖子信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">标题</label>
            <Input placeholder="输入帖子标题" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">内容</label>
            <textarea
              className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="分享你的想法..."
            />
          </div>
          <Button className="w-full">发布帖子</Button>
        </CardContent>
      </Card>
    </div>
  );
}
