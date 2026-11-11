export type Filters = {
  country: string;
  genre: string;
  decade: string;
  year: string;
};

export type SearchResult = {
  id: number;
  type: string;
  title: string;
  year?: number;
  country?: string;
  cover_image?: string;
  thumb?: string;
  resource_url: string;
  uri: string;
};

export type ReleaseDetail = {
  id: number;
  title: string;
  artists?: { name: string; anv?: string; join?: string }[];
  artists_sort?: string;
  year?: number;
  country?: string;
  released?: string;
  labels?: { name: string; catno?: string }[];
  formats?: { name: string; qty?: string; descriptions?: string[] }[];
  genres?: string[];
  styles?: string[];
  images?: { uri: string; uri150?: string; type?: string }[];
  tracklist?: { position: string; title: string; duration?: string }[];
  uri: string;
  notes?: string;
};

export type HistoryEntry = {
  id: string;
  rolledAt: string;
  filters: Filters;
  release: ReleaseDetail;
};
