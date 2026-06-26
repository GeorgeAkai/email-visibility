import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { syncAllUsers } from "@/lib/sync";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  const expected = `Bearer ${cronSecret ?? ""}`;
  const provided = authHeader ?? "";
  const eq =
    cronSecret &&
    provided.length === expected.length &&
    timingSafeEqual(Buffer.from(provided), Buffer.from(expected));

  if (!eq) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncAllUsers();
  return NextResponse.json({ results, syncedAt: new Date().toISOString() });
}
