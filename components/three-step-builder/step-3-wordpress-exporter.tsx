"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Download, Package, CheckCircle2, 
  AlertCircle, Loader2, Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { generateWordPressXML } from '@/lib/wordpress-export'
import { cn } from '@/lib/utils'

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
}

interface StepThreeWordPressExporterProps {
  pages: Page[]
  pageContents: Record<string, string>
  pageWireframes: Record<string, Record<string, unknown>>
  projectName: string
}

type ExportFormat = 'wordpress-xml' | 'elementor-json' | 'both'
type ExportOptions = {
  includeWireframes: boolean
  includeMetadata: boolean
  generateElementorTemplates: boolean
  createChildTheme: boolean
}

export function StepThreeWordPressExporter({
  pages,
  pageContents,
  pageWireframes,
  projectName
}: StepThreeWordPressExporterProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('both')
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeWireframes: true,
    includeMetadata: true,
    generateElementorTemplates: true,
    createChildTheme: false
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle')

  // Calculate export readiness
  const pagesWithContent = pages.filter(p => pageContents[p.id]).length
  const pagesWithWireframes = pages.filter(p => pageWireframes[p.id]).length
  const isReady = pages.length > 0 && pagesWithContent > 0

  // Generate Elementor JSON from wireframes
  const generateElementorJSON = (pageId: string, wireframe: Record<string, unknown>) => {
    // Convert our wireframe format to Elementor's JSON structure
    const convertToElementor = (blocks: Array<Record<string, unknown>>): Array<Record<string, unknown>> => {
      return blocks.map(block => {
        const elementorElement: Record<string, unknown> = {
          id: block.id,
          elType: block.type === 'section' ? 'section' : block.type === 'column' ? 'column' : 'widget',
          settings: block.settings || {},
          elements: block.elements ? convertToElementor(block.elements) : []
        }

        // Map widget types to Elementor widget names
        if (elementorElement.elType === 'widget') {
          const widgetMap: Record<string, string> = {
            'heading': 'heading',
            'text-editor': 'text-editor',
            'image': 'image',
            'button': 'button',
            'divider': 'divider',
            'spacer': 'spacer',
            'icon-list': 'icon-list',
            'testimonial': 'testimonial',
            'contact-form': 'form',
            'google-maps': 'google-maps',
            'social-icons': 'social-icons',
            'menu': 'nav-menu',
            'video': 'video'
          }
          elementorElement.widgetType = widgetMap[block.type] || 'text-editor'
        }

        return elementorElement
      })
    }

    return {
      version: '0.4',
      title: pages.find(p => p.id === pageId)?.title || 'Page',
      type: 'page',
      content: convertToElementor(wireframe)
    }
  }

  // Handle export
  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus('processing')
    
    try {
      const exportedFiles: { filename: string; content: string; type: string }[] = []

      // 1. WordPress XML Export
      if (exportFormat === 'wordpress-xml' || exportFormat === 'both') {
        const pagesWithData = pages.map(page => ({
          ...page,
          content: pageContents[page.id] || null
        }))

        const projectData = {
          name: projectName,
          pages: pagesWithData,
          theme: undefined // Theme data if needed
        }

        const xmlContent = generateWordPressXML(projectData)
        exportedFiles.push({
          filename: `${projectName.toLowerCase().replace(/\s+/g, '-')}-wordpress.xml`,
          content: xmlContent,
          type: 'text/xml'
        })
      }

      // 2. Elementor JSON Export
      if ((exportFormat === 'elementor-json' || exportFormat === 'both') && exportOptions.includeWireframes) {
        const elementorTemplates = pages
          .filter(page => pageWireframes[page.id])
          .map(page => ({
            filename: `${page.slug}-elementor-template.json`,
            content: JSON.stringify(generateElementorJSON(page.id, pageWireframes[page.id]), null, 2),
            type: 'application/json'
          }))
        
        exportedFiles.push(...elementorTemplates)
      }

      // 3. Create README file
      const readmeContent = `# ${projectName} - WordPress Website Export

## Contents
- WordPress XML file for importing pages and content
${exportOptions.includeWireframes ? '- Elementor JSON templates for each page' : ''}
${exportOptions.createChildTheme ? '- Child theme files' : ''}

## Import Instructions

### WordPress Content
1. Log in to your WordPress admin dashboard
2. Go to Tools > Import
3. Select "WordPress" (install the importer if needed)
4. Upload the XML file and follow the prompts

### Elementor Templates
1. Install and activate Elementor plugin
2. Go to Templates > Saved Templates
3. Click "Import Templates"
4. Upload the JSON files one by one

## Pages Included
${pages.map(p => `- ${p.title} (/${p.slug})`).join('\n')}

Generated on: ${new Date().toLocaleString()}
`
      exportedFiles.push({
        filename: 'README.txt',
        content: readmeContent,
        type: 'text/plain'
      })

      // 4. Create ZIP file with all exports
      if (exportedFiles.length > 1) {
        // In a real implementation, you'd use a ZIP library here
        // For now, we'll download files individually
        exportedFiles.forEach(file => {
          const blob = new Blob([file.content], { type: file.type })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = file.filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        })
      } else if (exportedFiles.length === 1) {
        // Single file download
        const file = exportedFiles[0]
        const blob = new Blob([file.content], { type: file.type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      setExportStatus('complete')
      toast.success('Export completed successfully!')
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Export to WordPress</h2>
        <p className="text-muted-foreground mt-1">
          Download your website files ready for WordPress import
        </p>
      </div>

      {/* Export Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              pagesWithContent === pages.length ? "bg-green-100" : "bg-amber-100"
            )}>
              {pagesWithContent === pages.length ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">{pagesWithContent}/{pages.length}</p>
              <p className="text-sm text-muted-foreground">Pages with content</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              pagesWithWireframes === pages.length ? "bg-green-100" : "bg-amber-100"
            )}>
              {pagesWithWireframes === pages.length ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold">{pagesWithWireframes}/{pages.length}</p>
              <p className="text-sm text-muted-foreground">Pages with wireframes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pages.length}</p>
              <p className="text-sm text-muted-foreground">Total pages</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Export Format</h3>
        
        <RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <RadioGroupItem value="wordpress-xml" className="mt-1" />
              <div>
                <div className="font-medium">WordPress XML Only</div>
                <div className="text-sm text-muted-foreground">
                  Standard WordPress import format with pages and content
                </div>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <RadioGroupItem value="elementor-json" className="mt-1" />
              <div>
                <div className="font-medium">Elementor Templates Only</div>
                <div className="text-sm text-muted-foreground">
                  JSON templates for importing wireframes into Elementor
                </div>
              </div>
            </label>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <RadioGroupItem value="both" className="mt-1" />
              <div>
                <div className="font-medium flex items-center gap-2">
                  Complete Package
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Recommended</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Both WordPress content and Elementor templates
                </div>
              </div>
            </label>
          </div>
        </RadioGroup>

        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-sm">Additional Options</h4>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, includeMetadata: !!checked })
                }
              />
              <span className="text-sm">Include SEO metadata</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={exportOptions.generateElementorTemplates}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, generateElementorTemplates: !!checked })
                }
                disabled={exportFormat === 'wordpress-xml'}
              />
              <span className="text-sm">Generate Elementor page templates</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={exportOptions.createChildTheme}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, createChildTheme: !!checked })
                }
              />
              <span className="text-sm">Create child theme (coming soon)</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Export Status */}
      {exportStatus === 'complete' && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Export completed!</p>
              <p className="text-sm text-green-700">Your files have been downloaded</p>
            </div>
          </div>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleExport}
          disabled={!isReady || isExporting}
          className="min-w-[200px]"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Website
            </>
          )}
        </Button>
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-muted/50">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Quick Start Guide
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground">1.</span>
            <p>Install WordPress and Elementor on your hosting</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground">2.</span>
            <p>Import the WordPress XML file via Tools {'>'}  Import</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground">3.</span>
            <p>Import Elementor templates via Templates {'>'} Saved Templates</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground">4.</span>
            <p>Assign templates to your pages and customize as needed</p>
          </div>
        </div>
      </Card>
    </div>
  )
}