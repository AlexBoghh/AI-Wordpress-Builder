import React from 'react'
import { cn } from '@/lib/utils'
import { 
  Type, Image, MousePointer, 
  Star, Play, MapPin,
  Facebook, Twitter, Instagram,
  Menu, ChevronRight
} from 'lucide-react'

// Elementor-specific block types
export type ElementorBlockType = 
  | 'section'           // Elementor Section
  | 'column'            // Elementor Column  
  | 'inner-section'     // Elementor Inner Section
  | 'heading'           // Heading Widget
  | 'text-editor'       // Text Editor Widget
  | 'image'             // Image Widget
  | 'button'            // Button Widget
  | 'spacer'            // Spacer Widget
  | 'divider'           // Divider Widget
  | 'icon-list'         // Icon List Widget
  | 'image-carousel'    // Image Carousel Widget
  | 'testimonial'       // Testimonial Widget
  | 'contact-form'      // Contact Form Widget
  | 'google-maps'       // Google Maps Widget
  | 'social-icons'      // Social Icons Widget
  | 'menu'              // Nav Menu Widget
  | 'video'             // Video Widget

export interface ElementorBlock {
  id: string
  type: ElementorBlockType
  settings?: Record<string, unknown>
  elements?: ElementorBlock[] // For sections/columns containing other elements
}

interface ElementorWireframeProps {
  block: ElementorBlock
  className?: string
  isEditable?: boolean
  onEdit?: (block: ElementorBlock) => void
}

// Section wireframe - can contain columns
export const SectionWireframe: React.FC<{ 
  columns?: number
  children?: React.ReactNode 
  className?: string
}> = ({ columns = 1, children, className }) => {
  return (
    <div className={cn(
      "w-full border-2 border-dashed border-blue-300 rounded-lg p-4 min-h-[120px]",
      "bg-blue-50/30",
      className
    )}>
      <div className="text-[10px] text-blue-600 font-medium mb-2">SECTION</div>
      <div className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        columns === 5 && "grid-cols-5",
        columns === 6 && "grid-cols-6"
      )}>
        {children}
      </div>
    </div>
  )
}

// Column wireframe - contains widgets
export const ColumnWireframe: React.FC<{ 
  children?: React.ReactNode
  className?: string 
}> = ({ children, className }) => {
  return (
    <div className={cn(
      "border border-dashed border-gray-300 rounded p-3 min-h-[100px]",
      "bg-gray-50/30",
      className
    )}>
      <div className="text-[9px] text-gray-500 font-medium mb-2">COLUMN</div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

// Individual widget wireframes
export const HeadingWireframe: React.FC<{ 
  level?: number
  text?: string 
}> = ({ level = 2, text = "Heading" }) => {
  const sizes = {
    1: 'h-8 text-lg',
    2: 'h-6 text-base',
    3: 'h-5 text-sm',
    4: 'h-4 text-sm',
    5: 'h-4 text-xs',
    6: 'h-3 text-xs'
  }
  
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded border">
      <Type className="h-3 w-3 text-gray-400" />
      <div className={cn("font-semibold text-gray-700", sizes[level as keyof typeof sizes])}>
        {text}
      </div>
    </div>
  )
}

export const TextEditorWireframe: React.FC = () => (
  <div className="p-3 bg-white rounded border">
    <div className="space-y-1.5">
      <div className="h-1.5 bg-gray-200 rounded w-full" />
      <div className="h-1.5 bg-gray-200 rounded w-11/12" />
      <div className="h-1.5 bg-gray-200 rounded w-4/5" />
    </div>
  </div>
)

export const ImageWireframe: React.FC<{ aspectRatio?: string }> = ({ 
  aspectRatio = "16/9" 
}) => (
  <div 
    className="bg-gray-100 rounded border flex items-center justify-center"
    style={{ aspectRatio }}
  >
    <Image className="h-8 w-8 text-gray-400" />
  </div>
)

export const ButtonWireframe: React.FC<{ 
  text?: string
  align?: 'left' | 'center' | 'right' 
}> = ({ text = "Click Here", align = 'left' }) => (
  <div className={cn(
    "flex",
    align === 'center' && "justify-center",
    align === 'right' && "justify-end"
  )}>
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded text-sm">
      <MousePointer className="h-3 w-3" />
      {text}
    </div>
  </div>
)

export const SpacerWireframe: React.FC<{ height?: number }> = ({ height = 50 }) => (
  <div 
    className="relative"
    style={{ height: `${height}px` }}
  >
    <div className="absolute inset-0 border-t border-b border-dashed border-gray-300">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-white px-1">
        {height}px
      </div>
    </div>
  </div>
)

export const DividerWireframe: React.FC = () => (
  <div className="py-2">
    <div className="h-px bg-gray-300" />
  </div>
)

export const IconListWireframe: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="p-3 bg-white rounded border">
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <ChevronRight className="h-3 w-3 text-blue-500" />
          <div className="h-1.5 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  </div>
)

export const TestimonialWireframe: React.FC = () => (
  <div className="p-4 bg-white rounded border">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-gray-200 rounded w-full" />
          <div className="h-1.5 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="h-1.5 bg-gray-300 rounded w-1/3 mt-3" />
      </div>
    </div>
  </div>
)

export const ContactFormWireframe: React.FC = () => (
  <div className="p-4 bg-white rounded border space-y-3">
    <div className="space-y-2">
      <div className="h-8 bg-gray-100 rounded border" />
      <div className="h-8 bg-gray-100 rounded border" />
      <div className="h-20 bg-gray-100 rounded border" />
    </div>
    <div className="flex justify-end">
      <div className="px-4 py-2 bg-blue-500 text-white rounded text-sm">
        Submit
      </div>
    </div>
  </div>
)

export const GoogleMapsWireframe: React.FC = () => (
  <div className="bg-gray-100 rounded border h-64 flex items-center justify-center">
    <MapPin className="h-8 w-8 text-gray-400" />
  </div>
)

export const SocialIconsWireframe: React.FC = () => (
  <div className="flex gap-2 p-2">
    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
      <Facebook className="h-4 w-4 text-gray-600" />
    </div>
    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
      <Twitter className="h-4 w-4 text-gray-600" />
    </div>
    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
      <Instagram className="h-4 w-4 text-gray-600" />
    </div>
  </div>
)

export const MenuWireframe: React.FC = () => (
  <div className="flex items-center gap-6 p-2">
    <Menu className="h-4 w-4 text-gray-600" />
    {['Home', 'About', 'Services', 'Contact'].map((item) => (
      <div key={item} className="text-sm text-gray-600">{item}</div>
    ))}
  </div>
)

export const VideoWireframe: React.FC = () => (
  <div className="bg-black rounded aspect-video flex items-center justify-center">
    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
      <Play className="h-6 w-6 text-white ml-1" />
    </div>
  </div>
)

// Main wireframe component that renders based on block type
export const ElementorWireframe: React.FC<ElementorWireframeProps> = ({ 
  block,
  className,
  isEditable = false,
  onEdit
}) => {
  const handleClick = () => {
    if (isEditable && onEdit) {
      onEdit(block)
    }
  }

  const wrapperClasses = cn(
    "relative group",
    isEditable && "cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2",
    className
  )

  switch (block.type) {
    case 'section':
      const columnCount = block.elements?.length || 1
      return (
        <div className={wrapperClasses} onClick={handleClick}>
          <SectionWireframe columns={columnCount}>
            {block.elements?.map((col) => (
              <ElementorWireframe key={col.id} block={col} isEditable={isEditable} onEdit={onEdit} />
            ))}
          </SectionWireframe>
        </div>
      )

    case 'column':
      return (
        <ColumnWireframe className={wrapperClasses}>
          {block.elements?.map((widget) => (
            <ElementorWireframe key={widget.id} block={widget} isEditable={isEditable} onEdit={onEdit} />
          ))}
        </ColumnWireframe>
      )

    case 'heading':
      return <div className={wrapperClasses} onClick={handleClick}>
        <HeadingWireframe {...block.settings} />
      </div>

    case 'text-editor':
      return <div className={wrapperClasses} onClick={handleClick}>
        <TextEditorWireframe />
      </div>

    case 'image':
      return <div className={wrapperClasses} onClick={handleClick}>
        <ImageWireframe {...block.settings} />
      </div>

    case 'button':
      return <div className={wrapperClasses} onClick={handleClick}>
        <ButtonWireframe {...block.settings} />
      </div>

    case 'spacer':
      return <div className={wrapperClasses} onClick={handleClick}>
        <SpacerWireframe {...block.settings} />
      </div>

    case 'divider':
      return <div className={wrapperClasses} onClick={handleClick}>
        <DividerWireframe />
      </div>

    case 'icon-list':
      return <div className={wrapperClasses} onClick={handleClick}>
        <IconListWireframe {...block.settings} />
      </div>

    case 'testimonial':
      return <div className={wrapperClasses} onClick={handleClick}>
        <TestimonialWireframe />
      </div>

    case 'contact-form':
      return <div className={wrapperClasses} onClick={handleClick}>
        <ContactFormWireframe />
      </div>

    case 'google-maps':
      return <div className={wrapperClasses} onClick={handleClick}>
        <GoogleMapsWireframe />
      </div>

    case 'social-icons':
      return <div className={wrapperClasses} onClick={handleClick}>
        <SocialIconsWireframe />
      </div>

    case 'menu':
      return <div className={wrapperClasses} onClick={handleClick}>
        <MenuWireframe />
      </div>

    case 'video':
      return <div className={wrapperClasses} onClick={handleClick}>
        <VideoWireframe />
      </div>

    default:
      return <div className={cn("p-2 bg-gray-100 rounded text-xs text-gray-500", wrapperClasses)}>
        Unknown widget: {block.type}
      </div>
  }
}