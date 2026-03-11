-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  image_url TEXT,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published BOOLEAN NOT NULL DEFAULT false
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON public.blogs(slug);

-- Create index on author_id for faster author queries
CREATE INDEX IF NOT EXISTS blogs_author_id_idx ON public.blogs(author_id);

-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS blogs_published_idx ON public.blogs(published);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published blogs
CREATE POLICY "Anyone can view published blogs"
  ON public.blogs
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can view all their own blogs
CREATE POLICY "Users can view their own blogs"
  ON public.blogs
  FOR SELECT
  USING (auth.uid() = author_id);

-- Policy: Authenticated users can insert their own blogs
CREATE POLICY "Users can insert their own blogs"
  ON public.blogs
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own blogs
CREATE POLICY "Users can update their own blogs"
  ON public.blogs
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own blogs
CREATE POLICY "Users can delete their own blogs"
  ON public.blogs
  FOR DELETE
  USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS on_blog_updated ON public.blogs;
CREATE TRIGGER on_blog_updated
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_blog_updated_at();
