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

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1) || null;
    if (host.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(embed|v|shorts)\/([^/]+)/);
      if (m) return m[2];
    }
    return null;
  } catch {
    return null;
  }
}

function youtubePlaylistUrl(videos: { uri: string }[]): string | null {
  const ids: string[] = [];
  for (const v of videos) {
    const id = youtubeId(v.uri);
    if (id && !ids.includes(id)) ids.push(id);
    if (ids.length >= 50) break;
  }
  if (!ids.length) return null;
  if (ids.length === 1) return `https://www.youtube.com/watch?v=${ids[0]}`;
  return `https://www.youtube.com/watch_videos?video_ids=${ids.join(",")}`;
}

export function ReleaseCard({ release, rolledAt, onRemove }: Props) {
  const image = release.images?.find((i) => i.type === "primary") ?? release.images?.[0];
  const releaseUrl = release.uri?.startsWith("http")
    ? release.uri
    : `https://www.discogs.com${release.uri ?? `/release/${release.id}`}`;
  const ytUrl = release.videos?.length ? youtubePlaylistUrl(release.videos) : null;
  const ytCount = release.videos?.filter((v) => youtubeId(v.uri)).length ?? 0;

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
          {ytUrl && (
            <a href={ytUrl} target="_blank" rel="noreferrer">
              {ytCount > 1 ? `YouTube playlist (${ytCount}) ↗` : "Play on YouTube ↗"}
            </a>
          )}
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
