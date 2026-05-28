function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`,
  );
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

const PAGE_JSON_LD_ID = "page-jsonld";

export function applyPageSEO(options: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}): void {
  const { title, description, canonicalUrl, ogImage, noindex, jsonLd } = options;

  document.title = title;

  upsertMeta("name", "description", description);
  upsertMeta(
    "name",
    "robots",
    noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
  );
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", ogImage);

  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:url", canonicalUrl);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", "Upper Crust Pizza");
  upsertMeta("property", "og:locale", "en_US");

  upsertLink("canonical", canonicalUrl);

  const existingJsonLd = document.getElementById(PAGE_JSON_LD_ID);
  existingJsonLd?.remove();

  if (jsonLd?.length) {
    const script = document.createElement("script");
    script.id = PAGE_JSON_LD_ID;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(
      jsonLd.length === 1 ? jsonLd[0] : jsonLd,
    );
    document.head.appendChild(script);
  }
}
