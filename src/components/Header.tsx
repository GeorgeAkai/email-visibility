import Link from "next/link";
import { signOut } from "@/auth";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";

export function Header({
  email,
  activePath,
}: {
  email?: string | null;
  activePath?: "dashboard" | "settings" | "tasks";
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-500/10 glass-strong">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Icon only on mobile, full logo on desktop */}
          <div className="sm:hidden">
            <Logo href="/dashboard" size="sm" showText={false} />
          </div>
          <div className="hidden sm:block">
            <Logo href="/dashboard" size="sm" />
          </div>
          {email && (
            <p className="hidden text-xs text-slate-500 sm:block">{email}</p>
          )}
        </div>
        <nav className="flex items-center gap-0.5 sm:gap-2">
          <NavLink href="/dashboard" active={activePath === "dashboard"}>Inbox</NavLink>
          <NavLink href="/tasks" active={activePath === "tasks"}>Tasks</NavLink>
          <NavLink href="/settings" active={activePath === "settings"}>Settings</NavLink>
          <ThemeToggle />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="ml-0.5 sm:ml-2"
          >
            <button type="submit" className="btn-ghost rounded-lg px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm">
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-2 py-1 text-xs font-medium transition sm:px-3 sm:py-1.5 sm:text-sm",
        active
          ? "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25"
          : "text-slate-400 hover:bg-blue-500/8 hover:text-slate-200",
      )}
    >
      {children}
    </Link>
  );
}
