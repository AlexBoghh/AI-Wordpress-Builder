"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Layout, Plus, Trash2, Copy, Eye, EyeOff, Settings,
  Type, FileText, Image, MousePointer, Grid, Minus,
  List, MessageSquare, Star, Play, MapPin, Menu,
  Smartphone, Tablet, Monitor, Save, Undo, Redo
} from 'lucide-react'
import { 
  ElementorWireframe, 
  ElementorBlock,
  ElementorBlockType,
  SectionWireframe,
  ColumnWireframe
} from '@/components/elementor-blocks/elementor-wireframe-blocks'
import { toast } from 'sonner'
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

interface Page {
  id: string
  title: string
  slug: string
  content?: string
}

interface StepTwoWireframeGeneratorProps {
  pages: Page[]
  pageContents: Record<string, string>
  pageWireframes: Record<string, Record<string, unknown>>
  setPageWireframes: (wireframes: Record<string, Record<string, unknown>>) => void
}

// Widget library with categories
const WIDGET_LIBRARY = {
  basic: [
    { type: 'heading' as ElementorBlockType, label: 'Heading', icon: Type },
    { type: 'text-editor' as ElementorBlockType, label: 'Text', icon: FileText },
    { type: 'image' as ElementorBlockType, label: 'Image', icon: Image },
    { type: 'button' as ElementorBlockType, label: 'Button', icon: MousePointer },
    { type: 'divider' as ElementorBlockType, label: 'Divider', icon: Minus },
    { type: 'spacer' as ElementorBlockType, label: 'Spacer', icon: Minus },
  ],
  content: [
    { type: 'icon-list' as ElementorBlockType, label: 'Icon List', icon: List },
    { type: 'testimonial' as ElementorBlockType, label: 'Testimonial', icon: Star },
    { type: 'video' as ElementorBlockType, label: 'Video', icon: Play },
  ],
  forms: [
    { type: 'contact-form' as ElementorBlockType, label: 'Contact Form', icon: MessageSquare },
  ],
  site: [
    { type: 'menu' as ElementorBlockType, label: 'Navigation', icon: Menu },
    { type: 'google-maps' as ElementorBlockType, label: 'Map', icon: MapPin },
    { type: 'social-icons' as ElementorBlockType, label: 'Social Icons', icon: Grid },
  ]
}

// Predefined layout templates
const LAYOUT_TEMPLATES = [
  {
    id: 'header-basic',
    name: 'Basic Header',
    structure: {
      id: 'header-section',
      type: 'section' as ElementorBlockType,
      elements: [
        {
          id: 'col-1',
          type: 'column' as ElementorBlockType,
          elements: [
            { id: 'logo', type: 'image' as ElementorBlockType, settings: { aspectRatio: '3/1' } }
          ]
        },
        {
          id: 'col-2',
          type: 'column' as ElementorBlockType,
          elements: [
            { id: 'nav', type: 'menu' as ElementorBlockType }
          ]
        }
      ]
    }
  },
  {
    id: 'hero-cta',
    name: 'Hero with CTA',
    structure: {
      id: 'hero-section',
      type: 'section' as ElementorBlockType,
      elements: [
        {
          id: 'col-1',
          type: 'column' as ElementorBlockType,
          elements: [
            { id: 'h1', type: 'heading' as ElementorBlockType, settings: { level: 1, text: 'Welcome' } },
            { id: 'text', type: 'text-editor' as ElementorBlockType },
            { id: 'cta', type: 'button' as ElementorBlockType, settings: { text: 'Get Started' } }
          ]
        }
      ]
    }
  },
  {
    id: 'services-3col',
    name: '3 Column Services',
    structure: {
      id: 'services-section',
      type: 'section' as ElementorBlockType,
      elements: [
        {
          id: 'col-1',
          type: 'column' as ElementorBlockType,
          elements: [
            { id: 'icon1', type: 'image' as ElementorBlockType, settings: { aspectRatio: '1/1' } },
            { id: 'h3-1', type: 'heading' as ElementorBlockType, settings: { level: 3, text: 'Service 1' } },
            { id: 'text1', type: 'text-editor' as ElementorBlockType }
          ]
        },
        {
          id: 'col-2',
          type: 'column' as ElementorBlockType,
          elements: [
            { id: 'icon2', type: 'image' as ElementorBlockType, settings: { aspectRatio: '1/1' } },
            { id: 'h3-2', type: 'heading' as ElementorBlockType, settings: { level: 3, text: 'Service 2' } },
            { id: 'text2', type: 'text-editor' as ElementorBlockType }
          ]
        },
        {
          id: 'col-3',
          type: 'column' as ElementorBlockType,
          elements: [
            { id: 'icon3', type: 'image' as ElementorBlockType, settings: { aspectRatio: '1/1' } },
            { id: 'h3-3', type: 'heading' as ElementorBlockType, settings: { level: 3, text: 'Service 3' } },
            { id: 'text3', type: 'text-editor' as ElementorBlockType }
          ]
        }
      ]
    }
  }
]

export function StepTwoWireframeGenerator({
  pages,
  pageContents,
  pageWireframes,
  setPageWireframes
}: StepTwoWireframeGeneratorProps) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(pages[0] || null)
  const [currentWireframe, setCurrentWireframe] = useState<ElementorBlock[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)

  // Initialize wireframe for selected page
  React.useEffect(() => {
    if (selectedPage) {
      const savedWireframe = pageWireframes[selectedPage.id]
      if (savedWireframe) {
        setCurrentWireframe(savedWireframe)
      } else {
        // Start with a basic structure
        setCurrentWireframe([])
      }
    }
  }, [selectedPage, pageWireframes])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle adding a new section
  const addSection = (columns: number = 1) => {
    const newSection: ElementorBlock = {
      id: `section-${Date.now()}`,
      type: 'section',
      elements: Array.from({ length: columns }, (_, i) => ({
        id: `col-${Date.now()}-${i}`,
        type: 'column' as ElementorBlockType,
        elements: []
      }))
    }
    setCurrentWireframe([...currentWireframe, newSection])
  }

  // Handle adding a widget to a column
  const addWidget = (columnId: string, widgetType: ElementorBlockType) => {
    const newWidget: ElementorBlock = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      settings: {}
    }

    const updateWireframe = (blocks: ElementorBlock[]): ElementorBlock[] => {
      return blocks.map(block => {
        if (block.id === columnId && block.type === 'column') {
          return {
            ...block,
            elements: [...(block.elements || []), newWidget]
          }
        } else if (block.elements) {
          return {
            ...block,
            elements: updateWireframe(block.elements)
          }
        }
        return block
      })
    }

    setCurrentWireframe(updateWireframe(currentWireframe))
  }

  // Handle adding a template
  const addTemplate = (template: typeof LAYOUT_TEMPLATES[0]) => {
    const newSection = JSON.parse(JSON.stringify(template.structure))
    // Generate new IDs to avoid conflicts
    const generateNewIds = (block: ElementorBlock): ElementorBlock => {
      const newBlock = { ...block, id: `${block.type}-${Date.now()}-${Math.random()}` }
      if (newBlock.elements) {
        newBlock.elements = newBlock.elements.map(generateNewIds)
      }
      return newBlock
    }
    
    setCurrentWireframe([...currentWireframe, generateNewIds(newSection)])
    toast.success(`Added ${template.name} template`)
  }

  // Handle deleting an element
  const deleteElement = (elementId: string) => {
    const removeElement = (blocks: ElementorBlock[]): ElementorBlock[] => {
      return blocks
        .filter(block => block.id !== elementId)
        .map(block => {
          if (block.elements) {
            return {
              ...block,
              elements: removeElement(block.elements)
            }
          }
          return block
        })
    }

    setCurrentWireframe(removeElement(currentWireframe))
    setSelectedElement(null)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      // Handle reordering logic
    }
  }

  // Save wireframe for current page
  const saveWireframe = () => {
    if (selectedPage) {
      setPageWireframes({
        ...pageWireframes,
        [selectedPage.id]: currentWireframe
      })
      toast.success('Wireframe saved')
    }
  }

  // Auto-save on changes
  React.useEffect(() => {
    if (selectedPage && currentWireframe.length > 0) {
      const timeout = setTimeout(() => {
        saveWireframe()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [currentWireframe])

  const previewSizes = {
    desktop: 'w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-sm'
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Pages & Templates */}
      <div className="w-56 border-r bg-background p-2 space-y-2">
        {/* Page Selector */}
        <div>
          <h3 className="font-semibold mb-1 text-xs uppercase">Pages</h3>
          <ScrollArea className="h-32">
            <div className="space-y-0.5">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={selectedPage?.id === page.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(page)}
                >
                  <FileText className="h-2.5 w-2.5 mr-1.5" />
                  {page.title}
                  {pageWireframes[page.id] && (
                    <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full" />
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Templates */}
        <div>
          <h3 className="font-semibold mb-1 text-xs uppercase">Templates</h3>
          <ScrollArea className="h-40">
            <div className="space-y-0.5">
              {LAYOUT_TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addTemplate(template)}
                >
                  <Layout className="h-2.5 w-2.5 mr-1.5" />
                  {template.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Add Section */}
        <div>
          <h3 className="font-semibold mb-2 text-sm">Add Section</h3>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map((cols) => (
              <Button
                key={cols}
                variant="outline"
                size="sm"
                onClick={() => addSection(cols)}
                className="p-1"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="w-1.5 h-3 bg-current" />
                  ))}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-2 flex items-center justify-between bg-background">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">
              {selectedPage ? selectedPage.title : 'Select a page'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Preview */}
            <div className="flex items-center gap-0.5 bg-muted rounded p-0.5">
              <Button
                size="sm"
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('desktop')}
                className="h-6 px-1.5"
              >
                <Monitor className="h-2.5 w-2.5" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('tablet')}
                className="h-6 px-1.5"
              >
                <Tablet className="h-2.5 w-2.5" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('mobile')}
                className="h-6 px-1.5"
              >
                <Smartphone className="h-2.5 w-2.5" />
              </Button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
            </Button>

            <Button
              size="sm"
              onClick={saveWireframe}
            >
              <Save className="h-2.5 w-2.5 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex">
          <div className="flex-1 bg-gray-50 p-4 overflow-auto">
            <div className={cn("mx-auto bg-white shadow-lg min-h-[500px] p-3", previewSizes[previewMode])}>
              {currentWireframe.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="text-center py-6">
                    <Layout className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-3">
                      Start building your wireframe
                    </p>
                    <Button size="sm" onClick={() => addSection(1)} className="h-6 text-xs">
                      <Plus className="h-2.5 w-2.5 mr-1" />
                      Add First Section
                    </Button>
                  </div>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <div className="space-y-2">
                    {currentWireframe.map((block) => (
                      <div key={block.id} className="relative group">
                        <ElementorWireframe
                          block={block}
                          isEditable={!showPreview}
                          onEdit={(block) => setSelectedElement(block.id)}
                        />
                        {!showPreview && (
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteElement(block.id)}
                              className="h-5 w-5 p-0"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </DndContext>
              )}
            </div>
          </div>

          {/* Right Sidebar - Widgets */}
          {!showPreview && (
            <div className="w-56 border-l bg-background p-2">
              <h3 className="font-semibold mb-3 text-sm">Widgets</h3>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="mt-4">
                  <div className="space-y-2">
                    {Object.entries(WIDGET_LIBRARY).slice(0, 2).map(([category, widgets]) => (
                      <div key={category}>
                        <h4 className="text-[10px] font-medium text-muted-foreground uppercase mb-1">
                          {category}
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          {widgets.map((widget) => {
                            const Icon = widget.icon
                            return (
                              <Card
                                key={widget.type}
                                className="p-2 cursor-pointer hover:bg-muted transition-colors"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('widgetType', widget.type)
                                }}
                              >
                                <Icon className="h-2.5 w-2.5 mb-0.5" />
                                <p className="text-[10px]">{widget.label}</p>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-4">
                  <div className="space-y-2">
                    {Object.entries(WIDGET_LIBRARY).slice(2).map(([category, widgets]) => (
                      <div key={category}>
                        <h4 className="text-[10px] font-medium text-muted-foreground uppercase mb-1">
                          {category}
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          {widgets.map((widget) => {
                            const Icon = widget.icon
                            return (
                              <Card
                                key={widget.type}
                                className="p-2 cursor-pointer hover:bg-muted transition-colors"
                                draggable
                              >
                                <Icon className="h-2.5 w-2.5 mb-0.5" />
                                <p className="text-[10px]">{widget.label}</p>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}