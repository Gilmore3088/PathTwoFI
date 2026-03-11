'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Blog, BlogInsert, BlogUpdate, ImageUploadResult } from '@/types'
import { generateSlug } from '@/lib/blog-utils'

// Helper to get unique slug
async function getUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const supabase = await createClient()
  let slug = baseSlug
  let counter = 1
  let slugExists = true

  while (slugExists) {
    let query = supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()

    if (!data || error) {
      slugExists = false
    } else {
      slug = `${baseSlug}-${counter}`
      counter++
    }
  }

  return slug
}

// Create a draft blog post (auto-creates on "New Blog" click)
export async function createDraft(): Promise<{ id: string; slug: string } | { error: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    // Ensure user has a profile (create if doesn't exist)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        })

      if (profileError) {
        console.error('Failed to create profile:', profileError)
        return { error: 'Failed to create user profile. Please contact support.' }
      }
    }

    // Generate a unique slug for "Untitled"
    const baseSlug = generateSlug('untitled')
    const slug = await getUniqueSlug(baseSlug)

    const blogData: BlogInsert = {
      title: 'Untitled',
      slug,
      content: JSON.stringify({ type: 'doc', content: [] }),
      author_id: user.id,
      published: false,
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert(blogData)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/blogs')
    return { id: data.id, slug: data.slug }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to create draft' }
  }
}

// Validate slug uniqueness
export async function validateSlug(slug: string, excludeId?: string): Promise<{ valid: boolean; suggestion?: string }> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.maybeSingle()

    if (data) {
      // Slug exists, provide a suggestion
      const suggestion = await getUniqueSlug(slug, excludeId)
      return { valid: false, suggestion }
    }

    return { valid: true }
  } catch (err) {
    return { valid: false }
  }
}

// Autosave blog (doesn't redirect, returns result)
export async function autosaveBlog(id: string, data: BlogUpdate): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('blogs')
      .update(data)
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath(`/dashboard/blogs/${id}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to autosave' }
  }
}

// Upload image to Supabase Storage
export async function uploadImage(file: File): Promise<ImageUploadResult | { error: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Unauthorized' }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${timestamp}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to upload image' }
  }
}

// Publish a blog
export async function publishBlog(id: string): Promise<{ success: boolean; error?: string; slug?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get the blog to validate
    const { data: blog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('author_id', user.id)
      .single()

    if (fetchError || !blog) {
      return { success: false, error: 'Blog not found' }
    }

    // Validate required fields
    if (!blog.title || blog.title === 'Untitled') {
      return { success: false, error: 'Please add a title before publishing' }
    }

    if (!blog.content || blog.content.length < 100) {
      return { success: false, error: 'Content is too short. Add more content before publishing.' }
    }

    // Publish the blog
    const { error } = await supabase
      .from('blogs')
      .update({ published: true })
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath(`/dashboard/blogs/${blog.slug}`)
    revalidatePath('/blog')
    revalidatePath(`/blog/${blog.slug}`)
    
    return { success: true, slug: blog.slug }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to publish' }
  }
}

// Unpublish a blog
export async function unpublishBlog(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('blogs')
      .update({ published: false })
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath(`/dashboard/blogs/${id}`)
    revalidatePath('/blog')
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to unpublish' }
  }
}

// Get blog by ID (for editing)
export async function getBlogById(id: string): Promise<Blog | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .eq('author_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Blog
}

// Get blog by slug (authenticated - for editing)
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('author_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Blog
}

// Get published blog by slug (public access)
export async function getPublishedBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as Blog
}

export async function getAllBlogs(): Promise<Blog[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data as Blog[]
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data as Blog[]
}

// Public version for static generation (no auth required)
export async function getPublishedBlogsStatic(): Promise<Blog[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  
  if (!url || !key) {
    return []
  }

  try {
    const response = await fetch(`${url}/rest/v1/blogs?published=eq.true&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data as Blog[]
  } catch (error) {
    console.error('Error fetching published blogs:', error)
    return []
  }
}

export async function deleteBlog(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('author_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath('/blog')
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete' }
  }
}

