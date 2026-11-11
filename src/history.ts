import type { Filters, HistoryEntry, ReleaseDetail } from "./types";

const KEY = "discogs-rotd-history";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(entries: HistoryEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function appendHistory(filters: Filters, release: ReleaseDetail): HistoryEntry {
  const entry: HistoryEntry = {
    id: uuid(),
    rolledAt: new Date().toISOString(),
    filters,
    release,
  };
  const existing = loadHistory();
  existing.unshift(entry);
  saveAll(existing);
  return entry;
}

export function removeHistory(id: string): HistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  saveAll(next);
  return next;
}

export function clearHistory(): void {
  saveAll([]);
}

export function exportHistory(): string {
  return JSON.stringify(loadHistory(), null, 2);
}

export function importHistory(json: string): HistoryEntry[] {
  const parsed = JSON.parse(json) as HistoryEntry[];
  if (!Array.isArray(parsed)) throw new Error("Invalid history JSON");
  saveAll(parsed);
  return parsed;
}
