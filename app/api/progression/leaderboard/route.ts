import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

type BoardEntry = {
  rank: number;
  username: string;
  avatarId: string | null;
  xp: number;
  level: number;
  countryCode: string;
  title: string;
};

/** GET /api/progression/leaderboard?scope=global|country|weekly|monthly&country=ZA&category=sports */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "global";
  const country = searchParams.get("country");
  const limit = Math.min(Number(searchParams.get("limit") ?? 25), 50);

  const sb = getSupabaseAdmin();
  if (!isSupabaseConfigured() || !sb) {
    return NextResponse.json({ entries: [], source: "none" });
  }

  if (scope === "weekly" || scope === "monthly") {
    const days = scope === "weekly" ? 7 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data: events } = await sb
      .from("user_xp_events")
      .select("user_id, xp_amount")
      .gte("created_at", since.toISOString());

    const totals = new Map<string, number>();
    for (const e of events ?? []) {
      totals.set(e.user_id, (totals.get(e.user_id) ?? 0) + e.xp_amount);
    }

    const sorted = [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    const userIds = sorted.map(([id]) => id);
    const { data: users } = await sb
      .from("user_progress")
      .select("user_id, username, avatar_id, country_code, xp")
      .in("user_id", userIds.length ? userIds : ["__none__"]);

    const userMap = new Map((users ?? []).map((u) => [u.user_id, u]));

    const entries: BoardEntry[] = sorted.map(([userId, xpSum], i) => {
      const u = userMap.get(userId);
      const level = Math.min(100, Math.floor(Math.pow(xpSum / 100, 1 / 1.65)) + 1);
      return {
        rank: i + 1,
        username: u?.username ?? "Explorer",
        avatarId: u?.avatar_id ?? null,
        xp: xpSum,
        level,
        countryCode: u?.country_code ?? "US",
        title: "Knowledge Explorer",
      };
    });

    return NextResponse.json({ entries, source: "supabase", scope });
  }

  let query = sb
    .from("user_progress")
    .select("username, avatar_id, xp, country_code")
    .order("xp", { ascending: false })
    .limit(limit);

  if (scope === "country" && country) {
    query = query.eq("country_code", country);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ entries: [], source: "error" });
  }

  const entries: BoardEntry[] = (data ?? []).map((row, i) => {
    const xp = row.xp as number;
    const level = Math.min(100, Math.floor(Math.pow(xp / 100, 1 / 1.65)) + 1);
    return {
      rank: i + 1,
      username: row.username as string,
      avatarId: (row.avatar_id as string) ?? null,
      xp,
      level,
      countryCode: row.country_code as string,
      title: "Knowledge Explorer",
    };
  });

  return NextResponse.json({ entries, source: "supabase", scope });
}
