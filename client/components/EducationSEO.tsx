import { useEffect } from "react";

interface EducationSEOProps {
  pageTitle?: string;
  description?: string;
  ogImage?: string;
}

export default function EducationSEO({
  pageTitle = "AeThex Education",
  description = "Free game development education for the metaverse generation. Learn Roblox, Fortnite, Unity, and more.",
  ogImage = "/aethex-logo.png"
}: EducationSEOProps) {
  const fullTitle = pageTitle.includes("AeThex Education")
    ? pageTitle
    : `${pageTitle} - AeThex Education`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update manifest link for education domain
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/education.webmanifest');
    }

    // Update theme color for education branding
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute('content', '#2563eb'); // Education blue

    // Update Open Graph tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('og:site_name', 'AeThex Education');
    updateOrCreateMeta('og:title', fullTitle);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:image', ogImage);
    updateOrCreateMeta('og:type', 'website');

    // Update Twitter Card tags
    const updateOrCreateTwitter = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateTwitter('twitter:card', 'summary_large_image');
    updateOrCreateTwitter('twitter:title', fullTitle);
    updateOrCreateTwitter('twitter:description', description);
    updateOrCreateTwitter('twitter:image', ogImage);
    updateOrCreateTwitter('application-name', 'AeThex Education');
  }, [fullTitle, description, ogImage]);

  return null;
}
