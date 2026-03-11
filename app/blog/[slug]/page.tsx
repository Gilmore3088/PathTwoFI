import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublishedBlogBySlug, getPublishedBlogsStatic } from '@/app/dashboard/blogs/actions'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import { BlogContentRenderer } from '@/components/blog-content-renderer'

export async function generateStaticParams() {
  const blogs = await getPublishedBlogsStatic()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getPublishedBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
          {blog.subtitle && (
            <p className="text-xl text-muted-foreground mb-4">{blog.subtitle}</p>
          )}
          <time className="text-sm text-muted-foreground">
            {new Date(blog.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {blog.image_url && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <BlogContentRenderer content={blog.content} />
      </article>
    </div>
  )
}
