import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeroTransitionOverlay } from "@/components/ranking/hero-transition-overlay";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        {/* Global Noise Texture Overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
          }}
          aria-hidden="true"
        />
        <TooltipProvider>
          <Sidebar />
          <div className="min-h-full flex flex-col pl-[72px] lg:pl-[210px]">
            <main className="flex-1 pb-14 md:pb-0 relative min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
          <MobileNav />
          <HeroTransitionOverlay />
        </TooltipProvider>
      </body>
    </html>
  );
}
