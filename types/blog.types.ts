export interface Blog {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  image_url?: string | null;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  tags?: string[] | null;
}

export interface BlogInsert {
  title: string;
  slug: string;
  subtitle?: string | null;
  image_url?: string | null;
  content: string;
  author_id: string;
  published?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  tags?: string[] | null;
}

export interface BlogUpdate {
  title?: string;
  slug?: string;
  subtitle?: string | null;
  image_url?: string | null;
  content?: string;
  published?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  tags?: string[] | null;
}

export interface BlogMetadata {
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  tags?: string[];
}

export interface ImageUploadResult {
  url: string;
  path: string;
}
