import { useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { ReleaseCard } from "./components/ReleaseCard";
import { HistoryList } from "./components/HistoryList";
import { DiscogsError, pickRandomRelease } from "./discogs";
import {
  appendHistory,
  clearHistory,
  exportHistory,
  importHistory,
  loadHistory,
  removeHistory,
} from "./history";
import type { Filters, HistoryEntry } from "./types";
import { COUNTRIES, DECADES, FORMATS, GENRES, STYLES } from "./constants";

type View = "roll" | "history";

const EMPTY_FILTERS: Filters = {
  country: "",
  genre: "",
  style: "",
  format: "",
  label: "",
  decade: "",
  year: "",
};

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFilters(): Filters {
  // Pick a loose, mostly-sparse set so results stay plentiful.
  // Always set a decade so results feel grounded in a time.
  const maybe = (p: number) => Math.random() < p;
  return {
    country: maybe(0.35) ? pick(COUNTRIES) : "",
    genre: maybe(0.7) ? pick(GENRES) : "",
    style: maybe(0.25) ? pick(STYLES) : "",
    format: maybe(0.35) ? pick(FORMATS) : "",
    label: "",
    decade: maybe(0.6) ? pick(DECADES) : "",
    year: "",
  };
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [view, setView] = useState<View>("roll");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [current, setCurrent] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rollWith = async (f: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const release = await pickRandomRelease(f);
      const entry = appendHistory(f, release);
      setCurrent(entry);
      setHistory(loadHistory());
    } catch (e) {
      const msg = e instanceof DiscogsError ? e.message : (e as Error).message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRoll = () => rollWith(filters);

  const handleLucky = () => {
    const f = randomFilters();
    setFilters(f);
    rollWith(f);
  };

  const handleRemove = (id: string) => {
    const next = removeHistory(id);
    setHistory(next);
    if (current?.id === id) setCurrent(null);
  };

  return (
    <div className="app">
      <header className="top">
        <h1>Crate Dice</h1>
        <div className="tagline">a random Discogs release, on demand</div>
        <nav>
          <button
            type="button"
            className={view === "roll" ? "on" : ""}
            onClick={() => setView("roll")}
          >
            Roll
          </button>
          <button
            type="button"
            className={view === "history" ? "on" : ""}
            onClick={() => setView("history")}
          >
            History ({history.length})
          </button>
        </nav>
      </header>

      {view === "roll" ? (
        <main>
          <FilterForm
            filters={filters}
            onChange={setFilters}
            onRoll={handleRoll}
            onLucky={handleLucky}
            loading={loading}
          />
          {error && <div className="error">{error}</div>}
          {current && (
            <ReleaseCard
              release={current.release}
              rolledAt={current.rolledAt}
              onRemove={() => handleRemove(current.id)}
            />
          )}
          {!current && !error && !loading && (
            <div className="hint">Pick filters (or leave blank for anything) and hit Roll.</div>
          )}
        </main>
      ) : (
        <main>
          <HistoryList
            entries={history}
            onRemove={handleRemove}
            onClear={() => {
              if (confirm("Clear all history?")) {
                clearHistory();
                setHistory([]);
              }
            }}
            onExport={() =>
              downloadText(
                `discogs-history-${new Date().toISOString().slice(0, 10)}.json`,
                exportHistory(),
              )
            }
            onImport={(json) => {
              try {
                const next = importHistory(json);
                setHistory(next);
              } catch (e) {
                alert("Import failed: " + (e as Error).message);
              }
            }}
          />
        </main>
      )}
    </div>
  );
}
