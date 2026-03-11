'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import Image from 'next/image'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { createClient } from '@/lib/supabase/client'

interface CoverImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  onUpload?: (file: File) => Promise<string>
}

export function CoverImageUploader({ value, onChange, onUpload }: CoverImageUploaderProps) {
  const [urlInput, setUrlInput] = useState(value || '')
  const [userId, setUserId] = useState<string | null>(null)
  const uploadTriggeredRef = useRef(false)

  // Get user ID for the upload path
  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUserId()
  }, [])

  const uploadProps = useSupabaseUpload({
    bucketName: 'blog-images',
    path: userId || undefined, // Upload to user's folder
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024, // 5MB max
    maxFiles: 1,
    upsert: false,
  })

  // Auto-upload when a file is selected
  useEffect(() => {
    if (uploadProps.files.length > 0 && !uploadProps.loading && !uploadProps.isSuccess && !uploadTriggeredRef.current) {
      // Check if file has no errors
      const hasErrors = uploadProps.files.some(file => file.errors.length > 0)
      console.log('Auto-upload check:', { 
        filesCount: uploadProps.files.length, 
        loading: uploadProps.loading, 
        isSuccess: uploadProps.isSuccess, 
        hasErrors, 
        userId,
        triggered: uploadTriggeredRef.current 
      })
      
      if (!hasErrors && userId) {
        console.log('Starting auto-upload...')
        uploadTriggeredRef.current = true
        uploadProps.onUpload()
      } else if (!userId) {
        console.warn('Cannot upload: userId is null')
      }
    }
    // Reset the flag when upload completes or files are cleared
    if (uploadProps.files.length === 0 || uploadProps.isSuccess) {
      uploadTriggeredRef.current = false
    }
  }, [uploadProps.files.length, uploadProps.loading, uploadProps.isSuccess, userId, uploadProps.onUpload])

  // Handle successful upload
  useEffect(() => {
    if (uploadProps.isSuccess && uploadProps.successes.length > 0) {
      const supabase = createClient()
      
      // Use the sanitized filename from successes array
      const sanitizedFileName = uploadProps.successes[0]
      const filePath = userId ? `${userId}/${sanitizedFileName}` : sanitizedFileName
      
      console.log('Upload successful, generating public URL for:', filePath)
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)
      
      console.log('Public URL:', publicUrl)
      onChange(publicUrl)
      setUrlInput(publicUrl)
    }
  }, [uploadProps.isSuccess, uploadProps.successes, userId, onChange])

  // Log upload errors
  useEffect(() => {
    if (uploadProps.errors.length > 0) {
      console.error('Upload errors:', uploadProps.errors)
    }
  }, [uploadProps.errors])

  const handleUrlChange = (url: string) => {
    setUrlInput(url)
    onChange(url || null)
  }

  const handleRemove = () => {
    onChange(null)
    setUrlInput('')
    uploadProps.setFiles([])
  }

  return (
    <div className="space-y-4">
      <Label>Cover Image</Label>
      
      {value ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={value}
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Dropzone for drag and drop */}
          <Dropzone {...uploadProps} className="min-h-[150px]">
            {uploadProps.files.length === 0 ? (
              <DropzoneEmptyState />
            ) : (
              <DropzoneContent />
            )}
          </Dropzone>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or use URL
              </span>
            </div>
          </div>

          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}


