import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        返回个人中心
      </Link>

      <h1 className="text-2xl font-bold mb-6">个人设置</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">用户名</label>
            <Input placeholder="你的昵称" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">个人简介</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="介绍一下自己..."
            />
          </div>
          <Button>保存修改</Button>
        </CardContent>
      </Card>
    </div>
  );
}
