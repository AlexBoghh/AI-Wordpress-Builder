"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Dialog, DialogContent } from './dialog'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { 
  FileText, 
  Sparkles, 
  Palette, 
  Layout, 
  ArrowRight, 
  CheckCircle2,
  Upload,
  X,
  Play
} from 'lucide-react'
import { ProgressBreadcrumb, ProgressStep } from './breadcrumb'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  content: React.ReactNode
  action?: {
    label: string
    onClick: () => void | Promise<void>
  }
  optional?: boolean
}

interface OnboardingFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  steps: OnboardingStep[]
  currentStep?: string
  canSkip?: boolean
}

export function OnboardingFlow({
  open,
  onOpenChange,
  onComplete,
  steps,
  currentStep,
  canSkip = true
}: OnboardingFlowProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(
    currentStep ? steps.findIndex(step => step.id === currentStep) : 0
  )
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  
  const currentStepData = steps[activeStepIndex]
  const isLastStep = activeStepIndex === steps.length - 1
  
  const handleNext = () => {
    if (currentStepData) {
      setCompletedSteps(prev => new Set([...prev, currentStepData.id]))
    }
    
    if (isLastStep) {
      onComplete()
    } else {
      setActiveStepIndex(prev => prev + 1)
    }
  }
  
  const handlePrevious = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1)
    }
  }
  
  const handleStepClick = (stepIndex: number) => {
    setActiveStepIndex(stepIndex)
  }
  
  const progressSteps: ProgressStep[] = steps.map(step => ({
    label: step.title,
    icon: step.icon
  }))
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Welcome to Website Builder</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Let's get you started with building your website
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {canSkip && (
              <Button variant="ghost" size="sm" onClick={onComplete}>
                Skip Tour
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b bg-muted/20">
          <ProgressBreadcrumb
            steps={progressSteps}
            currentStep={activeStepIndex}
            onStepClick={handleStepClick}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {currentStepData && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <currentStepData.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{currentStepData.title}</h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  {currentStepData.content}
                </div>
                
                {currentStepData.action && (
                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={currentStepData.action.onClick}
                      className="min-w-[200px]"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {currentStepData.action.label}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/20">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStepIndex === 0}
          >
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {activeStepIndex + 1} of {steps.length}
          </div>
          
          <Button onClick={handleNext}>
            {isLastStep ? 'Get Started' : 'Next'}
            {!isLastStep && <ArrowRight className="h-3 w-3 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Pre-built onboarding flow for Website Builder
export function WebsiteBuilderOnboarding({
  open,
  onOpenChange,
  onComplete,
  onCreateFirstPage,
  onUploadCSV,
  onSelectTheme
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
  onCreateFirstPage: () => void
  onUploadCSV: () => void
  onSelectTheme: () => void
}) {
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Website Builder 3.0',
      description: 'Create professional websites with AI-powered content generation and visual layout tools.',
      icon: FileText,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and organize your website pages with an intuitive structure builder.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">AI Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate professional content with AI that understands your business.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Layout className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Visual Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Design custom layouts with drag-and-drop sections and components.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'structure',
      title: 'Create Your Website Structure',
      description: 'Start by defining your website pages and navigation structure.',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onCreateFirstPage}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Create Pages Manually</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add pages one by one with our guided page creation form.
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Perfect for small websites</div>
                  <div>• Full control over each page</div>
                  <div>• SEO-friendly setup</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onUploadCSV}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Import from CSV</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with your complete website structure.
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Great for large websites</div>
                  <div>• Bulk import capabilities</div>
                  <div>• Template available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'content',
      title: 'Generate AI Content',
      description: 'Let AI create professional content tailored to your business and pages.',
      icon: Sparkles,
      content: (
        <div className="space-y-6 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Intelligent Content Generation</h4>
            <p className="text-muted-foreground">
              Our AI analyzes your business information and page structure to create 
              relevant, engaging content that converts visitors into customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Business-Aware</div>
                <div className="text-xs text-muted-foreground">Content matches your industry and services</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">SEO Optimized</div>
                <div className="text-xs text-muted-foreground">Includes relevant keywords and meta data</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Customizable</div>
                <div className="text-xs text-muted-foreground">Edit and refine any generated content</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Cost Efficient</div>
                <div className="text-xs text-muted-foreground">Smart model selection for optimal pricing</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'theme',
      title: 'Choose Your Visual Theme',
      description: 'Select a professional theme that matches your brand and industry.',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Themes provide consistent styling, typography, and color schemes 
              across your entire website.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="w-full h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded mb-3"></div>
                <div className="font-medium text-sm">Professional</div>
                <div className="text-xs text-muted-foreground">Clean, corporate design</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="w-full h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded mb-3"></div>
                <div className="font-medium text-sm">Creative</div>
                <div className="text-xs text-muted-foreground">Bold, artistic layout</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="w-full h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded mb-3"></div>
                <div className="font-medium text-sm">Minimal</div>
                <div className="text-xs text-muted-foreground">Simple, elegant style</div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      action: {
        label: 'Browse Themes',
        onClick: onSelectTheme
      },
      optional: true
    },
    {
      id: 'layout',
      title: 'Customize Your Layouts',
      description: 'Use our visual layout builder to create unique page designs.',
      icon: Layout,
      content: (
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <Layout className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Drag & Drop Layout Builder</h4>
            <p className="text-muted-foreground">
              Create custom page layouts with our intuitive visual builder. 
              Add sections, customize spacing, and integrate your generated content.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="w-full h-16 bg-muted rounded mb-2"></div>
              <div className="text-xs font-medium">Header</div>
            </div>
            <div>
              <div className="w-full h-16 bg-primary/20 rounded mb-2"></div>
              <div className="text-xs font-medium">Content</div>
            </div>
            <div>
              <div className="w-full h-16 bg-muted rounded mb-2"></div>
              <div className="text-xs font-medium">Sidebar</div>
            </div>
            <div>
              <div className="w-full h-16 bg-muted rounded mb-2"></div>
              <div className="text-xs font-medium">Footer</div>
            </div>
          </div>
        </div>
      ),
      optional: true
    }
  ]
  
  return (
    <OnboardingFlow
      open={open}
      onOpenChange={onOpenChange}
      onComplete={onComplete}
      steps={steps}
    />
  )
}