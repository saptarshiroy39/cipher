import type { MetadataRoute } from "next";

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://cipher.hirishi.in",
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://cipher.hirishi.in/encrypt",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://cipher.hirishi.in/decrypt",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://cipher.hirishi.in/attack",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://cipher.hirishi.in/report",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
