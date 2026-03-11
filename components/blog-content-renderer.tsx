'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Underline } from '@tiptap/extension-underline'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { useEffect } from 'react'

interface BlogContentRendererProps {
  content: string
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit,
      Link,
      Image,
      Underline,
      Table,
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-1',
        },
      }),
      Highlight,
      Typography,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && content) {
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content
        editor.commands.setContent(parsedContent)
      } catch (e) {
        console.error('Failed to parse blog content:', e)
      }
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}

