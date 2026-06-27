import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInButton } from "@/components/SignInButton";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-grid flex flex-1 flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href="/" size="lg" />
        </div>
        <div className="glass glow-blue-lg rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sign in with Google to connect your Gmail with read-only access and start
            triaging.
          </p>
          <div className="mt-8 flex justify-center">
            <SignInButton className="w-full justify-center !from-blue-600 !to-blue-700 !bg-gradient-to-r !text-white !ring-0" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
