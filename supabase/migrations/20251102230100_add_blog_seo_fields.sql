-- Add SEO and metadata fields to blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add index on tags for searching
CREATE INDEX IF NOT EXISTS blogs_tags_idx ON public.blogs USING GIN(tags);

