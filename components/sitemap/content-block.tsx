"use client"

import React from 'react'
import { 
  Type, Image, Layout, MessageSquare, BarChart3, 
  Users, Mail, Edit3, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ContentBlock {
  id: string
  type: 'header' | 'text' | 'image' | 'gallery' | 'testimonial' | 'stats' | 'contact' | 'form' | 'custom'
  title: string
  content: string
  settings?: Record<string, unknown>
}

// Content block icon mapping
export const getBlockIcon = (type: ContentBlock['type']) => {
  const iconMap = {
    header: Type,
    text: FileText,
    image: Image,
    gallery: Layout,
    testimonial: MessageSquare,
    stats: BarChart3,
    contact: Users,
    form: Mail,
    custom: Edit3
  }
  
  const IconComponent = iconMap[type] || FileText
  return <IconComponent className="h-3 w-3" />
}

// Content block color mapping
export const getBlockColor = (type: ContentBlock['type']) => {
  const colorMap = {
    header: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    text: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
    image: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    gallery: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    testimonial: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border-green-200 dark:border-green-800',
    stats: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 border-orange-200 dark:border-orange-800',
    contact: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800',
    form: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-200 dark:border-red-800',
    custom: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200 border-pink-200 dark:border-pink-800'
  }
  
  return colorMap[type] || colorMap.text
}

// Content block type labels
export const getBlockTypeLabel = (type: ContentBlock['type']) => {
  const labelMap = {
    header: 'Header',
    text: 'Text',
    image: 'Image',
    gallery: 'Gallery',
    testimonial: 'Testimonial',
    stats: 'Statistics',
    contact: 'Contact',
    form: 'Form',
    custom: 'Custom'
  }
  
  return labelMap[type] || 'Unknown'
}

interface ContentBlockItemProps {
  block: ContentBlock
  index: number
  onEdit?: (block: ContentBlock) => void
  onDelete?: (blockId: string) => void
  maxContentLength?: number
  showIndex?: boolean
  compact?: boolean
}

export function ContentBlockItem({ 
  block, 
  index, 
  onEdit,
  onDelete,
  maxContentLength = 60,
  showIndex = true,
  compact = false
}: ContentBlockItemProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(block)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(block.id)
  }

  return (
    <div
      className={cn(
        "group relative rounded-md border bg-background/50 transition-all duration-200 cursor-pointer hover:bg-background/80 hover:shadow-sm",
        compact ? "p-2" : "p-3",
        getBlockColor(block.type)
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start gap-2">
        <div className={cn(
          "flex items-center justify-center rounded-sm shrink-0",
          compact ? "p-1" : "p-1.5",
          getBlockColor(block.type)
        )}>
          {getBlockIcon(block.type)}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className={cn(
              "font-medium text-foreground leading-none truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              {block.title}
            </p>
            <Badge 
              variant="outline" 
              className={cn(
                "leading-none shrink-0",
                compact ? "text-[9px] px-1 py-0" : "text-[10px] px-1 py-0"
              )}
            >
              {getBlockTypeLabel(block.type)}
            </Badge>
          </div>
          
          {block.content && (
            <p className={cn(
              "text-muted-foreground leading-tight",
              compact ? "text-[9px]" : "text-[10px]"
            )}>
              {truncateText(block.content, maxContentLength)}
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              size="icon-xxs"
              variant="ghost"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                compact ? "h-3 w-3" : "h-4 w-4"
              )}
              onClick={handleEdit}
              title="Edit block"
            >
              <Edit3 className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} />
            </Button>
          )}
        </div>
      </div>
      
      {/* Block index indicator */}
      {showIndex && (
        <div className={cn(
          "absolute -left-1 top-1 bg-primary/10 text-primary rounded-full flex items-center justify-center",
          compact ? "h-3 w-3" : "h-4 w-4"
        )}>
          <span className={cn(
            "font-semibold",
            compact ? "text-[7px]" : "text-[8px]"
          )}>
            {index + 1}
          </span>
        </div>
      )}
    </div>
  )
}

interface ContentBlocksListProps {
  blocks: ContentBlock[]
  onEditBlock?: (block: ContentBlock) => void
  onDeleteBlock?: (blockId: string) => void
  maxHeight?: string
  compact?: boolean
  showHeader?: boolean
}

export function ContentBlocksList({ 
  blocks, 
  onEditBlock,
  onDeleteBlock,
  maxHeight = "300px",
  compact = false,
  showHeader = true
}: ContentBlocksListProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">No content blocks</p>
      </div>
    )
  }

  return (
    <div>
      {showHeader && (
        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Content Blocks ({blocks.length})
        </div>
      )}
      
      <div 
        className="space-y-2 overflow-y-auto"
        style={{ maxHeight }}
      >
        {blocks.map((block, index) => (
          <ContentBlockItem
            key={block.id}
            block={block}
            index={index}
            onEdit={onEditBlock}
            onDelete={onDeleteBlock}
            compact={compact}
          />
        ))}
      </div>
    </div>
  )
}