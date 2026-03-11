'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichBlogEditor } from '@/components/rich-blog-editor'
import { CoverImageUploader } from '@/components/cover-image-uploader'
import { 
  ArrowLeft, 
  Eye, 
  Loader2, 
  Globe, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react'
import Link from 'next/link'
import type { Blog, BlogUpdate, BlogMetadata } from '@/types'
import { 
  autosaveBlog, 
  uploadImage, 
  publishBlog, 
  unpublishBlog, 
  deleteBlog,
  validateSlug
} from '../../actions'
import { generateSlug } from '@/lib/blog-utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface BlogEditorClientProps {
  blog: Blog
}

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle'

export function BlogEditorClient({ blog: initialBlog }: BlogEditorClientProps) {
  const router = useRouter()
  const [blog] = useState(initialBlog)
  const [title, setTitle] = useState(initialBlog.title)
  const [subtitle, setSubtitle] = useState(initialBlog.subtitle || '')
  const [slug, setSlug] = useState(initialBlog.slug)
  const [content, setContent] = useState(initialBlog.content)
  const [imageUrl, setImageUrl] = useState(initialBlog.image_url)
  const [metadata, setMetadata] = useState<BlogMetadata>({
    meta_title: initialBlog.meta_title || undefined,
    meta_description: initialBlog.meta_description || undefined,
    canonical_url: initialBlog.canonical_url || undefined,
    tags: initialBlog.tags || undefined,
  })
  
  const [isPublished, setIsPublished] = useState(initialBlog.published)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isPublishing, setIsPublishing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [slugValidation, setSlugValidation] = useState<{ valid: boolean; suggestion?: string }>({ valid: true })
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastSavedRef = useRef<string>(JSON.stringify({
    title: initialBlog.title,
    subtitle: initialBlog.subtitle,
    slug: initialBlog.slug,
    content: initialBlog.content,
    imageUrl: initialBlog.image_url,
    metadata,
  }))
  const previousSlugRef = useRef(initialBlog.slug)

  // Autosave function
  const performAutosave = useCallback(async () => {
    const currentState = JSON.stringify({ title, subtitle, slug, content, imageUrl, metadata })
    
    // Don't save if nothing changed
    if (currentState === lastSavedRef.current) {
      return
    }

    // Don't save if we're not authenticated anymore
    if (!blog.id) {
      return
    }

    // Don't save if slug validation failed
    if (!slugValidation.valid) {
      setSaveStatus('error')
      toast.error('Invalid slug', {
        description: slugValidation.suggestion ? `Try: ${slugValidation.suggestion}` : 'Please use a unique slug'
      })
      return
    }

    setSaveStatus('saving')

    const updateData: BlogUpdate = {
      title: title || 'Untitled',
      subtitle: subtitle || null,
      slug,
      content,
      image_url: imageUrl || null,
      meta_title: metadata.meta_title || null,
      meta_description: metadata.meta_description || null,
      canonical_url: metadata.canonical_url || null,
      tags: metadata.tags || null,
    }

    const result = await autosaveBlog(blog.id, updateData)

    if (result.success) {
      setSaveStatus('saved')
      lastSavedRef.current = currentState
      
      // Update URL if slug changed
      if (slug !== previousSlugRef.current) {
        router.replace(`/dashboard/blogs/${slug}/edit`, { scroll: false })
        previousSlugRef.current = slug
      }
      
      setTimeout(() => setSaveStatus('idle'), 2000)
    } else {
      setSaveStatus('error')
      console.error('Autosave failed:', result.error)
      
      // If error is related to authentication, redirect to login
      if (result.error?.includes('Unauthorized') || result.error?.includes('JWT')) {
        toast.error('Your session has expired. Please log in again.')
        router.push('/auth/login')
      } else {
        toast.error('Failed to save', {
          description: result.error
        })
      }
    }
  }, [blog.id, title, subtitle, slug, content, imageUrl, metadata, router, slugValidation])

  // Debounced autosave effect
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      performAutosave()
    }, 1000) // 1 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [performAutosave])

  // Auto-generate slug from title (only if user hasn't manually edited it)
  useEffect(() => {
    if (isSlugManuallyEdited) return
    
    if (title && title !== 'Untitled') {
      const newSlug = generateSlug(title)
      setSlug(newSlug)
    }
  }, [title, isSlugManuallyEdited])

  // Validate slug
  useEffect(() => {
    const validateCurrentSlug = async () => {
      if (!slug || slug === initialBlog.slug) {
        setSlugValidation({ valid: true })
        return
      }

      const result = await validateSlug(slug, blog.id)
      setSlugValidation(result)
    }

    const timeoutId = setTimeout(validateCurrentSlug, 500)
    return () => clearTimeout(timeoutId)
  }, [slug, blog.id, initialBlog.slug])

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await uploadImage(file)
    if ('error' in result) {
      throw new Error(result.error)
    }
    return result.url
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Save first
    await performAutosave()

    const result = await publishBlog(blog.id)
    
    if (result.success) {
      toast.success('Published!', {
        description: 'Your blog post is now live.'
      })
      setIsPublished(true)
      // Redirect to the published blog post
      router.push(`/blog/${slug}`)
    } else {
      toast.error('Failed to publish', {
        description: result.error
      })
    }
    
    setIsPublishing(false)
  }

  const handleUnpublish = async () => {
    const result = await unpublishBlog(blog.id)
    
    if (result.success) {
      toast.success('Unpublished', {
        description: 'Your blog post is now a draft.'
      })
      setIsPublished(false)
      router.refresh()
    } else {
      toast.error('Failed to unpublish', {
        description: result.error
      })
    }
  }

  const handleDelete = async () => {
    setShowDeleteDialog(false)
    
    const result = await deleteBlog(blog.id)
    
    if (result.success) {
      toast.success('Deleted', {
        description: 'Your blog post has been deleted.'
      })
      router.push('/dashboard/blogs')
    } else {
      toast.error('Failed to delete', {
        description: result.error
      })
    }
  }

  const SaveIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </div>
        )
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Saved</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Error saving</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <span>Draft</span>
          </div>
        )
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/blogs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>
            <SaveIndicator />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>

            {isPublished ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/blog/${blog.slug}`} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    View Live
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUnpublish}
                >
                  Unpublish
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isPublishing || !slugValidation.valid}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor - Unified Single Column */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Cover Image */}
          <CoverImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            onUpload={handleImageUpload}
          />

          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="text-4xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Subtitle */}
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add a subtitle (optional)"
            className="text-xl text-muted-foreground border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Slug */}
          <div className="space-y-1 pb-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">URL:</span>
              <span className="text-sm text-muted-foreground">/blog/</span>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setIsSlugManuallyEdited(true)
                }}
                placeholder="url-slug"
                className="flex-1 text-sm border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {slugValidation && !slugValidation.valid && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {slugValidation && slugValidation.valid && slug.length > 0 && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
            </div>
            {slugValidation && !slugValidation.valid && slugValidation.suggestion && (
              <p className="text-xs text-destructive">
                This slug is already taken. Try: <button 
                  onClick={() => {
                    setSlug(slugValidation.suggestion!)
                    setIsSlugManuallyEdited(true)
                  }}
                  className="underline font-medium"
                >
                  {slugValidation.suggestion}
                </button>
              </p>
            )}
          </div>

          {/* Editor */}
          <RichBlogEditor
            key={blog.id}
            content={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
            placeholder="Start writing your story..."
          />

          {/* SEO & Metadata Section */}
          <div className="pt-6 border-t space-y-4">
            <h3 className="text-lg font-semibold">SEO & Metadata</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title" className="text-sm">Meta Title (optional)</Label>
                <Input
                  id="meta-title"
                  placeholder="Override the default title for SEO"
                  value={metadata.meta_title || ''}
                  onChange={(e) => setMetadata({ ...metadata, meta_title: e.target.value })}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {metadata.meta_title?.length || 0}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description" className="text-sm">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Brief description for search results"
                  value={metadata.meta_description || ''}
                  onChange={(e) => setMetadata({ ...metadata, meta_description: e.target.value })}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {metadata.meta_description?.length || 0}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical-url" className="text-sm">Canonical URL (optional)</Label>
                <Input
                  id="canonical-url"
                  type="url"
                  placeholder="https://example.com/original-post"
                  value={metadata.canonical_url || ''}
                  onChange={(e) => setMetadata({ ...metadata, canonical_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  If this content was published elsewhere first
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(metadata.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = (metadata.tags || []).filter(t => t !== tag)
                          setMetadata({ ...metadata, tags: newTags })
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Type a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      const input = e.currentTarget
                      const tag = input.value.trim().toLowerCase()
                      if (tag && !(metadata.tags || []).includes(tag)) {
                        setMetadata({ ...metadata, tags: [...(metadata.tags || []), tag] })
                        input.value = ''
                      }
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter or comma to add tags
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete your blog post. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

