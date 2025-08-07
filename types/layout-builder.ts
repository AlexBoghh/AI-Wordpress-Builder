// Layout Builder Type Definitions

export interface Layout {
  id: string
  name: string
  description?: string
  sections: Section[]
  settings: LayoutSettings
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface Section {
  id: string
  type: SectionType
  content: SectionContent
  settings: SectionSettings
  order: number
}

export type SectionType = 
  | 'header'
  | 'content' 
  | 'footer'
  | 'hero'
  | 'features'
  | 'cta'
  | 'testimonial'

export interface SectionContent {
  // Header section content
  title?: string
  subtitle?: string
  logo?: string
  navigation?: NavigationItem[]
  
  // Content section
  body?: string
  columns?: number
  columnContents?: string[]  // Array of content for multiple columns
  linkedPageId?: string  // Link to a page for dynamic content
  contentSource?: 'static' | 'dynamic'  // Choose between static or page content
  
  // Footer section
  copyright?: string
  links?: FooterLink[]
  socialLinks?: SocialLink[]
  
  // Common
  blocks?: Block[]
}

export interface Block {
  id: string
  type: BlockType
  content: any // Will be refined based on block type
  settings: BlockSettings
  order: number
}

export type BlockType = 
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'spacer'
  | 'divider'

export interface SectionSettings {
  backgroundColor?: string
  textColor?: string
  padding?: SpacingValue
  margin?: SpacingValue
  minHeight?: string
  maxWidth?: string
  fullWidth?: boolean
  className?: string
  customCss?: string
}

export interface BlockSettings {
  alignment?: 'left' | 'center' | 'right'
  spacing?: SpacingValue
  animation?: AnimationSettings
  responsive?: ResponsiveSettings
}

export interface LayoutSettings {
  theme?: string
  globalStyles?: GlobalStyles
  responsive?: ResponsiveBreakpoints
  metadata?: LayoutMetadata
}

export interface GlobalStyles {
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
}

export interface SpacingValue {
  top?: number
  right?: number
  bottom?: number
  left?: number
  unit?: 'px' | 'rem' | '%'
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  target?: '_self' | '_blank'
  children?: NavigationItem[]
}

export interface FooterLink {
  id: string
  title: string
  links: Array<{
    label: string
    href: string
  }>
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube'
  url: string
}

export interface AnimationSettings {
  type?: 'fadeIn' | 'slideIn' | 'zoomIn'
  duration?: number
  delay?: number
  easing?: string
}

export interface ResponsiveSettings {
  mobile?: Partial<SectionSettings>
  tablet?: Partial<SectionSettings>
  desktop?: Partial<SectionSettings>
}

export interface ResponsiveBreakpoints {
  mobile: number
  tablet: number
  desktop: number
}

export interface LayoutMetadata {
  author?: string
  version?: string
  tags?: string[]
  category?: string
}

// Layout History for Undo/Redo
export interface LayoutHistory {
  past: Layout[]
  present: Layout
  future: Layout[]
}

// Layout Builder State
export interface LayoutBuilderState {
  layout: Layout | null
  selectedSectionId: string | null
  selectedBlockId: string | null
  isDirty: boolean
  isSaving: boolean
  history: LayoutHistory
  previewMode: 'edit' | 'preview'
  deviceView: 'mobile' | 'tablet' | 'desktop'
}

// Action types for state management
export type LayoutAction =
  | { type: 'SET_LAYOUT'; payload: Layout }
  | { type: 'ADD_SECTION'; payload: Section }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<Section> } }
  | { type: 'DELETE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<LayoutSettings> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_PREVIEW_MODE'; payload: 'edit' | 'preview' }
  | { type: 'SET_DEVICE_VIEW'; payload: 'mobile' | 'tablet' | 'desktop' }
  | { type: 'MARK_DIRTY'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }