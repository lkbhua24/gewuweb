import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "手机对比",
  description: "选择手机进行参数对比",
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">手机对比</h1>
        <p className="text-sm text-muted-foreground">选择两部手机进行详细参数对比</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((slot) => (
          <Card key={slot}>
            <CardHeader>
              <CardTitle className="text-sm">手机 {slot}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Button variant="outline" className="gap-2">
                <Plus className="size-4" />
                选择手机
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                搜索并选择要对比的手机
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
