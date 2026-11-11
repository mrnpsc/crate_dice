import type { ReleaseDetail } from "../types";

type Props = {
  release: ReleaseDetail;
  rolledAt?: string;
  onRemove?: () => void;
};

function formatArtists(release: ReleaseDetail): string {
  if (release.artists_sort) return release.artists_sort;
  if (!release.artists?.length) return "Unknown artist";
  return release.artists
    .map((a, i, arr) => a.name + (i < arr.length - 1 ? ` ${a.join ?? "/"} ` : ""))
    .join("");
}

export function ReleaseCard({ release, rolledAt, onRemove }: Props) {
  const image = release.images?.find((i) => i.type === "primary") ?? release.images?.[0];
  const releaseUrl = release.uri?.startsWith("http")
    ? release.uri
    : `https://www.discogs.com${release.uri ?? `/release/${release.id}`}`;

  return (
    <article className="release-card">
      <div className="cover">
        {image ? (
          <img src={image.uri} alt={release.title} loading="lazy" />
        ) : (
          <div className="cover-placeholder">no image</div>
        )}
      </div>
      <div className="meta">
        <header>
          <h2>{release.title}</h2>
          <div className="artist">{formatArtists(release)}</div>
          {rolledAt && <div className="rolled-at">rolled {new Date(rolledAt).toLocaleString()}</div>}
        </header>

        <dl className="facts">
          {release.year && (
            <>
              <dt>Year</dt>
              <dd>{release.year}</dd>
            </>
          )}
          {release.country && (
            <>
              <dt>Country</dt>
              <dd>{release.country}</dd>
            </>
          )}
          {!!release.labels?.length && (
            <>
              <dt>Labels</dt>
              <dd>
                {release.labels
                  .map((l) => l.name + (l.catno ? ` (${l.catno})` : ""))
                  .join(", ")}
              </dd>
            </>
          )}
          {!!release.formats?.length && (
            <>
              <dt>Formats</dt>
              <dd>
                {release.formats
                  .map(
                    (f) =>
                      f.name +
                      (f.qty && f.qty !== "1" ? ` ×${f.qty}` : "") +
                      (f.descriptions?.length ? ` · ${f.descriptions.join(", ")}` : ""),
                  )
                  .join(" / ")}
              </dd>
            </>
          )}
          {!!release.genres?.length && (
            <>
              <dt>Genres</dt>
              <dd>{release.genres.join(", ")}</dd>
            </>
          )}
          {!!release.styles?.length && (
            <>
              <dt>Styles</dt>
              <dd>{release.styles.join(", ")}</dd>
            </>
          )}
        </dl>

        {!!release.tracklist?.length && (
          <details className="tracklist">
            <summary>Tracklist ({release.tracklist.length})</summary>
            <ol>
              {release.tracklist.map((t, i) => (
                <li key={i}>
                  <span className="pos">{t.position || "–"}</span>
                  <span className="title">{t.title}</span>
                  {t.duration && <span className="dur">{t.duration}</span>}
                </li>
              ))}
            </ol>
          </details>
        )}

        <footer className="actions">
          <a href={releaseUrl} target="_blank" rel="noreferrer">
            View on Discogs ↗
          </a>
          {onRemove && (
            <button type="button" className="remove" onClick={onRemove}>
              Remove from history
            </button>
          )}
        </footer>
      </div>
    </article>
  );
}
