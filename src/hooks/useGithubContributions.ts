"use client";

import { useState, useEffect } from "react";
import type { ContributionData, ContributionLevel } from "@/components/ui/GithubCalendar";
import { GITHUB_CONTRIBUTIONS_API } from "@/lib/constants";

// ─── API response shape from jogruber's contributions API ────────────────────
type APIResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

async function fetchContributions(username: string): Promise<ContributionData> {
  const res = await fetch(`${GITHUB_CONTRIBUTIONS_API}/${username}`);
  if (!res.ok)
    throw new Error(
      `Could not fetch contributions for "${username}" (${res.status})`
    );
  const json: APIResponse = await res.json();
  const result: ContributionData = {};
  for (const entry of json.contributions) {
    result[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    };
  }
  return result;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
// Fetches GitHub contribution data for a given username.
// Returns the same shape the GithubCalendar component expects.
//
// Usage:
//   const { data, loading, error } = useGithubContributions("torresairon44-hue");
export function useGithubContributions(username?: string) {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(!!username);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    setData(null);
    setError(null);
    setLoading(true);
    fetchContributions(username)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [username]);

  return { data, loading, error };
}
