/** Canonical site URL — update here if the production domain changes. */
export const SITE_URL = "https://uppercrustpizza.netlify.app";

export const BUSINESS = {
  name: "Upper Crust Pizza",
  legalName: "Upper Crust Pizza",
  tagline: "Family-owned Wisconsin-style pizza since 1987",
  phone: "(414) 332-6820",
  phoneTel: "+14143326820",
  streetAddress: "249 East Hampton Avenue",
  addressLocality: "Whitefish Bay",
  addressRegion: "WI",
  postalCode: "53217",
  addressCountry: "US",
  foundedYear: 1987,
  orderUrl: "https://uppercrust.hungerrush.com/Order/",
  cuisine: "Pizza",
  priceRange: "$$",
  geo: {
    latitude: 43.1134,
    longitude: -87.9001,
  },
} as const;

/** Delivery and pickup service area copy for SEO and llms.txt */
export const DELIVERY_AREAS = [
  "Whitefish Bay",
  "Shorewood",
  "Fox Point",
  "Bayside",
  "Glendale",
  "River Hills",
  "Milwaukee (North Shore / East Side)",
] as const;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "/" : normalized}`;
}
