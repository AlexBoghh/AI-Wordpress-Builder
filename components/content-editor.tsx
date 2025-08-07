"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card } from './ui/card'
import { Edit2, Save, X, Eye, Code } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlockToolbar } from './block-toolbar'
import { LayoutSelector, LayoutType } from './layout-selector'
import { LayoutRenderer } from './layout-renderer'

interface ContentEditorProps {
  content: string
  onSave: (content: string) => void
  pageTitle?: string
}

export function ContentEditor({ content, onSave, pageTitle }: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview')
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('standard')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleSave = () => {
    onSave(editedContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(content)
    setIsEditing(false)
  }

  const insertBlock = (blockType: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = editedContent

    let blockContent = ''
    
    switch (blockType) {
      case 'heading':
        blockContent = `\n<!-- wp:heading {"level":2} -->\n<h2 class="wp-block-heading">Your Heading Here</h2>\n<!-- /wp:heading -->\n`
        break
      case 'paragraph':
        blockContent = `\n<!-- wp:paragraph -->\n<p>Your paragraph text here.</p>\n<!-- /wp:paragraph -->\n`
        break
      case 'list':
        blockContent = `\n<!-- wp:list -->\n<ul class="wp-block-list">\n<li>First item</li>\n<li>Second item</li>\n<li>Third item</li>\n</ul>\n<!-- /wp:list -->\n`
        break
      case 'quote':
        blockContent = `\n<!-- wp:quote -->\n<blockquote class="wp-block-quote">\n<p>Your quote here</p>\n<cite>Author Name</cite>\n</blockquote>\n<!-- /wp:quote -->\n`
        break
      case 'separator':
        blockContent = `\n<!-- wp:separator {"className":"is-style-wide"} -->\n<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>\n<!-- /wp:separator -->\n`
        break
      case 'columns':
        blockContent = `\n<!-- wp:columns -->\n<div class="wp-block-columns">\n<!-- wp:column -->\n<div class="wp-block-column">\n<!-- wp:paragraph -->\n<p>Column 1 content</p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:column -->\n<!-- wp:column -->\n<div class="wp-block-column">\n<!-- wp:paragraph -->\n<p>Column 2 content</p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:column -->\n</div>\n<!-- /wp:columns -->\n`
        break
      case 'table':
        blockContent = `\n<!-- wp:table -->\n<figure class="wp-block-table">\n<table>\n<thead>\n<tr><th>Header 1</th><th>Header 2</th></tr>\n</thead>\n<tbody>\n<tr><td>Cell 1</td><td>Cell 2</td></tr>\n<tr><td>Cell 3</td><td>Cell 4</td></tr>\n</tbody>\n</table>\n</figure>\n<!-- /wp:table -->\n`
        break
      case 'gallery':
        blockContent = `\n<!-- wp:gallery {"columns":3,"linkTo":"none"} -->\n<figure class="wp-block-gallery has-nested-images columns-3 is-cropped">\n<!-- wp:image -->\n<figure class="wp-block-image">\n<img src="image1.jpg" alt="Image 1"/>\n</figure>\n<!-- /wp:image -->\n<!-- wp:image -->\n<figure class="wp-block-image">\n<img src="image2.jpg" alt="Image 2"/>\n</figure>\n<!-- /wp:image -->\n</figure>\n<!-- /wp:gallery -->\n`
        break
      case 'code':
        blockContent = `\n<!-- wp:code -->\n<pre class="wp-block-code"><code>// Your code here</code></pre>\n<!-- /wp:code -->\n`
        break
    }

    const newContent = text.substring(0, start) + blockContent + text.substring(end)
    setEditedContent(newContent)

    // Move cursor to end of inserted block
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + blockContent.length, start + blockContent.length)
    }, 0)
  }

  // Parse WordPress blocks and render them with better styling
  const renderContent = (htmlContent: string) => {
    // Convert WordPress block comments to proper HTML with enhanced styling
    let styledContent = htmlContent
      
    // Style headings
    styledContent = styledContent.replace(
      /<!-- wp:heading {"level":2} -->\s*<h2[^>]*>(.*?)<\/h2>\s*<!-- \/wp:heading -->/g,
      '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">$1</h2>'
    )
    
    styledContent = styledContent.replace(
      /<!-- wp:heading {"level":3} -->\s*<h3[^>]*>(.*?)<\/h3>\s*<!-- \/wp:heading -->/g,
      '<h3 class="text-xl font-semibold text-gray-800 mb-3 mt-6">$1</h3>'
    )
    
    // Style paragraphs
    styledContent = styledContent.replace(
      /<!-- wp:paragraph -->\s*<p>(.*?)<\/p>\s*<!-- \/wp:paragraph -->/g,
      '<p class="text-gray-700 leading-relaxed mb-4">$1</p>'
    )
    
    // Style lists
    styledContent = styledContent.replace(
      /<!-- wp:list -->\s*<ul[^>]*>(.*?)<\/ul>\s*<!-- \/wp:list -->/gs,
      '<ul class="list-disc list-inside space-y-2 mb-4 ml-4">$1</ul>'
    )
    
    styledContent = styledContent.replace(
      /<li>(.*?)<\/li>/g,
      '<li class="text-gray-700 leading-relaxed"><span class="ml-2">$1</span></li>'
    )
    
    // Style buttons
    styledContent = styledContent.replace(
      /<!-- wp:buttons.*?-->\s*<div class="wp-block-buttons">.*?<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>.*?<\/div>\s*<!-- \/wp:buttons -->/gs,
      '<div class="flex justify-center my-8"><a href="$1" class="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">$2</a></div>'
    )
    
    // Style separators
    styledContent = styledContent.replace(
      /<!-- wp:separator.*?-->\s*<hr[^>]*\/>\s*<!-- \/wp:separator -->/g,
      '<hr class="border-t border-gray-200 my-8" />'
    )
    
    // Style quotes
    styledContent = styledContent.replace(
      /<!-- wp:quote -->\s*<blockquote[^>]*>(.*?)<\/blockquote>\s*<!-- \/wp:quote -->/gs,
      '<blockquote class="border-l-4 border-primary pl-4 my-6 italic text-gray-700">$1</blockquote>'
    )
    
    // Style tables
    styledContent = styledContent.replace(
      /<!-- wp:table -->\s*<figure[^>]*>\s*<table>(.*?)<\/table>\s*<\/figure>\s*<!-- \/wp:table -->/gs,
      '<div class="overflow-x-auto my-6"><table class="min-w-full divide-y divide-gray-200 border">$1</table></div>'
    )
    
    // Style table cells
    styledContent = styledContent.replace(
      /<th>(.*?)<\/th>/g,
      '<th class="px-4 py-2 bg-gray-50 text-left font-medium text-gray-900">$1</th>'
    )
    
    styledContent = styledContent.replace(
      /<td>(.*?)<\/td>/g,
      '<td class="px-4 py-2 border-t text-gray-700">$1</td>'
    )
    
    // Style columns
    styledContent = styledContent.replace(
      /<!-- wp:columns -->\s*<div class="wp-block-columns">(.*?)<\/div>\s*<!-- \/wp:columns -->/gs,
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">$1</div>'
    )
    
    styledContent = styledContent.replace(
      /<!-- wp:column -->\s*<div class="wp-block-column">(.*?)<\/div>\s*<!-- \/wp:column -->/gs,
      '<div class="space-y-4">$1</div>'
    )
    
    // Style code blocks
    styledContent = styledContent.replace(
      /<!-- wp:code -->\s*<pre[^>]*><code>(.*?)<\/code><\/pre>\s*<!-- \/wp:code -->/gs,
      '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"><code>$1</code></pre>'
    )
    
    return styledContent
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          {pageTitle && <h3 className="font-semibold">{pageTitle}</h3>}
          {!isEditing && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border rounded-lg p-1">
                <Button
                  variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === 'html' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('html')}
                >
                  <Code className="h-3 w-3" />
                </Button>
              </div>
              {viewMode === 'preview' && (
                <LayoutSelector
                  selectedLayout={selectedLayout}
                  onLayoutChange={setSelectedLayout}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isEditing ? (
          <div className="flex flex-col h-full">
            <BlockToolbar onBlockInsert={insertBlock} />
            <div className="p-4 flex-1">
              <Textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder="Enter your content here..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Use WordPress block format or plain HTML
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {viewMode === 'preview' ? (
              <LayoutRenderer
                content={content}
                pageTitle={pageTitle}
                layout={selectedLayout}
              />
            ) : (
              <Card className="p-4 bg-gray-50">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                  <code>{content}</code>
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>

    </div>
  )
}