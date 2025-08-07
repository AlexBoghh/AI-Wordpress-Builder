"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StepIndicator } from '@/components/ui/step-indicator'
import { BuilderHeader } from '@/components/ui/page-header'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Download, Map, Layout, FileDown } from 'lucide-react'

// Import step components (to be created)
import { StepOneSitemapContent } from '@/components/three-step-builder/step-1-sitemap-content'
import { StepTwoWireframeGenerator } from '@/components/three-step-builder/step-2-wireframe-generator'
import { StepThreeWordPressExporter } from '@/components/three-step-builder/step-3-wordpress-exporter'

// Import existing components we'll reuse
import { BusinessSettingsButton, BusinessSettings } from '@/components/business-settings'
import { PromptSettingsButton, ContentPrompts } from '@/components/prompt-editor'
import { UsageDashboard } from '@/components/usage-dashboard'

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
  wireframe?: Record<string, unknown> // Elementor wireframe data
}

const STEPS = [
  {
    id: 1,
    title: 'Content & Sitemap',
    description: 'Define structure & generate content',
    icon: Map
  },
  {
    id: 2,
    title: 'Wireframe Design',
    description: 'Create Elementor layouts',
    icon: Layout
  },
  {
    id: 3,
    title: 'Export',
    description: 'Download for WordPress',
    icon: FileDown
  }
]

export default function NewBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectName, setProjectName] = useState(`Website ${new Date().toLocaleDateString()}`)
  const [pages, setPages] = useState<Page[]>([])
  const [pageContents, setPageContents] = useState<Record<string, string>>({})
  const [pageWireframes, setPageWireframes] = useState<Record<string, Record<string, unknown>>>({})
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Business settings (reusing existing)
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    companyName: "Quartz & Granite Solutions",
    tagline: "We don't just install countertops—we deliver premium solutions",
    yearEstablished: "2003",
    yearsInBusiness: "over 20 years",
    phone: "(813) 226-2742",
    email: "info@quartzandgranitesolutions.com",
    address: "5434 West Crenshaw St",
    city: "Tampa",
    state: "FL",
    zipCode: "33634",
    serviceArea: "Tampa Bay area (60-mile radius)",
    businessHours: "Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 3:00 PM",
    emergencyResponse: "24-48 hour emergency response for repairs",
    website: "www.quartzandgranitesolutions.com",
    showroomAddress: "5434 West Crenshaw St, Tampa, FL 33634",
    specialties: [],
    certifications: [],
    brands: [],
    materials: [],
    services: [],
    uniqueCapabilities: [],
    processSteps: [],
    installationTimeline: "1-3 weeks from approval to completion",
    homeownerCTA: "Request Your Free Consultation",
    contractorCTA: "Request a Quote for Your Project"
  })
  
  const [customPrompts, setCustomPrompts] = useState<ContentPrompts>({
    page: '',
    post: '',
    product: '',
    portfolio: ''
  })

  // Check if current step is complete
  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        // Step 1 is complete if we have pages with content
        return pages.length > 0 && Object.keys(pageContents).length > 0
      case 2:
        // Step 2 is complete if we have wireframes for all pages
        return pages.length > 0 && Object.keys(pageWireframes).length === pages.length
      case 3:
        // Step 3 doesn't need completion check
        return true
      default:
        return false
    }
  }

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      if (!isStepComplete(currentStep)) {
        toast.error(`Please complete ${STEPS[currentStep - 1].title} before proceeding`)
        return
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepNumber: number) => {
    // Allow going back to previous steps
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber)
    } else if (stepNumber === currentStep) {
      // Already on this step
      return
    } else {
      // Check if all previous steps are complete
      for (let i = 1; i < stepNumber; i++) {
        if (!isStepComplete(i)) {
          toast.error(`Please complete ${STEPS[i - 1].title} first`)
          return
        }
      }
      setCurrentStep(stepNumber)
    }
  }

  // Save project to database
  const saveProject = useCallback(async () => {
    if (pages.length === 0) return null
    
    setIsSaving(true)
    try {
      if (!projectId) {
        // Create new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            pages: pages.map(page => ({
              title: page.title,
              slug: page.slug,
              menu: page.menu,
              submenu: page.submenu,
              meta_description: page.metaDescription,
              keywords: page.keywords,
              content_type: page.contentType,
              priority: page.priority,
              content: pageContents[page.id] || null,
              wireframe: pageWireframes[page.id] || null
            }))
          })
        })
        
        if (response.ok) {
          const project = await response.json()
          setProjectId(project.id)
          return project.id
        }
      } else {
        // Update existing project
        // Implementation for update...
        return projectId
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
      return null
    } finally {
      setIsSaving(false)
    }
  }, [pages, projectName, pageContents, pageWireframes, projectId])

  // Auto-save when data changes
  useEffect(() => {
    if (pages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProject()
      }, 2000) // Save after 2 seconds of inactivity
      
      return () => clearTimeout(timeoutId)
    }
  }, [pages, projectName, pageContents, pageWireframes, saveProject])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BuilderHeader
        projectName={projectName}
        onProjectNameChange={setProjectName}
        isSaving={isSaving}
        projectId={projectId}
        pageCount={pages.length}
        backButton={{ href: "/", label: "Projects" }}
        actions={
          <>
            <UsageDashboard />
            <BusinessSettingsButton
              settings={businessSettings}
              onSettingsChange={setBusinessSettings}
            />
            <PromptSettingsButton 
              prompts={customPrompts} 
              onPromptsChange={setCustomPrompts} 
            />
          </>
        }
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Step Content */}
        <Card className="min-h-[600px] relative">
          <div className="p-6">
            {currentStep === 1 && (
              <StepOneSitemapContent
                pages={pages}
                setPages={setPages}
                pageContents={pageContents}
                setPageContents={setPageContents}
                businessSettings={businessSettings}
                customPrompts={customPrompts}
                projectId={projectId}
              />
            )}
            
            {currentStep === 2 && (
              <StepTwoWireframeGenerator
                pages={pages}
                pageContents={pageContents}
                pageWireframes={pageWireframes}
                setPageWireframes={setPageWireframes}
              />
            )}
            
            {currentStep === 3 && (
              <StepThreeWordPressExporter
                pages={pages}
                pageContents={pageContents}
                pageWireframes={pageWireframes}
                projectName={projectName}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className="h-8"
              >
                <ArrowLeft className="h-3 w-3 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Step {currentStep} of {STEPS.length}
              </div>

              {currentStep < STEPS.length ? (
                <Button
                  size="sm"
                  onClick={goToNextStep}
                  disabled={!isStepComplete(currentStep)}
                  className="h-8"
                >
                  Next
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => toast.success('Export completed!')}
                  className="h-8"
                >
                  <Download className="h-3 w-3 mr-2" />
                  Download Files
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}