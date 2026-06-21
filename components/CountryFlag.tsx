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
  const height = Math.round((width * 2) / 3);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagImageUrl(code, width)}
      alt={`${label} flag`}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`inline-block shrink-0 rounded-sm border border-ink/20 object-cover shadow-[0_1px_0_0_rgba(13,13,13,0.15)] ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    />
  );
}
