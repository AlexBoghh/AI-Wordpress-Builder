"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, Sparkles, FileText, Palette, Layout as LayoutIcon } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return (
    <Loader2 className={cn(
      'animate-spin text-primary',
      sizeClasses[size],
      className
    )} />
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  variant?: 'text' | 'card' | 'avatar' | 'button'
}

export function LoadingSkeleton({ 
  className, 
  lines = 1, 
  variant = 'text' 
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="rounded-lg bg-muted h-40 w-full mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    )
  }
  
  if (variant === 'avatar') {
    return (
      <div className={cn("animate-pulse flex items-center space-x-3", className)}>
        <div className="rounded-full bg-muted h-8 w-8" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
    )
  }
  
  if (variant === 'button') {
    return (
      <div className={cn("animate-pulse h-9 bg-muted rounded w-24", className)} />
    )
  }
  
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            "h-4 bg-muted rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function ProgressBar({ 
  progress, 
  className, 
  showPercentage = false,
  size = 'md',
  variant = 'default'
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-destructive'
  }
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

// Content generation specific loading states
interface ContentLoadingProps {
  pageTitle?: string
  className?: string
}

export function ContentGenerationLoading({ pageTitle, className }: ContentLoadingProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}>
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping">
          <Sparkles className="h-6 w-6 text-primary/50" />
        </div>
        <Sparkles className="h-6 w-6 text-primary relative z-10" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Generating Content</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {pageTitle ? `Creating content for "${pageTitle}"` : 'Creating AI-powered content for your page'}
      </p>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LoadingDots />
        <span>This may take a few moments</span>
      </div>
    </div>
  )
}

// Page loading placeholder
export function PageLoadingPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton lines={3} />
      <div className="grid grid-cols-2 gap-4">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="button" />
      </div>
    </div>
  )
}

// Empty state with loading option
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
  loading?: boolean
  className?: string
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
  loading = false,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}>
      <div className={cn(
        "rounded-full p-4 mb-4 transition-colors",
        loading ? "bg-primary/10" : "bg-muted/50"
      )}>
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <Icon className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      
      {action && !loading && action}
    </div>
  )
}

// Specialized loading states for different builder contexts
export function BuilderLoadingState({ type }: { type: 'structure' | 'content' | 'theme' | 'layout' }) {
  const configs = {
    structure: {
      icon: FileText,
      title: 'Loading Structure',
      description: 'Setting up your website structure...'
    },
    content: {
      icon: Sparkles,
      title: 'Generating Content',
      description: 'Creating AI-powered content...'
    },
    theme: {
      icon: Palette,
      title: 'Loading Themes',
      description: 'Preparing visual themes...'
    },
    layout: {
      icon: LayoutIcon,
      title: 'Loading Layout Builder',
      description: 'Initializing layout tools...'
    }
  }
  
  const config = configs[type]
  
  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      loading
    />
  )
}