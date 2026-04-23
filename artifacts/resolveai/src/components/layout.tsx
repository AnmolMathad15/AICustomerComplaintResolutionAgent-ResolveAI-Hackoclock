import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Users,
  Zap,
  Settings,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundAmbient } from "@/components/background-ambient";
import { HeaderBar } from "@/components/header-bar";
import { useT } from "@/components/language-provider";
import { TranslationKey } from "@/lib/i18n";

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export function Layout({ children, pageTitle }: LayoutProps) {
  const [location] = useLocation();
  const t = useT();
  const logoUrl = `${import.meta.env.BASE_URL}resolveai-logo.png`;

  useEffect(() => {
    if (pageTitle) document.title = `ResolveAI | ${pageTitle}`;
  }, [pageTitle]);

  const navItems: { href: string; labelKey: TranslationKey; icon: typeof LayoutDashboard }[] = [
    { href: "/dashboard", labelKey: "sidebar.dashboard", icon: LayoutDashboard },
    { href: "/chat", labelKey: "sidebar.chat", icon: MessageSquare },
    { href: "/analyze", labelKey: "sidebar.analyze", icon: Zap },
    { href: "/complaints", labelKey: "sidebar.complaints", icon: MessageSquareWarning },
    { href: "/customers", labelKey: "sidebar.customers", icon: Users },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-foreground relative">
      <BackgroundAmbient />

      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-white/8 flex-col hidden md:flex relative z-10">
        <div className="h-20 flex items-center justify-center px-4 border-b border-white/8">
          <Link href="/dashboard">
            <img
              src={logoUrl}
              alt="ResolveAI"
              className="glow-logo cursor-pointer"
              style={{ width: 160, height: "auto" }}
            />
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-semibold text-foreground/45 tracking-[0.2em] uppercase mb-4 px-2">
            {t("sidebar.operations")}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/dashboard" && location.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group",
                      "hover:pl-5 hover:text-orange-400",
                      isActive
                        ? "bg-orange-500/10 text-orange-400 font-medium"
                        : "text-foreground/70 hover:bg-orange-500/5"
                    )}
                    data-testid={`nav-${item.href.replace("/", "")}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />
                    )}
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-orange-400" : "text-foreground/45 group-hover:text-orange-400"
                      )}
                    />
                    <span>{t(item.labelKey)}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 px-3 py-2 text-foreground/70 hover:text-orange-400 transition-colors cursor-pointer rounded-md hover:bg-white/5">
            <Settings className="w-5 h-5 text-foreground/45" />
            <span className="text-sm">{t("sidebar.settings")}</span>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar header */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="md:hidden h-14 px-4 flex items-center gap-3 glass-strong border-b border-white/8">
          <img src={logoUrl} alt="ResolveAI" className="h-8 w-auto glow-logo" />
        </div>

        <HeaderBar />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
