"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  description?: string
  backButton?: {
    href: string
    label?: string
  }
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  backButton,
  actions,
  className,
  children
}: PageHeaderProps) {
  return (
    <header className={cn("border-b bg-card", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {backButton && (
              <Link href={backButton.href}>
                <Button variant="ghost" size="sm" className="h-9">
                  <ArrowLeft className="h-3 w-3 mr-1.5" />
                  {backButton.label || "Back"}
                </Button>
              </Link>
            )}
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight text-foreground truncate">
                  {title}
                </h1>
                {children}
              </div>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center gap-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Specialized header for builder interfaces
interface BuilderHeaderProps extends Omit<PageHeaderProps, 'title'> {
  projectName: string
  onProjectNameChange: (name: string) => void
  isSaving?: boolean
  projectId?: string | null
  pageCount?: number
  statusIndicator?: React.ReactNode
}

export function BuilderHeader({
  projectName,
  onProjectNameChange,
  isSaving,
  projectId,
  pageCount,
  statusIndicator,
  actions,
  ...props
}: BuilderHeaderProps) {
  return (
    <PageHeader
      title=""
      actions={actions}
      {...props}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className={cn(
              "text-xl font-semibold bg-transparent border-none outline-none",
              "focus:ring-2 focus:ring-primary rounded px-2 py-1 -mx-2 -my-1",
              "transition-all duration-200 min-w-0 truncate"
            )}
            placeholder="Untitled Project"
          />
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {/* Save Status */}
          {isSaving && (
            <span className="flex items-center gap-1.5">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              Saving...
            </span>
          )}
          {!isSaving && projectId && (
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <div className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full" />
              Saved
            </span>
          )}
          
          {/* Page Count */}
          {typeof pageCount === 'number' && (
            <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium">
              {pageCount} page{pageCount !== 1 ? 's' : ''}
            </span>
          )}
          
          {/* Additional Status */}
          {statusIndicator}
        </div>
      </div>
    </PageHeader>
  )
}