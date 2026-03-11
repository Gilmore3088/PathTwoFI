import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBlogBySlug } from '../../actions'
import { BlogEditorClient } from './blog-editor-client'

interface BlogEditPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const blog = await getBlogBySlug(slug)
  
  if (!blog) {
    redirect('/dashboard/blogs')
  }

  // Check if user owns this blog
  if (blog.author_id !== data.user.id) {
    redirect('/dashboard/blogs')
  }

  return <BlogEditorClient blog={blog} />
}

