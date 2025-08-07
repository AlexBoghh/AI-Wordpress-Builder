"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, Upload, FileText, Sparkles, Map, Eye, EyeOff, 
  Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react'
import { EditableVisualSitemap } from '@/components/sitemap/editable-visual-sitemap'
import { FileUpload } from '@/components/file-upload'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { BusinessSettings } from '@/components/business-settings'
import { ContentPrompts } from '@/components/prompt-editor'

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
  content?: string
}

interface StepOneSitemapContentProps {
  pages: Page[]
  setPages: (pages: Page[]) => void
  pageContents: Record<string, string>
  setPageContents: (contents: Record<string, string>) => void
  businessSettings: BusinessSettings
  customPrompts: ContentPrompts
  projectId: string | null
}

export function StepOneSitemapContent({
  pages,
  setPages,
  pageContents,
  setPageContents,
  businessSettings,
  customPrompts,
  projectId
}: StepOneSitemapContentProps) {
  const [showAddPage, setShowAddPage] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [generatingContent, setGeneratingContent] = useState<string | null>(null)
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'sitemap' | 'list'>('sitemap')

  // Add new page form state
  const [newPage, setNewPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    menu: 'Main',
    contentType: 'page',
    priority: 'medium'
  })

  // Handle adding a new page
  const handleAddPage = () => {
    if (!newPage.title || !newPage.slug) {
      toast.error('Please fill in required fields')
      return
    }

    const page: Page = {
      id: Date.now().toString(),
      title: newPage.title,
      slug: newPage.slug,
      menu: newPage.menu || 'Main',
      submenu: newPage.submenu,
      metaDescription: newPage.metaDescription,
      keywords: newPage.keywords,
      contentType: newPage.contentType || 'page',
      priority: newPage.priority || 'medium'
    }

    setPages([...pages, page])
    setShowAddPage(false)
    setNewPage({
      title: '',
      slug: '',
      menu: 'Main',
      contentType: 'page',
      priority: 'medium'
    })
    toast.success('Page added successfully')
  }

  // Handle CSV import
  const handleCSVImport = (data: Record<string, string>[]) => {
    const csvPages: Page[] = data.map((row, index) => ({
      id: Date.now().toString() + index,
      title: row.title,
      slug: row.slug,
      menu: row.menu || 'Main',
      submenu: row.submenu,
      metaDescription: row.meta_description || row.metaDescription,
      keywords: row.keywords,
      contentType: (row.content_type || row.contentType || 'page') as 'page' | 'post' | 'product' | 'portfolio',
      priority: row.priority || 'medium'
    }))
    
    setPages([...pages, ...csvPages])
    setShowImport(false)
    toast.success(`Imported ${csvPages.length} pages`)
  }

  // Generate content for a single page
  const handleGenerateContent = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return

    setGeneratingContent(pageId)
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageData: {
            title: page.title,
            metaDescription: page.metaDescription,
            keywords: page.keywords,
            contentType: page.contentType
          },
          generationType: 'individual',
          customPrompt: customPrompts[page.contentType as keyof ContentPrompts],
          businessSettings: businessSettings,
          projectId: projectId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }
      
      const data = await response.json()
      setPageContents({
        ...pageContents,
        [pageId]: data.content
      })
      
      toast.success('Content generated successfully')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    } finally {
      setGeneratingContent(null)
    }
  }

  // Generate content for all pages
  const handleGenerateAllContent = async () => {
    setBulkGenerating(true)
    let successCount = 0
    
    for (const page of pages) {
      if (!pageContents[page.id]) {
        try {
          await handleGenerateContent(page.id)
          successCount++
        } catch (error) {
          console.error(`Failed to generate content for ${page.title}`)
        }
      }
    }
    
    setBulkGenerating(false)
    toast.success(`Generated content for ${successCount} pages`)
  }

  // Update content from sitemap editor
  const handleContentUpdate = async (pageId: string, content: string) => {
    setPageContents({
      ...pageContents,
      [pageId]: content
    })
    
    // Update API if project exists
    if (projectId) {
      try {
        await fetch(`/api/projects/${projectId}/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
      } catch (error) {
        console.error('Failed to update page content:', error)
      }
    }
  }

  // Calculate progress
  const pagesWithContent = pages.filter(page => pageContents[page.id]).length
  const progress = pages.length > 0 ? (pagesWithContent / pages.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content & Sitemap</h2>
          <p className="text-muted-foreground mt-1">
            Create your site structure and generate AI-powered content
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          {pages.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              {progress === 100 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : progress > 0 ? (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {pagesWithContent}/{pages.length} pages with content
              </span>
            </div>
          )}
          
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'sitemap' ? 'default' : 'ghost'}
              onClick={() => setViewMode('sitemap')}
              className="h-7"
            >
              <Map className="h-3 w-3 mr-1" />
              Sitemap
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-7"
            >
              <FileText className="h-3 w-3 mr-1" />
              List
            </Button>
          </div>
          
          {/* Action buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowImport(true)}
          >
            <Upload className="h-3 w-3 mr-1" />
            Import CSV
          </Button>
          
          <Button
            size="sm"
            onClick={() => setShowAddPage(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Page
          </Button>
          
          {pages.length > 0 && (
            <Button
              size="sm"
              variant="default"
              onClick={handleGenerateAllContent}
              disabled={bulkGenerating || generatingContent !== null}
            >
              {bulkGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate All Content
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main content area */}
      {pages.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No pages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start by adding pages manually or importing from a CSV file to create your site structure.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setShowAddPage(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Page
              </Button>
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </div>
          </div>
        </Card>
      ) : viewMode === 'sitemap' ? (
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <EditableVisualSitemap
            pages={pages}
            pageContents={pageContents}
            onPageSelect={() => {}}
            onContentUpdate={handleContentUpdate}
            editable={true}
          />
        </div>
      ) : (
        <Card className="p-4">
          <div className="space-y-2">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className={cn(
                    "h-4 w-4",
                    pageContents[page.id] ? "text-green-600" : "text-muted-foreground"
                  )} />
                  <div>
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-xs text-muted-foreground">/{page.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {pageContents[page.id] ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : generatingContent === page.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGenerateContent(page.id)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Page Dialog */}
      <Dialog open={showAddPage} onOpenChange={setShowAddPage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title*</Label>
              <Input
                id="title"
                value={newPage.title}
                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                placeholder="About Us"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug*</Label>
              <Input
                id="slug"
                value={newPage.slug}
                onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                placeholder="about-us"
              />
            </div>
            <div>
              <Label htmlFor="menu">Menu</Label>
              <Input
                id="menu"
                value={newPage.menu}
                onChange={(e) => setNewPage({ ...newPage, menu: e.target.value })}
                placeholder="Main"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddPage(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPage}>
                Add Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Pages from CSV</DialogTitle>
          </DialogHeader>
          <FileUpload
            onDataLoaded={handleCSVImport}
            onError={(error) => toast.error(error)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}