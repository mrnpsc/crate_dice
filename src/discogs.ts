import type { Filters, ReleaseDetail, SearchResult } from "./types";

const BASE = "https://api.discogs.com";
const TOKEN = import.meta.env.VITE_DISCOGS_TOKEN as string | undefined;
const USER_AGENT = "DiscogsRandomizer/0.1";
const MAX_RESULTS = 10000;
const PER_PAGE = 50;

export class DiscogsError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function assertToken() {
  if (!TOKEN || TOKEN.startsWith("paste-")) {
    throw new DiscogsError(
      0,
      "Missing Discogs token. Put your personal token in .env.local as VITE_DISCOGS_TOKEN and restart dev server.",
    );
  }
}

async function get<T>(path: string, params: Record<string, string | number>): Promise<T> {
  assertToken();
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== "" && v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Discogs token=${TOKEN}`,
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    if (res.status === 429) {
      throw new DiscogsError(429, "Discogs rate limit hit. Wait a moment and try again.");
    }
    const text = await res.text().catch(() => "");
    throw new DiscogsError(res.status, `Discogs ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

type SearchResponse = {
  pagination: { page: number; pages: number; per_page: number; items: number };
  results: SearchResult[];
};

function resolveYear(filters: Filters): string {
  if (filters.year) return filters.year;
  if (filters.decade) {
    const start = parseInt(filters.decade, 10);
    if (!Number.isNaN(start)) {
      const offset = Math.floor(Math.random() * 10);
      return String(start + offset);
    }
  }
  return "";
}

function buildQuery(filters: Filters, page: number, per_page: number) {
  return {
    type: "release",
    country: filters.country,
    genre: filters.genre,
    style: filters.style,
    format: filters.format,
    label: filters.label,
    year: resolveYear(filters),
    page,
    per_page,
  };
}

export async function pickRandomRelease(filters: Filters): Promise<ReleaseDetail> {
  const probe = await get<SearchResponse>("/database/search", buildQuery(filters, 1, 1));
  const total = Math.min(probe.pagination.items, MAX_RESULTS);
  if (total === 0) {
    throw new DiscogsError(404, "No releases match these filters. Try loosening them.");
  }

  const index = Math.floor(Math.random() * total);
  const page = Math.floor(index / PER_PAGE) + 1;
  const offset = index % PER_PAGE;

  // Re-resolve year on the actual roll so we don't get stuck on an empty year
  // from the probe. Rebuild with same filters — the probe already told us count > 0.
  const pageRes = await get<SearchResponse>("/database/search", buildQuery(filters, page, PER_PAGE));
  const results = pageRes.results.filter((r) => r.type === "release");
  const chosen = results[offset] ?? results[Math.floor(Math.random() * results.length)];
  if (!chosen) {
    throw new DiscogsError(404, "Picked an empty page. Try again.");
  }

  return await get<ReleaseDetail>(`/releases/${chosen.id}`, {});
}
