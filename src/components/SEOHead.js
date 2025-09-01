import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_META } from '../utils/constants';
import config from '../config/environment';

const SEOHead = ({ 
  title = SEO_META.title,
  description = SEO_META.description,
  keywords = SEO_META.keywords.join(', '),
  image = '/images/og-default.jpg',
  url = window.location.href,
  type = 'website',
  author = 'TileCraft Premium',
  publishedTime = null,
  modifiedTime = null
}) => {
  const fullTitle = title === SEO_META.title ? title : `${title} | ${config.APP_NAME}`;
  const canonicalUrl = url.split('?')[0].split('#')[0]; // Remove query params and hash

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={config.APP_NAME} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@TileCraftPremium" />
      <meta name="twitter:creator" content="@TileCraftPremium" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Tiles" />
          <meta property="article:tag" content="ceramic tiles, porcelain tiles, building materials" />
        </>
      )}
      
      {/* Business/Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": config.APP_NAME,
          "description": description,
          "url": config.isProduction() ? "https://tilecraftpremium.com" : canonicalUrl,
          "logo": "/images/logo-192.png",
          "sameAs": [
            config.SOCIAL.LINKEDIN_URL,
            config.SOCIAL.INSTAGRAM_URL,
            config.SOCIAL.FACEBOOK_URL
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": config.CONTACT.PHONE,
            "contactType": "Customer Service",
            "email": config.CONTACT.SUPPORT_EMAIL
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US",
            "addressLocality": "USA"
          }
        })}
      </script>
      
      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": config.APP_NAME,
          "description": description,
          "url": canonicalUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${canonicalUrl}?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

// Specific SEO components for different pages
export const HomeSEO = () => (
  <SEOHead 
    title="Premium Ceramic & Porcelain Tiles - Professional Collection | TileCraft Premium"
    description="Discover professional-grade ceramic and porcelain tiles for commercial and residential projects. Industry-certified quality with comprehensive inventory and competitive US market pricing."
    keywords="ceramic tiles, porcelain tiles, professional tiles, commercial tiles, residential tiles, tile wholesale, building materials, construction supplies"
  />
);

export const ProductSEO = ({ tile }) => (
  <SEOHead 
    title={`${tile.series} ${tile.material} - ${tile.size} Tiles`}
    description={`Premium ${tile.type === 'GP' ? 'porcelain' : 'ceramic'} tile: ${tile.series} in ${tile.material}. ${tile.size} format with ${tile.surface} finish. PEI Rating: ${tile.peiRating}. Available for immediate shipping.`}
    keywords={`${tile.series}, ${tile.material}, ${tile.category}, ${tile.surface} finish, ${tile.peiRating}, ${tile.type === 'GP' ? 'porcelain' : 'ceramic'} tiles`}
    type="product"
  />
);

export const CategorySEO = ({ category, count }) => (
  <SEOHead 
    title={`${category} Tiles - Professional Collection`}
    description={`Browse our ${category.toLowerCase()} tile collection. ${count} premium options available with detailed specifications, competitive pricing, and immediate availability.`}
    keywords={`${category} tiles, ${category.toLowerCase()}, ceramic tiles, porcelain tiles, professional tiles`}
  />
);

export default SEOHead;