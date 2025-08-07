export type ContentBlockType = 
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'quote'
  | 'button'
  | 'separator'
  | 'columns'
  | 'section'
  | 'image'
  | 'gallery'
  | 'form'
  | 'custom'

export interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
  attributes?: Record<string, any>
  order: number
  children?: ContentBlock[]
}

export interface PageWithBlocks {
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
  contentBlocks?: ContentBlock[]
}

export interface EditableContentBlock extends ContentBlock {
  isEditing?: boolean
  isDirty?: boolean
  originalContent?: string
}