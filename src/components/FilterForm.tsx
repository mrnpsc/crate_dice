import type { Filters } from "../types";
import {
  COUNTRIES,
  DECADES,
  FORMATS,
  GENRES,
  MAX_YEAR,
  MIN_YEAR,
  STYLES,
} from "../constants";

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onRoll: () => void;
  onLucky: () => void;
  loading: boolean;
};

export function FilterForm({ filters, onChange, onRoll, onLucky, loading }: Props) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <form
      className="filters"
      onSubmit={(e) => {
        e.preventDefault();
        onRoll();
      }}
    >
      <label>
        <span>Country</span>
        <input
          list="country-list"
          value={filters.country}
          placeholder="Any"
          onChange={(e) => update({ country: e.target.value })}
        />
        <datalist id="country-list">
          {COUNTRIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label>
        <span>Genre</span>
        <select value={filters.genre} onChange={(e) => update({ genre: e.target.value })}>
          <option value="">Any</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Style</span>
        <input
          list="style-list"
          value={filters.style}
          placeholder="Any"
          onChange={(e) => update({ style: e.target.value })}
        />
        <datalist id="style-list">
          {STYLES.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </label>

      <label>
        <span>Format</span>
        <input
          list="format-list"
          value={filters.format}
          placeholder="Any"
          onChange={(e) => update({ format: e.target.value })}
        />
        <datalist id="format-list">
          {FORMATS.map((f) => (
            <option key={f} value={f} />
          ))}
        </datalist>
      </label>

      <label>
        <span>Label</span>
        <input
          value={filters.label}
          placeholder="Any"
          onChange={(e) => update({ label: e.target.value })}
        />
      </label>

      <label>
        <span>Decade</span>
        <select
          value={filters.decade}
          onChange={(e) => update({ decade: e.target.value, year: "" })}
        >
          <option value="">Any</option>
          {DECADES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Year</span>
        <input
          type="number"
          min={MIN_YEAR}
          max={MAX_YEAR}
          placeholder="Any"
          value={filters.year}
          disabled={!!filters.decade}
          onChange={(e) => update({ year: e.target.value })}
        />
      </label>

      <div className="filter-actions">
        <button type="submit" className="roll" disabled={loading}>
          {loading ? "Rolling…" : "Roll"}
        </button>
        <button type="button" className="lucky" onClick={onLucky} disabled={loading}>
          I'm Feeling Lucky
        </button>
      </div>
    </form>
  );
}
