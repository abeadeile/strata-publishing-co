export type HouseKind = 'work' | 'publication' | 'insight';
export type HouseAudience = 'reader' | 'partner' | 'investor';

export interface HouseMedia {
  assetId: string;
  kind: 'image' | 'video';
  alt: string;
  caption?: string;
  credit?: string;
  posterAssetId?: string;
  captionsUrl?: string;
  focalPoint?: { x: number; y: number };
}

export interface HouseCTA {
  label: string;
  href: string;
  external: boolean;
}

export interface HouseItem {
  id: string;
  kind: HouseKind;
  slug: string;
  title: string;
  dek: string;
  category: string;
  publishedAt: string;
  audience: HouseAudience[];
  hero: HouseMedia;
  gallery: HouseMedia[];
  cta?: HouseCTA;
  relatedIds: string[];
  seo?: { title?: string; description?: string; imageAssetId?: string };
}

export interface HouseSettings {
  featuredItemId?: string;
  nav: { label: string; href: string }[];
  social: { label: string; href: string }[];
  newsletterHref?: string;
  contactEmail: string;
}

export interface HouseIndexResult {
  items: HouseItem[];
  total: number;
  filters: { kind?: HouseKind; category?: string; audience?: HouseAudience; page: number };
}
