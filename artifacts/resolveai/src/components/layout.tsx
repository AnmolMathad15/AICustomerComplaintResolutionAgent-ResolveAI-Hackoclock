import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Users,
  Zap,
  Settings,
  MessageSquare,
  Sun,
  Moon,
  Zap as LogoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chat", label: "Chat AI", icon: MessageSquare },
    { href: "/analyze", label: "Analyze AI", icon: Zap },
    { href: "/complaints", label: "Complaints", icon: MessageSquareWarning },
    { href: "/customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-sidebar-foreground font-bold text-xl tracking-tight">
            <LogoIcon className="w-6 h-6 text-sidebar-primary" />
            <span>Resolve<span className="text-sidebar-primary">AI</span></span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-sidebar-foreground/50 tracking-wider uppercase mb-4 px-2">
            Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer group",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                      )}
                    />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors cursor-pointer rounded-md hover:bg-sidebar-accent/50">
            <Settings className="w-5 h-5 text-sidebar-foreground/50" />
            <span>Settings</span>
          </div>
          <div className="mt-4 flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold text-sm">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">John Doe</span>
              <span className="text-xs text-sidebar-foreground/50">Support Lead</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <LogoIcon className="w-5 h-5 text-accent" />
            <span>Resolve<span className="text-accent">AI</span></span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
