import Link from "next/link";
import { Mail } from "lucide-react";

const footerLinks = {
  product: {
    title: "手机库",
    links: [
      { label: "手机大全", href: "/phones" },
      { label: "对比评测", href: "/phones/compare" },
      { label: "参数查询", href: "/phones/specs" },
    ],
  },
  ranking: {
    title: "排行榜",
    links: [
      { label: "综合排行", href: "/ranking?tab=comprehensive" },
      { label: "性能排行", href: "/ranking?tab=performance" },
      { label: "影像排行", href: "/ranking?tab=camera" },
    ],
  },
  shopping: {
    title: "导购",
    links: [
      { label: "好价推荐", href: "/shopping" },
      { label: "价格走势", href: "/shopping/trends" },
      { label: "全网比价", href: "/shopping/compare" },
    ],
  },
  community: {
    title: "社区",
    links: [
      { label: "发烧圈子", href: "/community" },
      { label: "热门话题", href: "/community/topics" },
      { label: "精华帖子", href: "/community/best" },
    ],
  },
};

// GitHub SVG 图标
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Twitter/X SVG 图标
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const socialLinks = [
  { icon: GitHubIcon, href: "#", label: "GitHub" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: Mail, href: "mailto:hi@jiwu.dev", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0B0F19]">
      {/* Top Gradient Line - 极淡的渐变分割线 */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          height: "1px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 py-16 md:py-20">
        {/* Five Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Logo + Description */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-xl text-[#9CA3AF] mb-4"
            >
              <span className="text-[#6B7280]">◆</span>
              <span>极物</span>
            </Link>
            <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
              查参数、看评价、比价格、聊搞机的第一站
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280] hover:text-[#9CA3AF] transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-[#9CA3AF] mb-4 text-sm">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 text-center">
          <p style={{ fontSize: "12px", color: "#6B7280" }}>
            © {new Date().getFullYear()} 极物. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
