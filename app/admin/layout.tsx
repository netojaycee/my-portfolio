import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Terminal, LayoutDashboard, Briefcase, Code, User, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: Briefcase },
    { name: "Skills", href: "/admin/skills", icon: Code },
    { name: "Experience", href: "/admin/experience", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-syne font-bold tracking-tight text-text">
            ADMIN PANEL
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-text hover:bg-surface-2 transition-all font-syne font-bold uppercase tracking-widest text-xs"
            >
              <item.icon className="w-5 h-5 text-accent/50" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-mono text-dim">Theme</span>
            <ThemeToggle />
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-syne font-bold uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        {children}
      </main>
    </div>
  );
}
