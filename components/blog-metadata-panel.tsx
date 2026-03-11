'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CoverImageUploader } from './cover-image-uploader'
import { Badge } from '@/components/ui/badge'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'
import type { BlogMetadata } from '@/types'

interface BlogMetadataPanelProps {
  slug: string
  imageUrl?: string | null
  metadata?: BlogMetadata
  onSlugChange: (slug: string) => void
  onImageUrlChange: (url: string | null) => void
  onMetadataChange: (metadata: BlogMetadata) => void
  onImageUpload?: (file: File) => Promise<string>
  slugValidation?: { valid: boolean; suggestion?: string }
}

export function BlogMetadataPanel({
  slug,
  imageUrl,
  metadata = {},
  onSlugChange,
  onImageUrlChange,
  onMetadataChange,
  onImageUpload,
  slugValidation,
}: BlogMetadataPanelProps) {
  const [tags, setTags] = useState<string[]>(metadata.tags || [])
  const [tagInput, setTagInput] = useState('')

  const handleMetadataFieldChange = (field: keyof BlogMetadata, value: string) => {
    onMetadataChange({
      ...metadata,
      [field]: value,
    })
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (tag && !tags.includes(tag)) {
        const newTags = [...tags, tag]
        setTags(newTags)
        onMetadataChange({
          ...metadata,
          tags: newTags,
        })
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    onMetadataChange({
      ...metadata,
      tags: newTags,
    })
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardContent className="pt-6">
          <CoverImageUploader
            value={imageUrl}
            onChange={onImageUrlChange}
            onUpload={onImageUpload}
          />
        </CardContent>
      </Card>

      {/* Slug */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">URL Slug</CardTitle>
          <CardDescription className="text-xs">
            The URL-friendly version of your title
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Input
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="my-blog-post"
              pattern="[a-z0-9-]+"
            />
            {slugValidation && !slugValidation.valid && (
              <div className="flex items-start gap-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>This slug is already taken.</p>
                  {slugValidation.suggestion && (
                    <p className="text-muted-foreground">
                      Suggestion: {slugValidation.suggestion}
                    </p>
                  )}
                </div>
              </div>
            )}
            {slugValidation && slugValidation.valid && slug.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Slug is available</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            /blog/{slug || 'your-slug'}
          </p>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">SEO & Metadata</CardTitle>
          <CardDescription className="text-xs">
            Optimize for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta-title" className="text-xs">Meta Title</Label>
            <Input
              id="meta-title"
              placeholder="Optional: Override default title"
              value={metadata.meta_title || ''}
              onChange={(e) => handleMetadataFieldChange('meta_title', e.target.value)}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {metadata.meta_title?.length || 0}/60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-description" className="text-xs">Meta Description</Label>
            <Textarea
              id="meta-description"
              placeholder="Brief description for search results"
              value={metadata.meta_description || ''}
              onChange={(e) => handleMetadataFieldChange('meta_description', e.target.value)}
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {metadata.meta_description?.length || 0}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical-url" className="text-xs">Canonical URL</Label>
            <Input
              id="canonical-url"
              type="url"
              placeholder="https://example.com/original-post"
              value={metadata.canonical_url || ''}
              onChange={(e) => handleMetadataFieldChange('canonical_url', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              If this content was published elsewhere first
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tags</CardTitle>
          <CardDescription className="text-xs">
            Help readers find your content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
          <p className="text-xs text-muted-foreground">
            Press Enter or comma to add tags
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

