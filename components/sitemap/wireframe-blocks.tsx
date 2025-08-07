"use client"

import React from 'react'
import { 
  Type, Image, Layout, MessageSquare, BarChart3, 
  Users, Mail, FileText, Edit3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WireframeBlockProps {
  type: string
  content?: string
  attributes?: Record<string, unknown>
  className?: string
}

export function WireframeBlock({ type, content, attributes, className }: WireframeBlockProps) {
  const getBlockIcon = () => {
    const iconMap: Record<string, React.ElementType> = {
      header: Type,
      heading: Type,
      text: FileText,
      paragraph: FileText,
      image: Image,
      gallery: Layout,
      testimonial: MessageSquare,
      stats: BarChart3,
      contact: Users,
      form: Mail,
      button: Edit3,
      hero: Layout,
      features: Layout,
      cta: Type,
      custom: Edit3
    }
    
    const IconComponent = iconMap[type.toLowerCase()] || FileText
    return <IconComponent className="h-3 w-3 text-muted-foreground" />
  }

  const getBlockColor = () => {
    const colorMap: Record<string, string> = {
      header: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
      heading: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
      text: 'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700',
      paragraph: 'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700',
      image: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
      gallery: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800',
      testimonial: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
      stats: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
      contact: 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800',
      form: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
      button: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800',
      hero: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800',
      features: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800',
      cta: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800',
      custom: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800'
    }
    
    return colorMap[type.toLowerCase()] || colorMap.text
  }

  const renderWireframe = () => {
    const baseType = type.toLowerCase()
    
    switch (baseType) {
      case 'header':
      case 'heading':
        return (
          <div className="space-y-1">
            <div className="h-2 bg-current opacity-20 rounded w-3/4"></div>
            {attributes?.level === 'h2' && <div className="h-1.5 bg-current opacity-15 rounded w-1/2"></div>}
          </div>
        )
      
      case 'text':
      case 'paragraph':
        return (
          <div className="space-y-1">
            <div className="h-1 bg-current opacity-10 rounded"></div>
            <div className="h-1 bg-current opacity-10 rounded"></div>
            <div className="h-1 bg-current opacity-10 rounded w-4/5"></div>
          </div>
        )
      
      case 'image':
        return (
          <div className="aspect-video bg-current opacity-5 rounded flex items-center justify-center">
            <Image className="h-4 w-4 opacity-20" />
          </div>
        )
      
      case 'gallery':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-current opacity-5 rounded"></div>
            ))}
          </div>
        )
      
      case 'button':
        return (
          <div className="inline-block">
            <div className="h-6 px-3 bg-current opacity-10 rounded flex items-center">
              <div className="h-1 w-12 bg-white dark:bg-gray-900 rounded"></div>
            </div>
          </div>
        )
      
      case 'form':
        return (
          <div className="space-y-1">
            <div className="h-4 bg-current opacity-5 rounded"></div>
            <div className="h-4 bg-current opacity-5 rounded"></div>
            <div className="h-6 bg-current opacity-10 rounded w-24"></div>
          </div>
        )
      
      case 'hero':
        return (
          <div className="space-y-2">
            <div className="h-3 bg-current opacity-20 rounded w-4/5"></div>
            <div className="h-1 bg-current opacity-10 rounded"></div>
            <div className="h-1 bg-current opacity-10 rounded w-3/4"></div>
            <div className="h-6 bg-current opacity-15 rounded w-24 mt-2"></div>
          </div>
        )
      
      case 'features':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-3 bg-current opacity-10 rounded"></div>
                <div className="h-1 bg-current opacity-5 rounded"></div>
              </div>
            ))}
          </div>
        )
      
      case 'testimonial':
        return (
          <div className="space-y-1">
            <div className="h-1 bg-current opacity-10 rounded"></div>
            <div className="h-1 bg-current opacity-10 rounded w-5/6"></div>
            <div className="flex items-center gap-1 mt-2">
              <div className="h-3 w-3 bg-current opacity-15 rounded-full"></div>
              <div className="h-1 w-12 bg-current opacity-10 rounded"></div>
            </div>
          </div>
        )
      
      case 'stats':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center space-y-1">
                <div className="h-2 bg-current opacity-15 rounded mx-auto w-8"></div>
                <div className="h-1 bg-current opacity-5 rounded"></div>
              </div>
            ))}
          </div>
        )
      
      case 'contact':
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-current opacity-10 rounded"></div>
              <div className="h-1 flex-1 bg-current opacity-5 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-current opacity-10 rounded"></div>
              <div className="h-1 flex-1 bg-current opacity-5 rounded"></div>
            </div>
          </div>
        )
      
      case 'cta':
        return (
          <div className="text-center space-y-2">
            <div className="h-2 bg-current opacity-20 rounded w-3/4 mx-auto"></div>
            <div className="h-1 bg-current opacity-10 rounded w-5/6 mx-auto"></div>
            <div className="h-6 bg-current opacity-15 rounded w-24 mx-auto mt-2"></div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-1">
            <div className="h-1 bg-current opacity-10 rounded"></div>
            <div className="h-1 bg-current opacity-10 rounded w-3/4"></div>
          </div>
        )
    }
  }

  return (
    <div className={cn(
      "p-2 rounded-md border",
      getBlockColor(),
      className
    )}>
      <div className="flex items-start gap-2 mb-2">
        {getBlockIcon()}
        <span className="text-xs font-medium capitalize">{type}</span>
      </div>
      <div className="pl-5">
        {renderWireframe()}
      </div>
      {content && (
        <p className="text-xs text-muted-foreground mt-2 pl-5 line-clamp-2">
          {content}
        </p>
      )}
    </div>
  )
}