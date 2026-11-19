export type MediaItem = {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  mediaType: "image" | "video";
  published: boolean;
  sortOrder: number;
};

export type NewsItem = {
  id?: number;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  published: boolean;
  publishedAt?: string | null;
};

export type Product = {
  id?: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  platform: string;
  availability: string;
  purchaseUrl: string;
  published: boolean;
};

export type SiteSettings = {
  overview: string;
  releaseStatus: string;
  releaseDate: string;
  releaseDescription: string;
  platforms: string;
  discordUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  contactEmail: string;
  supportNote: string;
};

export type SiteData = {
  settings: SiteSettings;
  gallery: MediaItem[];
  news: NewsItem[];
  products: Product[];
};

export const FALLBACK_ASSETS = {
  hero: "/manus-storage/async-images/iftyHbM2vq0FfDRO9ux4Pb/image-1.webp",
  laneway: "/manus-storage/async-images/iftyHbM2vq0FfDRO9ux4Pb/image-2.webp",
  tram: "/manus-storage/async-images/iftyHbM2vq0FfDRO9ux4Pb/image-3.webp",
  industrial: "/manus-storage/async-images/iftyHbM2vq0FfDRO9ux4Pb/image-4.webp",
  coast: "/manus-storage/async-images/iftyHbM2vq0FfDRO9ux4Pb/image-5.webp",
} as const;

export const RELEASE_DATE_ISO = "2026-12-31";
export const WHEEL_PRIZE_LABEL = "NEWCOMER game key";
export const NO_WINNER_LABEL = "[NO WINNER]";
export const NO_WINNER_PRIZE_LABEL = "No prize awarded";
export const NO_WINNER_ENTRY_COUNT = 10;

export const DEFAULT_SETTINGS: SiteSettings = {
  overview:
    "NEWCOMER is an upcoming realistic open-world game inspired by Melbourne, Australia. Official game details will be published here as development progresses.",
  releaseStatus: "Release planned for 31 Dec 2026.",
  releaseDate: "31 Dec 2026",
  releaseDescription:
    "NEWCOMER is currently planned for release on 31 Dec 2026. More availability and platform information will be published here as it is confirmed.",
  platforms: "TBA",
  discordUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  contactEmail: "",
  supportNote:
    "For press, partnership, support or community questions, use the form below. The team will publish official contact details here when available.",
};

export const DEFAULT_GALLERY: MediaItem[] = [
  {
    title: "Melbourne after rain",
    description: "Atmospheric reference visual for the world of NEWCOMER.",
    imageUrl: FALLBACK_ASSETS.hero,
    mediaType: "image",
    published: true,
    sortOrder: 0,
  },
  {
    title: "Inner-city laneway",
    description: "A grounded look at the textures and light that shape the setting.",
    imageUrl: FALLBACK_ASSETS.laneway,
    mediaType: "image",
    published: true,
    sortOrder: 1,
  },
  {
    title: "Tramline dawn",
    description: "Australian urban detail, held in a quiet early-morning frame.",
    imageUrl: FALLBACK_ASSETS.tram,
    mediaType: "image",
    published: true,
    sortOrder: 2,
  },
  {
    title: "Industrial edge",
    description: "A visual study of the city’s harder edges and open horizons.",
    imageUrl: FALLBACK_ASSETS.industrial,
    mediaType: "image",
    published: true,
    sortOrder: 3,
  },
  {
    title: "Beyond the city",
    description: "Melbourne’s coastal atmosphere, used as visual context rather than a feature claim.",
    imageUrl: FALLBACK_ASSETS.coast,
    mediaType: "image",
    published: true,
    sortOrder: 4,
  },
];

export const EMPTY_NEWS: NewsItem[] = [];
export const EMPTY_PRODUCTS: Product[] = [];

export const DEFAULT_SITE_DATA: SiteData = {
  settings: DEFAULT_SETTINGS,
  gallery: DEFAULT_GALLERY,
  news: EMPTY_NEWS,
  products: EMPTY_PRODUCTS,
};
