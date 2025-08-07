"use client"

import React, { memo, useState, useCallback, useEffect } from 'react'
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow'
import { 
  FileText, FileEdit, Package, Briefcase, Folder, Globe, 
  ChevronRight, ChevronDown, Save, Edit3, Eye, EyeOff,
  Plus, Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentBlock, EditableContentBlock } from '@/types/content-blocks'
import { getBlockTitle } from '@/lib/content-block-parser'
import { WireframeBlock } from './wireframe-blocks'
import { EditableContentBlockComponent } from './editable-content-block'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  contentBlocks?: EditableContentBlock[]
  isExpanded?: boolean
  onContentUpdate?: (pageId: string, blocks: ContentBlock[]) => void
}

export const EditableSitemapNode = memo(({ data, selected }: NodeProps<PageData>) => {
  const { page, hasContent, childCount, contentBlocks = [], onContentUpdate } = data
  const [isExpanded, setIsExpanded] = useState(data.isExpanded || false)
  const [showWireframe, setShowWireframe] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [localBlocks, setLocalBlocks] = useState<EditableContentBlock[]>(contentBlocks)
  const [hasChanges, setHasChanges] = useState(false)
  const [nodeWidth, setNodeWidth] = useState<number | undefined>(undefined)
  
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
  
  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }, [isExpanded])
  
  const handleBlockUpdate = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    setLocalBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, ...updates, isDirty: true } 
          : block
      )
    )
    setHasChanges(true)
  }, [])
  
  const handleAddBlock = useCallback((afterBlockId?: string) => {
    const newBlock: EditableContentBlock = {
      id: `block-${Date.now()}`,
      type: 'paragraph',
      content: '',
      order: localBlocks.length,
      isEditing: true,
      isDirty: true
    }
    
    if (afterBlockId) {
      const index = localBlocks.findIndex(b => b.id === afterBlockId)
      const newBlocks = [...localBlocks]
      newBlocks.splice(index + 1, 0, newBlock)
      // Update order
      newBlocks.forEach((block, i) => block.order = i)
      setLocalBlocks(newBlocks)
    } else {
      setLocalBlocks([...localBlocks, newBlock])
    }
    
    setHasChanges(true)
    setIsEditMode(true)
  }, [localBlocks])
  
  const handleDeleteBlock = useCallback((blockId: string) => {
    setLocalBlocks(prev => {
      const filtered = prev.filter(b => b.id !== blockId)
      // Update order
      filtered.forEach((block, i) => block.order = i)
      return filtered
    })
    setHasChanges(true)
  }, [])
  
  const handleSaveChanges = useCallback(() => {
    if (onContentUpdate) {
      // Clean up blocks before saving
      const cleanedBlocks = localBlocks.map(({ isEditing, isDirty, ...block }) => block)
      onContentUpdate(page.id, cleanedBlocks)
      setHasChanges(false)
      setIsEditMode(false)
      // Update local blocks to remove dirty flags
      setLocalBlocks(prev => prev.map(block => ({ ...block, isDirty: false })))
    }
  }, [localBlocks, onContentUpdate, page.id])
  
  const handleCancelChanges = useCallback(() => {
    setLocalBlocks(contentBlocks)
    setHasChanges(false)
    setIsEditMode(false)
  }, [contentBlocks])
  
  // Set default width based on state
  useEffect(() => {
    if (!nodeWidth) {
      if (isExpanded && isEditMode) {
        setNodeWidth(280)
      } else if (isExpanded) {
        setNodeWidth(240)
      } else {
        setNodeWidth(160)
      }
    }
  }, [isExpanded, isEditMode, nodeWidth])

  // Determine node styling
  const getNodeClasses = () => {
    const baseClasses = "bg-card border-2 rounded-lg transition-colors duration-300 cursor-pointer relative overflow-hidden"
    
    if (page.id === 'root') {
      return cn(baseClasses, "bg-primary text-primary-foreground border-primary shadow-lg")
    }
    
    if (page.id.startsWith('menu-')) {
      return cn(baseClasses, "bg-muted text-foreground border-muted-foreground/20")
    }
    
    if (hasContent || localBlocks.length > 0) {
      return cn(baseClasses, "bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-700")
    }
    
    return cn(baseClasses, "bg-card text-card-foreground border-border hover:border-primary/50")
  }
  
  // Don't show expand button for root or menu nodes
  const canExpand = !page.id.startsWith('menu-') && page.id !== 'root' && localBlocks.length > 0
  const canEdit = !page.id.startsWith('menu-') && page.id !== 'root'
  
  return (
    <div 
      className={cn(getNodeClasses(), selected && "ring-2 ring-primary ring-offset-2")}
      style={{ width: nodeWidth ? `${nodeWidth}px` : 'auto' }}
    >
      {/* Resize Handle */}
      {selected && (
        <NodeResizer 
          minWidth={120}
          maxWidth={400}
          minHeight={80}
          handleStyle={{
            width: '10px',
            height: '10px',
            borderRadius: '3px',
            backgroundColor: '#3b82f6',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          lineStyle={{
            borderColor: '#3b82f6',
            borderWidth: '2px',
            borderStyle: 'dashed'
          }}
          onResize={(_, params) => {
            setNodeWidth(params.width)
          }}
        />
      )}
      
      {/* Resize Hint */}
      {selected && (
        <div className="absolute top-1 right-1 text-[9px] text-muted-foreground bg-background/80 px-1 py-0.5 rounded">
          Drag edges to resize
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-primary border-2 border-background"
        style={{ top: -5 }}
      />
      
      {/* Page Header */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {getPageIcon()}
            <h3 className="font-semibold text-xs leading-none truncate">{page.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {canEdit && !isEditMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                    <Edit3 className="h-3 w-3 mr-2" />
                    Edit Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddBlock()}>
                    <Plus className="h-3 w-3 mr-2" />
                    Add Block
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
        </div>
        
        {page.slug && !page.id.startsWith('menu-') && page.id !== 'root' && (
          <p className="text-xs text-muted-foreground">/{page.slug}</p>
        )}
        
        {!isExpanded && localBlocks.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{localBlocks.length} blocks</span>
            {hasChanges && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">• Unsaved</span>
            )}
          </div>
        )}
      </div>
      
      {/* Expanded Content Blocks */}
      {isExpanded && localBlocks.length > 0 && (
        <div className="border-t px-4 pb-4">
          <div className="flex items-center justify-between mt-3 mb-2">
            <span className="text-xs font-medium text-muted-foreground">Content Structure</span>
            <div className="flex items-center gap-1">
              {isEditMode && hasChanges && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveChanges}
                    className="h-6 px-2 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelChanges}
                    className="h-6 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowWireframe(!showWireframe)
                }}
                className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80 transition-colors"
              >
                {showWireframe ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto overflow-x-hidden">
            {showWireframe && !isEditMode ? (
              // Wireframe View
              <div className="space-y-3">
                {localBlocks.map((block, index) => (
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
            ) : isEditMode ? (
              // Edit Mode
              <div className="space-y-2">
                {localBlocks.map((block, index) => (
                  <div key={block.id} className="group relative">
                    <EditableContentBlockComponent
                      block={block}
                      onUpdate={handleBlockUpdate}
                      className="pr-8"
                    />
                    <div className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddBlock(block.id)}>
                            <Plus className="h-3 w-3 mr-2" />
                            Add After
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteBlock(block.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddBlock()}
                  className="w-full h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Block
                </Button>
              </div>
            ) : (
              // Detail View (Read-only)
              <div className="space-y-1">
                {localBlocks.map((block, index) => (
                  <div key={block.id} className="flex gap-2 p-2 rounded hover:bg-muted/50">
                    <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-xs font-medium">{getBlockTitle(block)}</h5>
                        <span className="text-[10px] text-muted-foreground px-1 py-0.5 bg-muted rounded">
                          {block.type}
                        </span>
                        {block.isDirty && (
                          <span className="text-[10px] text-yellow-600 dark:text-yellow-400">Modified</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">
                        {block.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Status Indicators */}
      {(hasContent || localBlocks.length > 0) && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
      )}
      {hasChanges && (
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background" />
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

EditableSitemapNode.displayName = 'EditableSitemapNode'