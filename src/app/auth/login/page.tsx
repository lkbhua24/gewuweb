import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "登录",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">登录极物</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">邮箱</label>
            <Input type="email" placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">密码</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">登录</Button>
          <Separator />
          <Button variant="outline" className="w-full">
            使用微信登录
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            还没有账号？{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
