'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusIcon, Loader2 } from 'lucide-react'
import { createDraft } from '@/app/dashboard/blogs/actions'
import { toast } from 'sonner'

export function CreateBlogButton() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateBlog = async () => {
    setIsCreating(true)
    
    try {
      const result = await createDraft()
      
      if ('error' in result) {
        toast.error('Failed to create blog', {
          description: result.error
        })
        setIsCreating(false)
        return
      }

      toast.success('Draft created!', {
        description: 'Your new blog post is ready to edit.'
      })

      // Redirect to the editor
      router.push(`/dashboard/blogs/${result.slug}/edit`)
    } catch (error) {
      toast.error('Failed to create blog', {
        description: error instanceof Error ? error.message : 'An error occurred'
      })
      setIsCreating(false)
    }
  }

  return (
    <Button onClick={handleCreateBlog} disabled={isCreating}>
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Blog
        </>
      )}
    </Button>
  )
}

