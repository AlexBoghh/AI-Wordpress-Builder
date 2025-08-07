"use client"

import React, { memo, useState, useCallback } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { 
  FileText, FileEdit, Package, Briefcase, Folder, Globe, 
  ChevronRight, ChevronDown, Type, List, Quote, Hash,
  MousePointer, Minus, Image, Layout, MessageSquare,
  BarChart3, Users, Mail, Edit3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentBlock } from '@/types/content-blocks'
import { getBlockTitle } from '@/lib/content-block-parser'
import { WireframeBlock } from './wireframe-blocks'

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

export const ExpandableSitemapNode = memo(({ data, selected }: NodeProps<PageData>) => {
  const { page, hasContent, childCount, contentBlocks = [] } = data
  const [isExpanded, setIsExpanded] = useState(data.isExpanded || false)
  const [showWireframe, setShowWireframe] = useState(false)
  
  // Get icon based on page type
  const getPageIcon = () => {
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
  
  // Get icon for content block type
  const getBlockIcon = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return <Type className="h-3 w-3" />
      case 'paragraph':
        return <FileText className="h-3 w-3" />
      case 'list':
        return <List className="h-3 w-3" />
      case 'quote':
        return <Quote className="h-3 w-3" />
      case 'button':
        return <MousePointer className="h-3 w-3" />
      case 'separator':
        return <Minus className="h-3 w-3" />
      case 'section':
        return <Layout className="h-3 w-3" />
      default:
        return <Edit3 className="h-3 w-3" />
    }
  }
  
  // Get color for block type
  const getBlockColor = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return 'text-blue-600 dark:text-blue-400'
      case 'section':
        return 'text-purple-600 dark:text-purple-400'
      case 'list':
        return 'text-green-600 dark:text-green-400'
      case 'quote':
        return 'text-orange-600 dark:text-orange-400'
      case 'button':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }
  
  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }, [isExpanded])
  
  // Determine node styling
  const getNodeClasses = () => {
    const baseClasses = "bg-card border-2 rounded-lg transition-all duration-300 cursor-pointer"
    const widthClasses = isExpanded ? "min-w-[320px]" : "min-w-[180px]"
    
    if (page.id === 'root') {
      return cn(baseClasses, widthClasses, "bg-primary text-primary-foreground border-primary shadow-lg")
    }
    
    if (page.id.startsWith('menu-')) {
      return cn(baseClasses, widthClasses, "bg-muted text-foreground border-muted-foreground/20")
    }
    
    if (hasContent) {
      return cn(baseClasses, widthClasses, "bg-green-50 text-green-900 border-green-500 dark:bg-green-950/50 dark:text-green-100 dark:border-green-700")
    }
    
    return cn(baseClasses, widthClasses, "bg-card text-card-foreground border-border hover:border-primary/50")
  }
  
  // Don't show expand button for root or menu nodes
  const canExpand = !page.id.startsWith('menu-') && page.id !== 'root' && contentBlocks.length > 0
  
  return (
    <div className={cn(getNodeClasses(), selected && "ring-2 ring-primary ring-offset-2")}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-primary border-2 border-background"
        style={{ top: -5 }}
      />
      
      {/* Page Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {getPageIcon()}
            <h3 className="font-semibold text-sm leading-none">{page.title}</h3>
          </div>
          {canExpand && (
            <button
              onClick={toggleExpanded}
              className="p-1 hover:bg-muted rounded transition-colors duration-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
        
        {page.slug && !page.id.startsWith('menu-') && page.id !== 'root' && (
          <p className="text-xs text-muted-foreground">/{page.slug}</p>
        )}
        
        {!isExpanded && contentBlocks.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{contentBlocks.length} blocks</span>
          </div>
        )}
      </div>
      
      {/* Expanded Content Blocks */}
      {isExpanded && contentBlocks.length > 0 && (
        <div className="border-t px-4 pb-4">
          <div className="flex items-center justify-between mt-3 mb-2">
            <span className="text-xs font-medium text-muted-foreground">Content Structure</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowWireframe(!showWireframe)
              }}
              className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80 transition-colors"
            >
              {showWireframe ? 'Show Details' : 'Show Wireframe'}
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {showWireframe ? (
              // Wireframe View
              <div className="space-y-3">
                {contentBlocks.map((block, index) => (
                  <div key={block.id} className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                      <h5 className="text-xs font-medium">{getBlockTitle(block)}</h5>
                    </div>
                    <div className="pl-4">
                      <WireframeBlock 
                        type={block.type} 
                        content={block.content}
                        attributes={block.attributes}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Detail View
              contentBlocks.map((block, index) => {
                const isSection = block.type === 'section'
                const sectionBlocks = isSection && block.attributes?.blocks ? block.attributes.blocks : [block]
                
                return (
                  <div key={block.id} className="space-y-2">
                    {isSection && (
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                        <div className={cn("flex-shrink-0", getBlockColor(block))}>
                          {getBlockIcon(block)}
                        </div>
                        <h4 className="text-xs font-medium text-foreground">{block.attributes?.title || block.content}</h4>
                      </div>
                    )}
                    
                    {sectionBlocks.map((subBlock, subIndex) => (
                      <div 
                        key={subBlock.id || `${block.id}-${subIndex}`}
                        className={cn(
                          "flex gap-2 p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors duration-200",
                          isSection && "ml-6"
                        )}
                      >
                        {!isSection && (
                          <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                        )}
                        <div className={cn("flex-shrink-0", getBlockColor(subBlock))}>
                          {getBlockIcon(subBlock)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="text-xs font-medium">{getBlockTitle(subBlock)}</h5>
                            <span className="text-[10px] text-muted-foreground px-1 py-0.5 bg-muted rounded">
                              {subBlock.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">
                            {subBlock.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
      
      {hasContent && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
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

ExpandableSitemapNode.displayName = 'ExpandableSitemapNode'