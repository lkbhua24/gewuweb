import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "帖子详情",
  description: "帖子内容与评论",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ circleId: string; postId: string }>;
}) {
  const { circleId, postId } = await params;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link
        href={`/community/${circleId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        返回圈子
      </Link>

      <article className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarFallback>用户</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">用户名</p>
            <p className="text-xs text-muted-foreground">发布于 刚刚</p>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-3">帖子标题 #{postId}</h1>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">帖子内容将在此展示...</p>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Heart className="size-4" />
            <span>0</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <MessageCircle className="size-4" />
            <span>0</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Share2 className="size-4" />
            分享
          </Button>
        </div>
      </article>

      <section>
        <h2 className="font-semibold mb-4">评论</h2>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">暂无评论，来说两句吧</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
