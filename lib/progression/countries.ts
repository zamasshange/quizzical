/** Supported countries for representation on profiles and leaderboards. */

export type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

export const COUNTRIES: CountryOption[] = [
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
];

export function getCountry(code: string): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function detectCountryCode(): string {
  if (typeof navigator === "undefined") return "US";
  const lang = navigator.language ?? "en-US";
  const part = lang.split("-")[1]?.toUpperCase();
  if (part && COUNTRIES.some((c) => c.code === part)) return part;
  return "US";
}
