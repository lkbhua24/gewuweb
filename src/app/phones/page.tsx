import type { Metadata } from "next";
import { HeroDiscussion } from "@/components/phones/hero-discussion";
import { ReleaseTimeline } from "@/components/phones/release-timeline";
import { PhoneLibraryGrid } from "@/components/phones/phone-library-grid";

export const metadata: Metadata = {
  title: "手机库",
  description: "全品牌手机参数查询，精准对比，助你选机",
};

export default function PhonesPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroDiscussion />
      <ReleaseTimeline />
      <PhoneLibraryGrid />
    </div>
  );
}
