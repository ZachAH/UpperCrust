import { BUSINESS, DELIVERY_AREAS, SITE_URL } from "./site";

export type RouteSEO = {
  title: string;
  description: string;
  path: string;
  /** Optional JSON-LD object for this route */
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
};

const areaList = DELIVERY_AREAS.slice(0, 4).join(", ");

export const ROUTE_SEO: Record<string, RouteSEO> = {
  "/": {
    path: "/",
    title: "Upper Crust Pizza | Pizza Delivery & Pickup in Whitefish Bay, WI",
    description: `Order fresh hand-tossed pizza from Upper Crust Pizza in Whitefish Bay. Family-owned since ${BUSINESS.foundedYear}. Delivery to ${areaList}, and nearby North Shore communities. Pickup and online ordering available.`,
  },
  "/menu": {
    path: "/menu",
    title: "Menu | Upper Crust Pizza — Whitefish Bay, WI",
    description:
      "Browse our menu of hand-tossed pizzas, appetizers, salads, and more. Order online for delivery in Whitefish Bay, Shorewood, Fox Point, and surrounding Milwaukee North Shore areas.",
  },
  "/hours": {
    path: "/hours",
    title: "Hours & Location | Upper Crust Pizza — Whitefish Bay, WI",
    description: `Store hours and location for Upper Crust Pizza at ${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion}. Pickup and delivery to the North Shore and nearby Milwaukee neighborhoods.`,
  },
  "/contact": {
    path: "/contact",
    title: "Contact Us | Upper Crust Pizza — Whitefish Bay, WI",
    description: `Call Upper Crust Pizza at ${BUSINESS.phone} or visit us at ${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion} ${BUSINESS.postalCode}. Questions about catering, hours, or delivery to the North Shore.`,
  },
  "/login": {
    path: "/login",
    title: "Login | Upper Crust Pizza",
    description: "Staff login for Upper Crust Pizza.",
    noindex: true,
  },
  "/admin": {
    path: "/admin",
    title: "Admin | Upper Crust Pizza",
    description: "Admin dashboard for Upper Crust Pizza.",
    noindex: true,
  },
};

export const DEFAULT_ROUTE_SEO = ROUTE_SEO["/"];

export function getRouteSEO(pathname: string): RouteSEO {
  return ROUTE_SEO[pathname] ?? DEFAULT_ROUTE_SEO;
}

export function buildRestaurantJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "FoodEstablishment"],
    "@id": `${SITE_URL}/#restaurant`,
    name: BUSINESS.name,
    description: `${BUSINESS.name} — ${BUSINESS.tagline}. Hand-tossed pizza with delivery and pickup serving Whitefish Bay and the Milwaukee North Shore.`,
    image: `${SITE_URL}/og-image.webp`,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    priceRange: BUSINESS.priceRange,
    servesCuisine: BUSINESS.cuisine,
    foundingDate: String(BUSINESS.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: DELIVERY_AREAS.map((name) => ({
      "@type": "City",
      name,
    })),
    hasMenu: `${SITE_URL}/menu`,
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: BUSINESS.orderUrl,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      deliveryMethod: [
        "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
        "http://purl.org/goodrelations/v1#DeliveryModePickUp",
      ],
    },
    sameAs: [BUSINESS.orderUrl],
  };
}

export function buildWebPageJsonLd(seo: RouteSEO): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: `${SITE_URL}${seo.path === "/" ? "/" : seo.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: BUSINESS.name,
      url: SITE_URL,
    },
    about: { "@id": `${SITE_URL}/#restaurant` },
  };
}
