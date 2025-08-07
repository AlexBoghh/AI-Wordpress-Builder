"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronRight, Home, Layout, FileText, Palette, Upload, Settings, BarChart3, MoreHorizontal, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { SimpleTooltip } from './tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMediaQuery } from '@/hooks/use-media-query'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  description?: string
  shortLabel?: string // For mobile truncation
  ariaLabel?: string // Custom aria-label
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHomeIcon?: boolean
  separator?: React.ReactNode
  maxItems?: number // Maximum items to show before collapsing
  showCollapsedDropdown?: boolean // Show "..." dropdown for collapsed items
}

interface BreadcrumbContextProps {
  currentPage?: string
  currentProject?: string
  currentTab?: string
  projectName?: string
}

export function Breadcrumb({ 
  items, 
  className, 
  showHomeIcon = true,
  separator = <ChevronRight className="h-3 w-3 text-muted-foreground/60" />,
  maxItems = 4,
  showCollapsedDropdown = true
}: BreadcrumbProps) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  
  // Adjust maxItems based on screen size
  const effectiveMaxItems = isMobile ? 2 : isTablet ? 3 : maxItems
  
  // Handle item collapsing logic
  const shouldCollapse = items.length > effectiveMaxItems && showCollapsedDropdown
  const visibleItems = shouldCollapse ? [
    items[0], // Always show first item (home)
    ...items.slice(-(effectiveMaxItems - 1)) // Show last few items
  ] : items
  const collapsedItems = shouldCollapse ? items.slice(1, -(effectiveMaxItems - 1)) : []
  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isOriginalLast: boolean) => {
    const Icon = item.icon
    const displayLabel = isMobile && item.shortLabel ? item.shortLabel : item.label
    const maxLabelLength = isMobile ? 12 : isTablet ? 20 : 30
    const truncatedLabel = displayLabel.length > maxLabelLength 
      ? `${displayLabel.slice(0, maxLabelLength)}...` 
      : displayLabel
    
    return (
      <div className="flex items-center min-w-0">
        {Icon && (
          <SimpleTooltip content={item.description || item.label}>
            <Icon className={cn(
              "h-3.5 w-3.5 flex-shrink-0",
              isOriginalLast || item.isActive 
                ? "text-foreground" 
                : "text-muted-foreground"
            )} />
          </SimpleTooltip>
        )}
        
        {item.href && !isOriginalLast ? (
          <SimpleTooltip content={item.description || item.label}>
            <Link
              href={item.href}
              className={cn(
                "truncate hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:rounded-sm px-1 py-0.5 -mx-1 -my-0.5",
                Icon ? "ml-1.5" : "",
                item.isActive 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              )}
              aria-label={item.ariaLabel || `Navigate to ${item.label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.currentTarget.click()
                }
              }}
            >
              {truncatedLabel}
            </Link>
          </SimpleTooltip>
        ) : (
          <SimpleTooltip content={item.description || item.label}>
            <span 
              className={cn(
                "truncate",
                Icon ? "ml-1.5" : "",
                isOriginalLast || item.isActive 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              )}
              aria-current={isOriginalLast ? "page" : undefined}
            >
              {truncatedLabel}
            </span>
          </SimpleTooltip>
        )}
      </div>
    )
  }
  
  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1
          const originalIndex = shouldCollapse && index > 0 
            ? items.indexOf(item) 
            : index
          const isOriginalLast = originalIndex === items.length - 1
          
          return (
            <li key={originalIndex} className="flex items-center">
              {/* Show collapsed dropdown after first item */}
              {shouldCollapse && index === 1 && collapsedItems.length > 0 && (
                <>
                  <span className="mx-2 flex-shrink-0" aria-hidden="true">
                    {separator}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-muted-foreground hover:text-foreground focus:ring-2 focus:ring-primary/20"
                        aria-label={`Show ${collapsedItems.length} hidden breadcrumb items`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            e.currentTarget.click()
                          }
                        }}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {collapsedItems.map((collapsedItem, collapsedIndex) => {
                        const Icon = collapsedItem.icon
                        return (
                          <DropdownMenuItem key={collapsedIndex} asChild>
                            {collapsedItem.href ? (
                              <Link
                                href={collapsedItem.href}
                                className="flex items-center w-full focus:outline-none focus:bg-accent rounded-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    window.location.href = collapsedItem.href!
                                  }
                                }}
                              >
                                {Icon && <Icon className="h-3.5 w-3.5 mr-2" />}
                                {collapsedItem.label}
                              </Link>
                            ) : (
                              <div className="flex items-center w-full">
                                {Icon && <Icon className="h-3.5 w-3.5 mr-2" />}
                                {collapsedItem.label}
                              </div>
                            )}
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              
              {/* Regular separator */}
              {index > 0 && !(shouldCollapse && index === 1) && (
                <span className="mx-2 flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {renderBreadcrumbItem(item, index, isOriginalLast)}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Smart breadcrumb component that auto-generates based on current context
export function SmartBreadcrumb({ 
  currentPage,
  currentProject,
  currentTab,
  projectName,
  className
}: BreadcrumbContextProps & { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = []
    
    // Home
    items.push({
      label: "Home",
      href: "/",
      icon: Home,
      description: "Go to homepage",
      shortLabel: "Home"
    })
    
    // Route-based breadcrumbs
    if (pathname.includes('/builder')) {
      items.push({
        label: projectName || "Website Builder",
        href: "/builder",
        icon: Layout,
        description: "Main website builder interface",
        shortLabel: projectName && projectName.length > 12 ? `${projectName.slice(0, 12)}...` : (projectName || "Builder")
      })
      
      // Tab-specific breadcrumbs
      if (currentTab) {
        const tabConfig = {
          visual: { label: "Structure", icon: FileText, description: "Site structure and page management", shortLabel: "Pages" },
          sitemap: { label: "Sitemap", icon: Share2, description: "Visual site structure overview", shortLabel: "Sitemap" },
          theme: { label: "Theme", icon: Palette, description: "Visual theme and styling options", shortLabel: "Theme" },
          layout: { label: "Layout", icon: Layout, description: "Custom layout builder", shortLabel: "Layout" },
          import: { label: "Import", icon: Upload, description: "Import content from CSV", shortLabel: "Import" }
        }
        
        const config = tabConfig[currentTab as keyof typeof tabConfig]
        if (config) {
          items.push({
            label: config.label,
            icon: config.icon,
            description: config.description,
            shortLabel: config.shortLabel,
            isActive: true
          })
        }
      }
      
      // Current page context
      if (currentPage) {
        items.push({
          label: currentPage,
          icon: FileText,
          description: `Editing content for ${currentPage}`,
          shortLabel: currentPage.length > 10 ? `${currentPage.slice(0, 10)}...` : currentPage,
          isActive: true
        })
      }
    }
    
    if (pathname.includes('/layout-builder')) {
      // Add project context if available
      if (projectName && projectName !== "Layout Builder") {
        items.push({
          label: "Website Builder",
          href: "/builder",
          icon: Layout,
          description: "Return to main builder",
          shortLabel: "Builder"
        })
        
        items.push({
          label: projectName,
          href: "/builder",
          icon: FileText,
          description: `Project: ${projectName}`,
          shortLabel: projectName.length > 15 ? `${projectName.slice(0, 15)}...` : projectName
        })
      } else {
        items.push({
          label: "Website Builder",
          href: "/builder",
          icon: Layout,
          description: "Return to main builder",
          shortLabel: "Builder"
        })
      }
      
      items.push({
        label: "Layout Builder",
        icon: Layout,
        description: "Visual layout design interface",
        shortLabel: "Layout",
        isActive: true
      })
    }
    
    if (pathname.includes('/projects')) {
      items.push({
        label: "Projects",
        href: "/projects",
        icon: FileText,
        description: "View all projects",
        shortLabel: "Projects"
      })
      
      if (currentProject) {
        items.push({
          label: projectName || "Project",
          icon: FileText,
          description: `Project: ${projectName || currentProject}`,
          shortLabel: (projectName && projectName.length > 12) ? `${projectName.slice(0, 12)}...` : (projectName || "Project"),
          isActive: true
        })
      }
    }
    
    return items
  }
  
  const breadcrumbItems = generateBreadcrumbs()
  
  // Don't show breadcrumbs on home page
  if (breadcrumbItems.length <= 1) {
    return null
  }
  
  return <Breadcrumb items={breadcrumbItems} className={className} />
}

// Context-aware breadcrumb wrapper for builder interface
export function BuilderBreadcrumb({
  projectName,
  currentTab,
  currentPage
}: {
  projectName?: string
  currentTab?: string
  currentPage?: string
}) {
  const isMobile = useMediaQuery('(max-width: 640px)')
  
  return (
    <div className="flex items-center justify-between py-1.5 px-4 bg-muted/30 border-b border-border/50">
      <div className="flex-1 min-w-0">
        <SmartBreadcrumb 
          projectName={projectName}
          currentTab={currentTab}
          currentPage={currentPage}
        />
      </div>
      
      {/* Quick actions - hide on mobile to save space */}
      {!isMobile && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4 flex-shrink-0">
          <span>Navigate:</span>
          <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">
            Ctrl+B
          </kbd>
          <span>for shortcuts</span>
        </div>
      )}
    </div>
  )
}

// Breadcrumb with progress indicator for multi-step processes
export function ProgressBreadcrumb({
  steps,
  currentStep,
  onStepClick
}: {
  steps: Array<{ label: string; icon?: React.ComponentType<{ className?: string }> }>
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}) {
  return (
    <nav className="flex items-center space-x-4 py-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isClickable = onStepClick && (isCompleted || index <= currentStep + 1)
        const Icon = step.icon
        
        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <div className={cn(
                "h-px w-8 mx-4 transition-colors",
                isCompleted ? "bg-primary" : "bg-border"
              )} />
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 h-auto p-2 transition-all",
                isActive && "bg-primary/10 text-primary",
                isCompleted && "text-muted-foreground",
                !isClickable && "cursor-default"
              )}
              onClick={isClickable ? () => onStepClick(index) : undefined}
              disabled={!isClickable}
            >
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors",
                isActive && "border-primary bg-primary text-primary-foreground",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                !isActive && !isCompleted && "border-border"
              )}>
                {Icon ? (
                  <Icon className="h-3 w-3" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-sm font-medium",
                isActive && "text-primary"
              )}>
                {step.label}
              </span>
            </Button>
          </div>
        )
      })}
    </nav>
  )
}