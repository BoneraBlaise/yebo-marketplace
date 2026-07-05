import React from "react";
import { Helmet } from "react-helmet";

const SITE_NAME = "Yebone";
const DEFAULT_DESCRIPTION =
  "Yebone — Everything in one place. Discover quality products, shop with confidence, and manage your orders in one unified marketplace.";

const PageMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = "/favicon.svg",
  ogType = "website",
  noIndex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Everything in one place`;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.yebone.com";
  const canonicalUrl = canonical || (typeof window !== "undefined" ? window.location.href : origin);
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${origin}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default PageMeta;
