"use client"

import React, { memo, useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { 
  FileText, FileEdit, Package, Briefcase, Folder, Globe, 
  ChevronDown, ChevronRight, Edit3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ContentBlock, ContentBlocksList } from './content-block'

interface PageData {
  page: {
    id: string
    title: string
    slug: string
    contentType: 'page' | 'post' | 'product' | 'portfolio'
    menu?: string
    priority: string
  }
  hasContent: boolean
  childCount: number
  contentBlocks?: ContentBlock[]
  isExpanded?: boolean
}


export const SitemapNode = memo(({ data, selected }: NodeProps<PageData>) => {
  const { page, hasContent, childCount, contentBlocks = [], isExpanded: initialExpanded = false } = data
  const [isExpanded, setIsExpanded] = useState(initialExpanded)
  
  // Get icon based on page type
  const getIcon = () => {
    if (page.id === 'root') return <Globe className="h-4 w-4" />
    if (page.id.startsWith('menu-')) return <Folder className="h-4 w-4" />
    
    switch (page.contentType) {
      case 'post':
        return <FileEdit className="h-4 w-4" />
      case 'product':
        return <Package className="h-4 w-4" />
      case 'portfolio':
        return <Briefcase className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  
  // Determine node styling
  const getNodeClasses = () => {
    const baseClasses = cn(
      "rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden",
      isExpanded ? "min-w-[320px]" : "min-w-[180px]"
    )
    
    if (page.id === 'root') {
      return cn(baseClasses, "bg-primary text-primary-foreground border-primary shadow-lg")
    }
    
    if (page.id.startsWith('menu-')) {
      return cn(baseClasses, "bg-muted text-foreground border-muted-foreground/20")
    }
    
    if (hasContent) {
      return cn(baseClasses, "bg-green-50 text-green-900 border-green-500 dark:bg-green-950/50 dark:text-green-100 dark:border-green-700")
    }
    
    return cn(baseClasses, "bg-card text-card-foreground border-border hover:border-primary/50")
  }

  
  return (
    <div className={cn(getNodeClasses(), selected && "ring-2 ring-primary ring-offset-2")}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-primary border-2 border-background"
        style={{ top: -5 }}
      />
      
      {/* Main node header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getIcon()}
            <h3 className="font-semibold text-sm leading-none truncate">{page.title}</h3>
          </div>
          
          {/* Expand/collapse button for content blocks */}
          {contentBlocks.length > 0 && (
            <Button
              size="icon-xxs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="shrink-0 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
        
        {page.slug && !page.id.startsWith('menu-') && page.id !== 'root' && (
          <p className="text-xs text-muted-foreground mb-2">/{page.slug}</p>
        )}
        
        {/* Content blocks summary when collapsed */}
        {!isExpanded && contentBlocks.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {contentBlocks.length} blocks
            </Badge>
            <div className="flex gap-1">
              {contentBlocks.slice(0, 3).map((block) => (
                <div
                  key={block.id}
                  className="h-2 w-2 rounded-full bg-muted-foreground/30"
                  title={block.title}
                />
              ))}
              {contentBlocks.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{contentBlocks.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {childCount > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{childCount} items</span>
          </div>
        )}
      </div>
      
      {/* Expanded content blocks */}
      {isExpanded && contentBlocks.length > 0 && (
        <div className="border-t border-border/50 bg-muted/20">
          <div className="px-4 py-2">
            <ContentBlocksList
              blocks={contentBlocks}
              onEditBlock={(block) => {
                // Handle block edit - could emit event or call callback
                console.log('Edit block:', block)
              }}
              compact={true}
              maxHeight="300px"
            />
          </div>
        </div>
      )}
      
      {/* Status indicators */}
      {hasContent && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
      )}
      
      {contentBlocks.length > 0 && !hasContent && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-primary border-2 border-background"
        style={{ bottom: -5 }}
      />
    </div>
  )
})

SitemapNode.displayName = 'SitemapNode'