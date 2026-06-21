import { flagImageUrl, getCountry } from "@/lib/progression/countries";

type CountryFlagProps = {
  code: string;
  /** Flag width in px (flagcdn). Height follows 3:2 aspect. */
  width?: number;
  className?: string;
  title?: string;
};

export default function CountryFlag({
  code,
  width = 40,
  className = "",
  title,
}: CountryFlagProps) {
  const country = getCountry(code);
  const label = title ?? country?.name ?? code;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagImageUrl(code, width)}
      alt={`${label} flag`}
      width={Math.round(width * 0.75)}
      height={Math.round(width * 0.5)}
      loading="lazy"
      className={`inline-block shrink-0 rounded-sm border border-ink/20 object-cover shadow-[0_1px_0_0_rgba(13,13,13,0.15)] ${className}`}
    />
  );
}
