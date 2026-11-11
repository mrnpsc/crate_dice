import { useMemo, useState } from "react";
import type { HistoryEntry } from "../types";
import { ReleaseCard } from "./ReleaseCard";

type Props = {
  entries: HistoryEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
};

export function HistoryList({ entries, onRemove, onClear, onExport, onImport }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (from && e.rolledAt.slice(0, 10) < from) return false;
      if (to && e.rolledAt.slice(0, 10) > to) return false;
      if (query) {
        const hay = (
          e.release.title +
          " " +
          (e.release.artists_sort ?? "") +
          " " +
          (e.filters.genre ?? "") +
          " " +
          (e.filters.country ?? "")
        ).toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [entries, query, from, to]);

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      onImport(text);
    };
    input.click();
  };

  if (!entries.length) {
    return (
      <div className="history empty">
        <p>No rolls yet.</p>
      </div>
    );
  }

  return (
    <section className="history">
      <div className="history-toolbar">
        <input
          type="search"
          placeholder="Search title/artist/filter…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label>
          from <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          to <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <div className="spacer" />
        <button type="button" onClick={onExport}>
          Export
        </button>
        <button type="button" onClick={handleImport}>
          Import
        </button>
        <button type="button" className="danger" onClick={onClear}>
          Clear all
        </button>
      </div>

      <ul className="history-list">
        {filtered.map((e) => {
          const img =
            e.release.images?.find((i) => i.type === "primary")?.uri150 ??
            e.release.images?.[0]?.uri150 ??
            e.release.images?.[0]?.uri;
          const isOpen = expanded === e.id;
          return (
            <li key={e.id} className={isOpen ? "open" : ""}>
              <button
                type="button"
                className="history-row"
                onClick={() => setExpanded(isOpen ? null : e.id)}
              >
                <div className="thumb">
                  {img ? <img src={img} alt="" loading="lazy" /> : <div className="ph">▪</div>}
                </div>
                <div className="row-meta">
                  <div className="row-title">{e.release.title}</div>
                  <div className="row-sub">
                    {e.release.artists_sort ?? "Unknown"} ·{" "}
                    {new Date(e.rolledAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
              {isOpen && (
                <ReleaseCard
                  release={e.release}
                  rolledAt={e.rolledAt}
                  onRemove={() => onRemove(e.id)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
