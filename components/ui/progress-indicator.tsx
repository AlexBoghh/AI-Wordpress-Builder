"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, AlertCircle, Layers, Type, Palette, Layout, ChevronRight, Info, Clock, CheckCheck } from 'lucide-react'
import { Button } from './button'

export interface ProgressStep {
  id: string
  label: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  optional?: boolean
  action?: () => void
  actionLabel?: string
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  currentStepId?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
  showDescription?: boolean
  compact?: boolean
}

export function ProgressIndicator({
  steps,
  currentStepId,
  orientation = 'horizontal',
  className,
  showDescription = true,
  compact = false
}: ProgressIndicatorProps) {
  const currentIndex = currentStepId ? steps.findIndex(step => step.id === currentStepId) : -1
  
  return (
    <div className={cn(
      "flex",
      orientation === 'vertical' ? "flex-col space-y-4" : "items-center space-x-4",
      className
    )}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId
        const isCompleted = step.status === 'completed'
        const isError = step.status === 'error'
        const isPending = step.status === 'pending'
        const isInProgress = step.status === 'in-progress' || isActive
        
        const StepIcon = isCompleted 
          ? CheckCircle2 
          : isError 
            ? AlertCircle 
            : Circle
        
        return (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              orientation === 'vertical' && "flex-col items-start w-full"
            )}
          >
            {/* Connector Line (not for first item) */}
            {index > 0 && orientation === 'horizontal' && (
              <div className="relative flex-1 flex items-center">
                <div className={cn(
                  "h-px w-full transition-all duration-500",
                  isCompleted ? "bg-gradient-to-r from-primary to-primary" : "bg-border"
                )}>
                  {isCompleted && (
                    <div className="h-px w-full bg-gradient-to-r from-primary to-primary animate-in slide-in-from-left duration-700" />
                  )}
                </div>
              </div>
            )}
            
            {/* Step Content */}
            <div className={cn(
              "flex items-center gap-3",
              orientation === 'vertical' && "w-full",
              compact && "gap-2"
            )}>
              {/* Step Icon */}
              <div className={cn(
                "flex items-center justify-center rounded-full border-2 transition-all duration-300 relative group-hover:scale-105",
                compact ? "w-6 h-6" : "w-8 h-8",
                isCompleted && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                isError && "border-destructive bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25",
                isInProgress && "border-primary bg-primary/10 text-primary ring-2 ring-primary/20",
                isPending && "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
              )}>
                <StepIcon className={cn(
                  compact ? "h-3 w-3" : "h-4 w-4",
                  "transition-transform duration-200 group-hover:scale-110"
                )} />
                {isInProgress && (
                  <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
                )}
              </div>
              
              {/* Step Label and Description */}
              <div className={cn(
                "flex-1 min-w-0",
                orientation === 'horizontal' && compact && "text-center"
              )}>
                <div className={cn(
                  "font-medium transition-colors duration-300",
                  compact ? "text-sm" : "text-base",
                  isCompleted && "text-primary",
                  isError && "text-destructive",
                  isInProgress && "text-primary",
                  isPending && "text-muted-foreground"
                )}>
                  {step.label}
                  {step.optional && (
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                  )}
                </div>
                
                {showDescription && step.description && !compact && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
                
                {/* Action Button */}
                {step.action && (isInProgress || isError) && !compact && (
                  <Button
                    size="sm"
                    variant={isError ? "destructive" : "default"}
                    onClick={step.action}
                    className="mt-2 h-7 text-xs"
                  >
                    {step.actionLabel || (isError ? "Retry" : "Continue")}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Vertical Connector */}
            {index < steps.length - 1 && orientation === 'vertical' && (
              <div className={cn(
                "w-px h-6 ml-4 transition-colors duration-300",
                isCompleted ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Specialized progress indicator for website building workflow
export function BuilderProgress({
  hasPages,
  hasContent,
  hasTheme,
  hasLayout,
  className
}: {
  hasPages: boolean
  hasContent: boolean
  hasTheme: boolean
  hasLayout: boolean
  className?: string
}) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  // Create steps array with enhanced metadata
  const steps = [
    {
      id: 'structure',
      label: 'Structure',
      description: 'Create and organize your website pages',
      detailedDescription: 'Define the foundation of your website by creating pages, setting up navigation, and organizing your site structure.',
      status: hasPages ? 'completed' : 'pending',
      icon: Layers,
      color: 'blue',
      estimatedTime: '2-5 min',
      required: true
    },
    {
      id: 'content',
      label: 'Content',
      description: 'Generate AI-powered content',
      detailedDescription: 'Let AI create compelling, SEO-optimized content for each of your pages based on your business information.',
      status: hasContent ? 'completed' : hasPages ? 'pending' : 'pending',
      icon: Type,
      color: 'green',
      estimatedTime: '1-3 min',
      required: true
    },
    {
      id: 'theme',
      label: 'Theme',
      description: 'Choose visual styling',
      detailedDescription: 'Select colors, fonts, and visual elements that match your brand identity and create a cohesive look.',
      status: hasTheme ? 'completed' : 'pending',
      icon: Palette,
      color: 'purple',
      estimatedTime: '1-2 min',
      required: false
    },
    {
      id: 'layout',
      label: 'Layout',
      description: 'Customize page layouts',
      detailedDescription: 'Fine-tune the arrangement and presentation of content on your pages for optimal user experience.',
      status: hasLayout ? 'completed' : 'pending',
      icon: Layout,
      color: 'orange',
      estimatedTime: '2-4 min',
      required: false
    }
  ]
  
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100
  const requiredSteps = steps.filter(step => step.required)
  const completedRequiredSteps = requiredSteps.filter(step => step.status === 'completed').length
  
  const getStepColorClasses = (step: typeof steps[0], variant: 'bg' | 'border' | 'text') => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        border: 'border-blue-500',
        text: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-500',
        border: 'border-green-500',
        text: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-500',
        border: 'border-purple-500',
        text: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-500',
        border: 'border-orange-500',
        text: 'text-orange-600'
      }
    }
    return colors[step.color as keyof typeof colors][variant]
  }

  const getCurrentStep = () => {
    const incompleteStep = steps.find(step => step.status !== 'completed')
    return incompleteStep || steps[steps.length - 1]
  }

  const currentStep = getCurrentStep()
  
  return (
    <div className={cn(
      "bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-foreground">Project Progress</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-6 w-6 p-0 hover:bg-muted/50"
            >
              <Info className="h-3.5 w-3.5" />
            </Button>
          </div>
          {completedSteps === totalSteps && (
            <div className="flex items-center gap-1 text-green-600 animate-in fade-in duration-500">
              <CheckCheck className="h-4 w-4" />
              <span className="text-xs font-medium">Complete!</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-foreground">
            {completedSteps}/{totalSteps}
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% done
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Required: {completedRequiredSteps}/{requiredSteps.length}
          </span>
          <span className="text-xs text-muted-foreground">
            Overall: {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isPending = step.status === 'pending'
          const isCurrent = step.id === currentStep.id && !isCompleted
          const Icon = step.icon
          const isExpanded = expandedStep === step.id
          
          return (
            <div key={step.id} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-10 w-px h-6 bg-border transition-colors duration-300" />
              )}
              
              {/* Step Container */}
              <div 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer",
                  isCompleted && "bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-800/30",
                  isCurrent && "bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/30 ring-1 ring-blue-200/50 dark:ring-blue-800/30",
                  isPending && !isCurrent && "bg-muted/20 border-muted hover:bg-muted/30",
                  "hover:shadow-sm"
                )}
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
              >
                {/* Step Icon */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0",
                  isCompleted && "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/25",
                  isCurrent && `${getStepColorClasses(step, 'bg')} ${getStepColorClasses(step, 'border')} text-white shadow-md`,
                  isPending && !isCurrent && "border-muted-foreground/30 text-muted-foreground bg-background"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        "font-medium text-sm transition-colors duration-300",
                        isCompleted && "text-green-700 dark:text-green-400",
                        isCurrent && getStepColorClasses(step, 'text'),
                        isPending && !isCurrent && "text-muted-foreground"
                      )}>
                        {step.label}
                      </h4>
                      {!step.required && (
                        <span className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded font-medium">
                          Optional
                        </span>
                      )}
                      {isCurrent && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )} />
                  </div>
                  
                  <p className={cn(
                    "text-xs text-muted-foreground mt-0.5 transition-colors duration-300",
                    isCurrent && "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                  
                  {/* Expanded Details */}
                  {isExpanded && showDetails && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-md border animate-in slide-in-from-top-2 duration-200">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.detailedDescription}
                      </p>
                      {isCurrent && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Estimated time: {step.estimatedTime}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Next Step Suggestion */}
      {completedSteps < totalSteps && (
        <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-medium text-blue-700 dark:text-blue-300">
              Next: {currentStep.label}
            </span>
          </div>
          <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 ml-4">
            {currentStep.description} • Est. {currentStep.estimatedTime}
          </p>
        </div>
      )}
    </div>
  )
}

// Quick status indicator for completed/total items
export function StatusBadge({
  completed,
  total,
  label,
  variant = 'default',
  showPercentage = false,
  animated = true
}: {
  completed: number
  total: number
  label: string
  variant?: 'default' | 'success' | 'warning'
  showPercentage?: boolean
  animated?: boolean
}) {
  const percentage = total > 0 ? (completed / total) * 100 : 0
  const isComplete = completed === total && total > 0
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
      "border border-transparent shadow-sm hover:shadow-md",
      variant === 'success' && "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200/50 dark:from-green-950/50 dark:to-green-900/50 dark:text-green-400 dark:border-green-800/30",
      variant === 'warning' && "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200/50 dark:from-amber-950/50 dark:to-amber-900/50 dark:text-amber-400 dark:border-amber-800/30",
      variant === 'default' && "bg-gradient-to-r from-muted/50 to-muted text-muted-foreground border-border/50"
    )}>
      <div className="relative">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full transition-all duration-300",
          isComplete && "bg-green-500 shadow-sm shadow-green-500/25",
          !isComplete && percentage > 0 && "bg-amber-500 shadow-sm shadow-amber-500/25",
          percentage === 0 && "bg-muted-foreground/50"
        )} />
        {animated && isComplete && (
          <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-20" />
        )}
      </div>
      <span className="font-semibold">
        {completed}/{total} {label}
        {showPercentage && total > 0 && (
          <span className="ml-1 opacity-75">({Math.round(percentage)}%)</span>
        )}
      </span>
      {isComplete && (
        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
      )}
    </div>
  )
}