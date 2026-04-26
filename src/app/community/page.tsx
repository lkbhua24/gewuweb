import type { Metadata } from "next";
import { CircleCard } from "@/components/community/circle-card";
import { PostCard } from "@/components/community/post-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "圈子社区",
  description: "加入兴趣圈子，和发烧友聊搞机、分享玩机心得",
};

const placeholderCircles = [
  { name: "苹果圈", description: "iPhone、iPad、Mac 用户交流", membersCount: 12800, postsCount: 34500 },
  { name: "小米圈", description: "小米/Redmi 手机玩家社区", membersCount: 9600, postsCount: 21300 },
  { name: "华为圈", description: "华为/荣耀用户聚集地", membersCount: 8400, postsCount: 18700 },
  { name: "搞机圈", description: "刷机、Root、折腾党的乐园", membersCount: 5200, postsCount: 12800 },
];

const placeholderPosts = [
  { title: "iPhone 16 Pro Max 一个月深度体验", content: "用了一个月，说说我的真实感受...", authorName: "数码老司机", likesCount: 328, commentsCount: 89, createdAt: "2小时前" },
  { title: "小米 15 Ultra 拍照对比评测", content: "和上代对比，影像提升有多大？", authorName: "拍照达人", likesCount: 256, commentsCount: 67, createdAt: "5小时前" },
  { title: "2025年最值得买的折叠屏手机", content: "横评三款主流折叠屏，帮你做选择", authorName: "科技博主", likesCount: 189, commentsCount: 45, createdAt: "8小时前" },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">圈子社区</h1>
          <p className="text-sm text-muted-foreground">和发烧友聊搞机、分享玩机心得</p>
        </div>
        <Button render={<Link href="/community/create" />}>
          <PenSquare className="mr-2 size-4" />
          发帖
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">热门圈子</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {placeholderCircles.map((circle) => (
            <CircleCard key={circle.name} {...circle} />
          ))}
        </div>
      </section>

      <section>
        <Tabs defaultValue="hot">
          <TabsList>
            <TabsTrigger value="hot">热门</TabsTrigger>
            <TabsTrigger value="latest">最新</TabsTrigger>
            <TabsTrigger value="following">关注</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-4">
          {placeholderPosts.map((post) => (
            <PostCard key={post.title} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
