"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Project, Page } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Sparkles, Edit, Trash2, Plus } from 'lucide-react'

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [generatingContent, setGeneratingContent] = useState<string | null>(null)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      setProject(data)
      if (data.pages.length > 0) {
        setSelectedPage(data.pages[0])
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateContent = async (pageId: string) => {
    const page = project?.pages.find(p => p.id === pageId)
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
          generationType: 'individual'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to generate content'
        alert(`Error: ${errorMessage}\n\n${data.details || ''}`)
        throw new Error(errorMessage)
      }
      
      const { content } = data
      
      const updateResponse = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...page, content })
      })

      if (updateResponse.ok) {
        await fetchProject()
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setGeneratingContent(null)
    }
  }

  const handleExportWordPress = () => {
    window.open(`/api/export/wordpress/${params.id}`, '_blank')
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchProject()
        setSelectedPage(null)
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{project.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleExportWordPress}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to WordPress
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 border-r overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Pages ({project.pages.length})</h2>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Group pages by menu */}
            {Object.entries(
              project.pages.reduce((acc, page) => {
                const menu = page.menu || 'Other'
                if (!acc[menu]) acc[menu] = []
                acc[menu].push(page)
                return acc
              }, {} as Record<string, Page[]>)
            ).map(([menu, pages]) => (
              <div key={menu} className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{menu}</h3>
                <div className="space-y-1">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPage?.id === page.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="font-medium text-sm">{page.title}</div>
                      {page.submenu && (
                        <div className="text-xs text-muted-foreground">{page.submenu}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedPage ? (
            <div className="p-8 max-w-4xl">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedPage.title}</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePage(selectedPage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Slug:</span>
                    <span className="ml-2 font-mono">{selectedPage.slug}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2">{selectedPage.contentType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Menu:</span>
                    <span className="ml-2">{selectedPage.menu || '-'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <span className="ml-2">{selectedPage.priority}</span>
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-3">SEO Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Meta Description:</span>
                    <p className="mt-1">{selectedPage.metaDescription || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Keywords:</span>
                    <p className="mt-1">{selectedPage.keywords || 'Not set'}</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Content</h3>
                  {!selectedPage.content && (
                    <Button 
                      size="sm"
                      onClick={() => handleGenerateContent(selectedPage.id)}
                      disabled={generatingContent === selectedPage.id}
                    >
                      {generatingContent === selectedPage.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {selectedPage.content ? (
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="p-4 bg-muted/30 rounded-lg"
                      dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                    />
                  </div>
                ) : (
                  <div className="p-8 bg-muted/30 rounded-lg text-center">
                    <p className="text-muted-foreground mb-4">No content generated yet</p>
                    <Button 
                      onClick={() => handleGenerateContent(selectedPage.id)}
                      disabled={generatingContent === selectedPage.id}
                    >
                      {generatingContent === selectedPage.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI Content
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a page to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}