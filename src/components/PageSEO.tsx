import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  buildRestaurantJsonLd,
  buildWebPageJsonLd,
  getRouteSEO,
} from "../config/seo-routes";
import { applyPageSEO } from "../lib/seo";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "../config/site";

export default function PageSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getRouteSEO(pathname);
    const canonicalUrl = absoluteUrl(seo.path);

    const jsonLd =
      seo.path === "/"
        ? [buildRestaurantJsonLd()]
        : [buildRestaurantJsonLd(), buildWebPageJsonLd(seo)];

    applyPageSEO({
      title: seo.title,
      description: seo.description,
      canonicalUrl,
      ogImage: DEFAULT_OG_IMAGE,
      noindex: seo.noindex,
      jsonLd: seo.noindex ? undefined : jsonLd,
    });
  }, [pathname]);

  return null;
}
