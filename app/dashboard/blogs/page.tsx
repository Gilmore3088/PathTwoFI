import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAllBlogs } from './actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateBlogButton } from '@/components/create-blog-button'

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const blogs = await getAllBlogs()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your blog content.
          </p>
        </div>
        <CreateBlogButton />
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <CreateBlogButton />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/dashboard/blogs/${blog.slug}/edit`}>
              <Card className="h-full hover:bg-accent/50 transition-colors">
                {blog.image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                    <Badge variant={blog.published ? 'default' : 'secondary'}>
                      {blog.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  {blog.subtitle && (
                    <CardDescription className="line-clamp-2">
                      {blog.subtitle}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
