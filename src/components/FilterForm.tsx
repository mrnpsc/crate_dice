import type { Filters } from "../types";
import { COUNTRIES, DECADES, GENRES, MAX_YEAR, MIN_YEAR } from "../constants";

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onRoll: () => void;
  loading: boolean;
};

export function FilterForm({ filters, onChange, onRoll, loading }: Props) {
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

      <button type="submit" className="roll" disabled={loading}>
        {loading ? "Rolling…" : "Roll"}
      </button>
    </form>
  );
}
