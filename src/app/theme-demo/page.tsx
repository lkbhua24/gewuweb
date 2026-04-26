import { PhoneAuraShowcase } from "@/components/theme/phone-aura-showcase";

export const metadata = {
  title: "一机一色 · 主题系统演示",
  description: "动态主题色彩系统演示页面",
};

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-5xl mx-auto py-8">
        <PhoneAuraShowcase />
      </div>
    </div>
  );
}
