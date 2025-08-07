"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Check, Loader2 } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
  icon?: React.ElementType
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
  onStepClick?: (stepId: number) => void
}

export function StepIndicator({ 
  steps, 
  currentStep, 
  className,
  onStepClick 
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
          {/* Progress Bar Fill */}
          <div 
            className="absolute h-full bg-primary transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)}%` 
            }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isClickable = onStepClick && (isCompleted || isCurrent)
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex flex-col items-center",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                {/* Step Circle */}
                <div className="relative">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background transition-all duration-300",
                      isCompleted && "bg-primary border-primary",
                      isCurrent && "border-primary shadow-lg shadow-primary/25",
                      !isCompleted && !isCurrent && "border-muted-foreground/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : isCurrent ? (
                      <span className="text-sm font-semibold text-primary">
                        {stepNumber}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  
                  {/* Active Step Pulse */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-25" />
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <h3 className={cn(
                    "text-sm font-medium transition-colors",
                    isCurrent && "text-foreground",
                    isCompleted && "text-primary",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Mobile-friendly vertical step indicator
export function VerticalStepIndicator({ 
  steps, 
  currentStep, 
  className,
  onStepClick 
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Vertical Progress Line */}
        <div className="absolute top-6 bottom-6 left-5 w-0.5 bg-muted">
          <div 
            className="absolute w-full bg-primary transition-all duration-500 ease-out"
            style={{ 
              height: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)}%` 
            }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative space-y-8">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isClickable = onStepClick && (isCompleted || isCurrent)
            const Icon = step.icon
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-start gap-4",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                {/* Step Circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background transition-all duration-300",
                      isCompleted && "bg-primary border-primary",
                      isCurrent && "border-primary shadow-lg shadow-primary/25",
                      !isCompleted && !isCurrent && "border-muted-foreground/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : Icon && isCurrent ? (
                      <Icon className="w-5 h-5 text-primary" />
                    ) : (
                      <span className={cn(
                        "text-sm font-semibold",
                        isCurrent && "text-primary",
                        !isCurrent && "text-muted-foreground"
                      )}>
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  
                  {/* Active Step Pulse */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-25" />
                  )}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 pt-0.5">
                  <h3 className={cn(
                    "text-base font-semibold transition-colors",
                    isCurrent && "text-foreground",
                    isCompleted && "text-primary",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  
                  {/* Current Step Content Slot */}
                  {isCurrent && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}