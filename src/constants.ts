export const ANY = "";

export const GENRES = [
  "Blues",
  "Brass & Military",
  "Children's",
  "Classical",
  "Electronic",
  "Folk, World, & Country",
  "Funk / Soul",
  "Hip Hop",
  "Jazz",
  "Latin",
  "Non-Music",
  "Pop",
  "Reggae",
  "Rock",
  "Stage & Screen",
];

export const COUNTRIES = [
  "US",
  "UK",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Iceland",
  "Ireland",
  "Poland",
  "Czech Republic",
  "Austria",
  "Switzerland",
  "Greece",
  "Russia",
  "Ukraine",
  "Turkey",
  "Japan",
  "South Korea",
  "China",
  "Taiwan",
  "India",
  "Australia",
  "New Zealand",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Cuba",
  "Jamaica",
  "South Africa",
  "Nigeria",
  "Ethiopia",
  "Egypt",
  "Israel",
  "Croatia",
  "Serbia",
  "Hungary",
  "Romania",
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_DECADE = Math.floor(CURRENT_YEAR / 10) * 10;
export const DECADES: string[] = [];
for (let d = 1900; d <= CURRENT_DECADE; d += 10) {
  DECADES.push(`${d}s`);
}

export const MIN_YEAR = 1900;
export const MAX_YEAR = CURRENT_YEAR;
