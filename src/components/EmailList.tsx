"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { categoryColors } from "@/lib/defaults";
import { EmailDetailModal, type EmailDetail } from "@/components/EmailDetailModal";

type Category = {
  id: string;
  name: string;
  priority: number;
};

type Email = {
  id: string;
  gmailId: string;
  subject: string | null;
  fromAddress: string;
  fromName: string | null;
  snippet: string | null;
  bodyPreview: string | null;
  receivedAt: string;
  importanceScore: number;
  userOverride: boolean;
  readAt: string | null;
  category: Category | null;
};

const TIME_FILTERS = [
  { label: "All", days: "0" },
  { label: "Today", days: "1" },
  { label: "7 days", days: "7" },
  { label: "30 days", days: "30" },
  { label: "90 days", days: "90" },
] as const;

export function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dayFilter, setDayFilter] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const loadEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("categoryId", categoryFilter);
      if (dayFilter !== "0") params.set("days", dayFilter);
      const url = `/api/emails${params.size ? `?${params}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load emails");
      const data = (await res.json()) as { emails: Email[]; categories: Category[] };
      setEmails(data.emails);
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, dayFilter]);

  useEffect(() => { loadEmails(); }, [loadEmails]);

  async function handleSync() {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      await loadEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function handleRecategorize(emailId: string, categoryId: string) {
    const res = await fetch(`/api/emails/${emailId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId }),
    });
    if (res.ok) await loadEmails();
  }

  function handleMarkRead(emailId: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, readAt: new Date().toISOString() } : e))
    );
  }

  const unreadCount = emails.filter((e) => !e.readAt).length;

  return (
    <div className="space-y-5">
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <FilterBtn active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")}>
            All
            {!loading && <span className="ml-1.5 opacity-60">{emails.length}</span>}
            {!loading && unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] text-white font-medium">
                {unreadCount}
              </span>
            )}
          </FilterBtn>
          {categories.map((cat) => {
            const colors = categoryColors(cat.name);
            const count = emails.filter((e) => e.category?.id === cat.id).length;
            return (
              <FilterBtn
                key={cat.id}
                active={categoryFilter === cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                dotClass={colors.dot}
              >
                {cat.name}
                {!loading && <span className="ml-1.5 opacity-50">{count}</span>}
              </FilterBtn>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
        >
          {syncing ? (
            <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Syncing…</>
          ) : (
            <><SyncIcon />Sync now</>
          )}
        </button>
      </div>

      {/* Time filter */}
      <div className="flex gap-1.5 flex-wrap">
        {TIME_FILTERS.map((f) => (
          <button
            key={f.days}
            type="button"
            onClick={() => setDayFilter(f.days)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium transition",
              dayFilter === f.days
                ? "bg-slate-500/20 ring-1 ring-slate-400/30"
                : "hover:bg-slate-500/10",
            )}
            style={{ color: dayFilter === f.days ? "var(--text-primary)" : "var(--text-muted)" }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : emails.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl border-dashed px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
            <InboxIcon />
          </div>
          <p className="font-medium" style={{ color: "var(--text-secondary)" }}>No emails</p>
          <p className="mt-1 max-w-xs text-sm" style={{ color: "var(--text-muted)" }}>
            {dayFilter !== "0"
              ? "No emails in this time range. Try a wider window."
              : `Click "Sync now" to fetch and triage your Gmail inbox.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              categories={categories}
              onOpen={() => setSelectedEmail(email)}
              onRecategorize={handleRecategorize}
            />
          ))}
        </ul>
      )}

      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail as EmailDetail}
          onClose={() => setSelectedEmail(null)}
          onMarkRead={handleMarkRead}
        />
      )}
    </div>
  );
}

function EmailCard({
  email,
  categories,
  onOpen,
  onRecategorize,
}: {
  email: Email;
  categories: Category[];
  onOpen: () => void;
  onRecategorize: (id: string, categoryId: string) => void;
}) {
  const colors = categoryColors(email.category?.name);
  const isUnread = !email.readAt;

  return (
    <li
      className={cn(
        "group glass overflow-hidden rounded-xl transition cursor-pointer",
        "hover:border-blue-500/25 hover:bg-[var(--bg-card-hover)]",
        isUnread && "ring-1 ring-inset",
      )}
      style={isUnread ? { "--tw-ring-color": "var(--border-strong)" } as React.CSSProperties : {}}
      onClick={onOpen}
    >
      <div className="flex">
        <div className={cn("w-1 shrink-0", colors.bar)} />
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {/* Badges row + date */}
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" title="Unread" />
              )}
              <ImportanceBadge score={email.importanceScore} />
              {email.category && (
                <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium ring-1", colors.badge, colors.ring)}>
                  {email.category.name}
                </span>
              )}
              {email.userOverride && (
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400 ring-1 ring-amber-500/20">
                  Manual
                </span>
              )}
            </div>
            <time className="shrink-0 whitespace-nowrap text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {new Date(email.receivedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </time>
          </div>

          <h3
            className={cn(
              "mt-2 truncate transition group-hover:text-white",
              isUnread ? "font-semibold" : "font-medium",
            )}
            style={{ color: "var(--text-primary)" }}
          >
            {email.subject || "(no subject)"}
          </h3>

          <p className="mt-0.5 truncate text-xs" style={{ color: "var(--text-muted)" }}>
            {email.fromName ? (
              <><span style={{ color: "var(--text-secondary)" }}>{email.fromName}</span><span className="mx-1 opacity-40">·</span></>
            ) : null}
            {email.fromAddress}
          </p>

          {email.snippet && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-muted)" }}>
              {email.snippet}
            </p>
          )}

          <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
            <select
              value={email.category?.id ?? ""}
              onChange={(e) => onRecategorize(email.id, e.target.value)}
              className="input-dark max-w-[160px] cursor-pointer rounded-lg px-2 py-1 text-xs"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </li>
  );
}

function FilterBtn({
  active,
  onClick,
  dotClass,
  children,
}: {
  active: boolean;
  onClick: () => void;
  dotClass?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg px-3.5 py-2 text-sm font-medium transition",
        active
          ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
          : "ring-1 ring-blue-500/10 hover:bg-blue-500/8 hover:text-slate-200",
      )}
      style={!active ? { color: "var(--text-muted)" } : {}}
    >
      {dotClass && (
        <span className={cn("mr-1.5 h-2 w-2 rounded-full shrink-0", dotClass)} />
      )}
      {children}
    </button>
  );
}

function ImportanceBadge({ score }: { score: number }) {
  const map: Record<number, string> = {
    5: "bg-red-500/15 text-red-400 ring-red-500/30",
    4: "bg-orange-500/15 text-orange-400 ring-orange-500/30",
    3: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
    2: "bg-slate-500/15 text-slate-400 ring-slate-500/30",
    1: "bg-slate-700/30 text-slate-500 ring-slate-600/30",
  };
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold ring-1", map[score] ?? map[3])}>
      {score}/5
    </span>
  );
}

function SyncIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.012-.447-.037-.666A48.394 48.394 0 0012 15c-2.305 0-4.47-.402-6.39-1.137a48.52 48.52 0 01-.037-.666V13.5" />
    </svg>
  );
}
