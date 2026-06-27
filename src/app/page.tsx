import Link from "next/link";
import { SignInButton } from "@/components/SignInButton";
import { RedirectIfLoggedIn } from "@/components/RedirectIfLoggedIn";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const CATEGORIES = [
  { name: "Important", color: "bg-blue-500", text: "text-blue-400", ring: "ring-blue-500/30", bg: "bg-blue-500/10" },
  { name: "Tasks", color: "bg-green-500", text: "text-green-400", ring: "ring-green-500/30", bg: "bg-green-500/10" },
  { name: "Benign", color: "bg-amber-500", text: "text-amber-400", ring: "ring-amber-500/30", bg: "bg-amber-500/10" },
  { name: "SPAM", color: "bg-slate-500", text: "text-slate-400", ring: "ring-slate-500/30", bg: "bg-slate-500/10" },
  { name: "Suspicious", color: "bg-orange-500", text: "text-orange-400", ring: "ring-orange-500/30", bg: "bg-orange-500/10" },
  { name: "Phishing", color: "bg-red-500", text: "text-red-400", ring: "ring-red-500/30", bg: "bg-red-500/10" },
];

const FEATURES = [
  {
    icon: <SparkIcon />,
    title: "Agentic triage",
    description: "AI classifies every email into one of 6 categories using function-calling — not just keyword matching.",
    accent: "blue",
  },
  {
    icon: <TaskIcon />,
    title: "Task extraction",
    description: "Deadlines, assignments, and action items are pulled out of emails and shown on a dedicated Tasks page.",
    accent: "green",
  },
  {
    icon: <ShieldIcon />,
    title: "Phishing detection",
    description: "Suspicious emails are flagged and Phishing attempts are isolated. The chatbot never follows unknown links.",
    accent: "red",
  },
  {
    icon: <ChatIcon />,
    title: "RAG chatbot",
    description: "Ask questions about your inbox in plain English. The assistant searches your emails to answer.",
    accent: "purple",
  },
  {
    icon: <KeyIcon />,
    title: "Bring your own key",
    description: "Use OpenAI, Anthropic, Google Gemini, or OpenRouter — paste any key in Settings.",
    accent: "amber",
  },
  {
    icon: <LockIcon />,
    title: "Read-only access",
    description: "MailScope only reads your Gmail. Nothing is sent, moved, or deleted.",
    accent: "slate",
  },
];

const ACCENT_CLASSES: Record<string, { icon: string; ring: string; bg: string }> = {
  blue:   { icon: "text-blue-400",   ring: "ring-blue-500/20",   bg: "bg-blue-500/10" },
  green:  { icon: "text-green-400",  ring: "ring-green-500/20",  bg: "bg-green-500/10" },
  red:    { icon: "text-red-400",    ring: "ring-red-500/20",    bg: "bg-red-500/10" },
  purple: { icon: "text-violet-400", ring: "ring-violet-500/20", bg: "bg-violet-500/10" },
  amber:  { icon: "text-amber-400",  ring: "ring-amber-500/20",  bg: "bg-amber-500/10" },
  slate:  { icon: "text-slate-400",  ring: "ring-slate-500/20",  bg: "bg-slate-500/10" },
};

export default function HomePage() {
  return (
    <div className="bg-mesh bg-grid flex flex-1 flex-col">
      <RedirectIfLoggedIn />

      {/* Nav */}
      <header className="sticky top-0 z-50 glass-strong border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo href="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="btn-ghost rounded-lg px-4 py-2 text-sm font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">

        {/* Hero */}
        <section className="flex flex-col items-center justify-center py-20 text-center sm:py-32">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: "var(--border-strong)", color: "var(--accent-bright)", background: "var(--accent-glow)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
            AI-powered Gmail triage
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient">Your inbox,</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>finally sorted.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
            MailScope reads your Gmail, triages every email with AI, surfaces deadlines,
            and flags phishing — all without touching your inbox.
          </p>

          {/* Category pills preview */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <span
                key={cat.name}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${cat.bg} ${cat.text} ${cat.ring}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cat.color}`} />
                {cat.name}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <SignInButton className="glow-blue-lg min-w-[220px] justify-center" />
            <Link href="/login" className="text-sm transition hover:text-blue-400"
              style={{ color: "var(--text-muted)" }}>
              Already signed in? Go to inbox →
            </Link>
          </div>
        </section>

        {/* Mock inbox preview */}
        <section className="mx-auto mb-20 max-w-2xl">
          <div className="glass glow-blue rounded-2xl overflow-hidden">
            {/* Mock header bar */}
            <div className="flex items-center gap-1.5 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-amber-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>MailScope — Priority Inbox</span>
            </div>
            {/* Mock email rows */}
            {MOCK_EMAILS.map((email, i) => (
              <MockEmailRow key={i} {...email} />
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section className="pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
              Everything your inbox should be
            </h2>
            <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
              Six features working together so you never miss what matters.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const ac = ACCENT_CLASSES[f.accent];
              return (
                <div
                  key={f.title}
                  className="group glass rounded-2xl p-6 transition hover:border-blue-500/25"
                  style={{ background: "var(--bg-card)" }}
                >
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition group-hover:scale-110 ${ac.bg} ${ac.icon} ${ac.ring}`}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="pb-24">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <h2 className="text-center text-2xl font-bold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
              Up in 60 seconds
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { step: "1", title: "Connect Gmail", desc: "Sign in with Google. MailScope gets read-only access to your inbox." },
                { step: "2", title: "AI triages emails", desc: "Every email is classified, scored, and checked for phishing or tasks." },
                { step: "3", title: "See what matters", desc: "Open your priority inbox — important emails at the top, junk out of sight." },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-300 ring-1 ring-blue-500/25">
                    {s.step}
                  </div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <SignInButton className="glow-blue min-w-[200px] justify-center" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        MailScope · Read-only Gmail triage · Built with Next.js & AI
      </footer>
    </div>
  );
}

const MOCK_EMAILS = [
  { cat: "Important", catColor: "text-blue-400 bg-blue-500/10 ring-blue-500/25", bar: "bg-blue-500", subject: "View Your Latest Bank Statement -  Chase", from: "statements@chase.com", score: 5, unread: true },
  { cat: "Tasks", catColor: "text-green-400 bg-green-500/10 ring-green-500/25", bar: "bg-green-500", subject: "CSCI 311 Coding Project due Friday", from: "prof.johnson@chicostate.edu", score: 4, unread: true },
  { cat: "Benign", catColor: "text-amber-400 bg-amber-500/10 ring-amber-500/25", bar: "bg-amber-500", subject: "Your application was received", from: "no-reply@company.io", score: 2, unread: false },
  { cat: "Phishing", catColor: "text-red-400 bg-red-500/10 ring-red-500/25", bar: "bg-red-500", subject: "⚠️ Your account will be suspended. Act now!", from: "security@paypa1-alert.com", score: 1, unread: false },
];

function MockEmailRow({ cat, catColor, bar, subject, from, score, unread }: {
  cat: string; catColor: string; bar: string; subject: string; from: string; score: number; unread: boolean;
}) {
  return (
    <div className="flex items-stretch border-b last:border-0 transition hover:bg-[var(--bg-card-hover)]"
      style={{ borderColor: "var(--border)" }}>
      <div className={`w-0.5 shrink-0 ${bar}`} />
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        {unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${catColor}`}>{cat}</span>
        <span className={`truncate text-sm ${unread ? "font-semibold" : "font-normal"}`}
          style={{ color: unread ? "var(--text-primary)" : "var(--text-secondary)" }}>
          {subject}
        </span>
        <span className="ml-auto shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>{from}</span>
        <span className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold"
          style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
          {score}/5
        </span>
      </div>
    </div>
  );
}

function SparkIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>;
}

function TaskIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function ShieldIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></svg>;
}

function ChatIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
}

function KeyIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;
}

function LockIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
}
