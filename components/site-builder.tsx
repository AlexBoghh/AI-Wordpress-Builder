"use client"

import React, { useState } from 'react'
import { Plus, FileText, Folder, GripVertical, Trash2, Edit2, Search, Package, Briefcase, FileEdit, SearchCheck } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Page {
  id: string
  title: string
  slug: string
  menu?: string
  submenu?: string
  metaDescription?: string
  keywords?: string
  contentType: 'page' | 'post' | 'product' | 'portfolio'
  priority: string
  parentId?: string
  categories?: string[]
  tags?: string[]
  featuredImage?: string
}

interface SiteBuilderProps {
  onPagesChange: (pages: Page[]) => void
  initialPages?: Page[]
  pageContents?: Record<string, string>
  onPageSelect?: (page: Page) => void
}

function SortablePageItem({ page, onEdit, onDelete, hasContent, onClick, children }: { 
  page: Page
  onEdit: (page: Page) => void
  onDelete: (id: string) => void
  hasContent?: boolean
  onClick?: () => void
  children?: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-3"
    >
      <div 
        className="group flex items-center gap-2.5 px-3 py-2.5 bg-card border border-border rounded-md hover:border-primary/20 hover:shadow-sm transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab hover:cursor-grabbing touch-none" 
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3 text-muted-foreground/60" />
        </div>
        
        <div className="relative flex items-center justify-center shrink-0">
          {page.contentType === 'post' ? (
            <FileEdit className={cn("h-3.5 w-3.5", hasContent ? "text-primary" : "text-muted-foreground")} />
          ) : page.contentType === 'product' ? (
            <Package className={cn("h-3.5 w-3.5", hasContent ? "text-primary" : "text-muted-foreground")} />
          ) : page.contentType === 'portfolio' ? (
            <Briefcase className={cn("h-3.5 w-3.5", hasContent ? "text-primary" : "text-muted-foreground")} />
          ) : (
            <FileText className={cn("h-3.5 w-3.5", hasContent ? "text-primary" : "text-muted-foreground")} />
          )}
          {hasContent && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground">{page.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">/{page.slug}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon-tiny"
                variant="ghost"
                className="p-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(page)
                }}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-xxs"
                variant="ghost"
                className="p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(page.id)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {children && (
        <div className="ml-10 mt-1">
          {children}
        </div>
      )}
    </div>
  )
}

export function SiteBuilder({ onPagesChange, initialPages = [], pageContents = {}, onPageSelect }: SiteBuilderProps) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [isAddingPage, setIsAddingPage] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [newPage, setNewPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    menu: 'Main',
    metaDescription: '',
    keywords: '',
    contentType: 'page',
    priority: 'medium'
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = pages.findIndex(p => p.id === active.id)
      const newIndex = pages.findIndex(p => p.id === over?.id)
      
      const newPages = arrayMove(pages, oldIndex, newIndex)
      setPages(newPages)
      onPagesChange(newPages)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleAddPage = () => {
    const page: Page = {
      id: Date.now().toString(),
      title: newPage.title || 'New Page',
      slug: newPage.slug || generateSlug(newPage.title || 'new-page'),
      menu: newPage.menu,
      submenu: newPage.submenu,
      metaDescription: newPage.metaDescription,
      keywords: newPage.keywords,
      contentType: newPage.contentType || 'page',
      priority: newPage.priority || 'medium'
    }

    const updatedPages = [...pages, page]
    setPages(updatedPages)
    onPagesChange(updatedPages)
    setIsAddingPage(false)
    setNewPage({
      title: '',
      slug: '',
      menu: 'Main',
      metaDescription: '',
      keywords: '',
      contentType: 'page',
      priority: 'medium'
    })
  }

  const handleUpdatePage = () => {
    if (!editingPage) return

    const updatedPages = pages.map(p => 
      p.id === editingPage.id ? editingPage : p
    )
    setPages(updatedPages)
    onPagesChange(updatedPages)
    setEditingPage(null)
  }

  const handleDeletePage = (id: string) => {
    const updatedPages = pages.filter(p => p.id !== id)
    setPages(updatedPages)
    onPagesChange(updatedPages)
  }

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group pages by menu
  const groupedPages = filteredPages.reduce((acc, page) => {
    const menu = page.menu || 'Other'
    if (!acc[menu]) acc[menu] = []
    acc[menu].push(page)
    return acc
  }, {} as Record<string, Page[]>)

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 py-4 space-y-3 border-b bg-card">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Site Structure</h2>
          <p className="text-sm text-muted-foreground">Organize your website pages and navigation hierarchy</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAddingPage(true)}
            size="sm"
            className="h-9"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Page
          </Button>
          
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-background">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(groupedPages).map(([menu, menuPages]) => (
            <div key={menu} className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-foreground">{menu} Menu</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">({menuPages.length})</span>
              </div>
              
              <SortableContext
                items={menuPages.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {menuPages.map((page) => (
                  <SortablePageItem
                    key={page.id}
                    page={page}
                    onEdit={setEditingPage}
                    onDelete={handleDeletePage}
                    hasContent={!!pageContents[page.id]}
                    onClick={() => onPageSelect?.(page)}
                  />
                ))}
              </SortableContext>
            </div>
          ))}
        </DndContext>

        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted/30 p-4 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-foreground">No pages yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">Create your first page to start building your website structure</p>
            <Button 
              onClick={() => setIsAddingPage(true)}
              size="sm"
              className="h-9"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create First Page
            </Button>
          </div>
        )}
      </div>

      {/* Add Page Dialog */}
      <Dialog open={isAddingPage} onOpenChange={setIsAddingPage}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold">Create New Page</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new page to your website structure
            </p>
          </DialogHeader>
          
          <div className="px-6 pb-6 space-y-4">
            {/* Primary Information */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-1.5 block">
                  Page Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={newPage.title}
                  onChange={(e) => {
                    setNewPage({
                      ...newPage,
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    })
                  }}
                  placeholder="e.g., About Us"
                  className="h-9"
                  autoFocus
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-sm font-medium mb-1.5 block">
                  URL Path
                </Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-1">/</span>
                  <Input
                    id="slug"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                    placeholder="about-us"
                    className="h-9 flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be the page URL
                </p>
              </div>
            </div>

            {/* Page Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Page Configuration</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="contentType" className="text-sm mb-1.5 block">
                    Content Type
                  </Label>
                  <Select
                    value={newPage.contentType}
                    onValueChange={(value: Page['contentType']) => setNewPage({ ...newPage, contentType: value })}
                  >
                    <SelectTrigger id="contentType" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">Page</SelectItem>
                      <SelectItem value="post">Blog Post</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="menu" className="text-sm mb-1.5 block">
                    Navigation Menu
                  </Label>
                  <Input
                    id="menu"
                    value={newPage.menu}
                    onChange={(e) => setNewPage({ ...newPage, menu: e.target.value })}
                    placeholder="Main Menu"
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings - Collapsible */}
            <div className="bg-muted/20 border border-border/50 rounded-lg overflow-hidden">
              <details className="group">
                <summary className="cursor-pointer list-none px-4 py-3 hover:bg-muted/30 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SearchCheck className="w-4 h-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">SEO Settings</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium uppercase tracking-wider">Recommended</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </summary>
                
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50">
                <div>
                  <Label htmlFor="metaDescription" className="text-sm mb-1.5 block">
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={newPage.metaDescription}
                    onChange={(e) => setNewPage({ ...newPage, metaDescription: e.target.value })}
                    placeholder="Brief description for search engines"
                    rows={2}
                    className="resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    160 characters recommended
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords" className="text-sm mb-1.5 block">
                    Keywords
                  </Label>
                  <Input
                    id="keywords"
                    value={newPage.keywords}
                    onChange={(e) => setNewPage({ ...newPage, keywords: e.target.value })}
                    placeholder="design, development, consulting"
                    className="h-9"
                  />
                </div>
                </div>
              </details>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/50 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsAddingPage(false)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddPage}
              className="h-9"
              disabled={!newPage.title?.trim()}
            >
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold">Edit Page</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update your page settings and SEO information
            </p>
          </DialogHeader>
          {editingPage && (
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-title" className="text-sm font-medium mb-1 block">Page Title</Label>
                  <Input
                    id="edit-title"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="h-9"
                  />
                </div>
              
                <div>
                  <Label htmlFor="edit-slug" className="text-sm font-medium mb-1 block">URL Path</Label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-1">/</span>
                    <Input
                      id="edit-slug"
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                      className="h-9 flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Page Configuration</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-contentType" className="text-sm font-medium mb-1 block">Content Type</Label>
                    <Select
                      value={editingPage.contentType}
                      onValueChange={(value: Page['contentType']) => setEditingPage({ ...editingPage, contentType: value })}
                    >
                      <SelectTrigger id="edit-contentType" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="post">Blog Post</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-menu" className="text-sm font-medium mb-1 block">Navigation Menu</Label>
                    <Input
                      id="edit-menu"
                      value={editingPage.menu}
                      onChange={(e) => setEditingPage({ ...editingPage, menu: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-muted/20 border border-border/50 rounded-lg overflow-hidden">
                <details className="group" open>
                  <summary className="cursor-pointer list-none px-4 py-3 hover:bg-muted/30 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <SearchCheck className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">SEO Settings</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium uppercase tracking-wider">Recommended</span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </summary>
                  
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50">
                    <div>
                      <Label htmlFor="edit-metaDescription" className="text-sm font-medium mb-1 block">Meta Description</Label>
                      <Textarea
                        id="edit-metaDescription"
                        value={editingPage.metaDescription || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                        rows={2}
                        className="resize-none text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">160 characters recommended</p>
                    </div>

                    <div>
                      <Label htmlFor="edit-keywords" className="text-sm font-medium mb-1 block">Keywords</Label>
                      <Input
                        id="edit-keywords"
                        value={editingPage.keywords || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, keywords: e.target.value })}
                        className="h-9"
                        placeholder="design, development, consulting"
                      />
                    </div>
                  </div>
                </details>
              </div>
            </div>
          )}
          <DialogFooter className="px-6 py-4 bg-muted/50 border-t">
            <Button 
              variant="outline" 
              onClick={() => setEditingPage(null)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePage}
              className="h-9"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}