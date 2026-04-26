import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, LogOut, Bookmark, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-xl">极</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>极物用户</CardTitle>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-lg font-semibold">0</p>
              <p className="text-xs text-muted-foreground">帖子</p>
            </div>
            <div>
              <p className="text-lg font-semibold">0</p>
              <p className="text-xs text-muted-foreground">关注</p>
            </div>
            <div>
              <p className="text-lg font-semibold">0</p>
              <p className="text-xs text-muted-foreground">粉丝</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2" render={<Link href="/profile/settings" />}>
              <Settings className="size-4" />
              个人设置
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Bookmark className="size-4" />
              我的收藏
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <MessageCircle className="size-4" />
              我的评论
            </Button>
            <Separator />
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
              <LogOut className="size-4" />
              退出登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
