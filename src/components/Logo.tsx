import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  href = "/",
  size = "md",
  showText = true,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const iconSize = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-14 w-14" : "h-12 w-12";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <div
        className={cn(iconSize, "logo-mark shrink-0 rounded-lg transition group-hover:opacity-85")}
        style={{
          backgroundImage: "url('/logo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      {showText && (
        <span className={cn(textSize, "font-semibold tracking-tight")} style={{ color: "var(--text-primary)" }}>
          Mail<span className="text-blue-400">Scope</span>
        </span>
      )}
    </Link>
  );
}
