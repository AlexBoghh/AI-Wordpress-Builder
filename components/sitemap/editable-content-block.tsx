"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ContentBlock, EditableContentBlock } from '@/types/content-blocks'
import { getBlockTitle } from '@/lib/content-block-parser'
import { Edit2, Check, X, Type, List, Quote, MousePointer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EditableContentBlockProps {
  block: EditableContentBlock
  onUpdate: (blockId: string, updates: Partial<ContentBlock>) => void
  onCancel?: () => void
  className?: string
}

export function EditableContentBlockComponent({
  block,
  onUpdate,
  onCancel,
  className
}: EditableContentBlockProps) {
  const [isEditing, setIsEditing] = useState(block.isEditing || false)
  const [editContent, setEditContent] = useState(block.content)
  const [editAttributes, setEditAttributes] = useState(block.attributes || {})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      if (block.type === 'heading' && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      } else if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.select()
      }
    }
  }, [isEditing, block.type])

  const handleSave = () => {
    onUpdate(block.id, {
      content: editContent,
      attributes: editAttributes
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(block.content)
    setEditAttributes(block.attributes || {})
    setIsEditing(false)
    onCancel?.()
  }

  const getBlockIcon = () => {
    switch (block.type) {
      case 'heading':
        return <Type className="h-3 w-3" />
      case 'paragraph':
        return <Edit2 className="h-3 w-3" />
      case 'list':
        return <List className="h-3 w-3" />
      case 'quote':
        return <Quote className="h-3 w-3" />
      case 'button':
        return <MousePointer className="h-3 w-3" />
      default:
        return <Edit2 className="h-3 w-3" />
    }
  }

  const renderEditForm = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Heading text..."
                className="flex-1 text-sm"
              />
              <Select
                value={String(editAttributes.level || 2)}
                onValueChange={(value) => setEditAttributes({ ...editAttributes, level: parseInt(value) })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                  <SelectItem value="5">H5</SelectItem>
                  <SelectItem value="6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'list':
        return (
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => {
              setEditContent(e.target.value)
              // Update items attribute
              const items = e.target.value.split('\n').filter(item => item.trim())
              setEditAttributes({ ...editAttributes, items })
            }}
            placeholder="Enter list items (one per line)..."
            className="text-sm min-h-[80px]"
          />
        )

      case 'button':
        return (
          <div className="space-y-2">
            <Input
              ref={inputRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Button text..."
              className="text-sm"
            />
          </div>
        )

      default:
        return (
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter content..."
            className="text-sm min-h-[60px]"
          />
        )
    }
  }

  if (isEditing) {
    return (
      <div className={cn("space-y-2 p-3 border rounded-lg bg-background", className)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getBlockIcon()}
            <span className="text-xs font-medium">{getBlockTitle(block)}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-6 px-2"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-6 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {renderEditForm()}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer",
        block.isDirty && "bg-yellow-50 dark:bg-yellow-950/20",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {getBlockIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h5 className="text-xs font-medium">{getBlockTitle(block)}</h5>
            {block.isDirty && (
              <span className="text-[10px] text-yellow-600 dark:text-yellow-400">Modified</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-3">
            {block.content || <span className="italic">No content</span>}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}