export interface Page {
  id: string
  title: string
  slug: string
  menu?: string | null
  submenu?: string | null
  metaDescription?: string | null
  keywords?: string | null
  contentType: string
  priority: string
  content?: string | null
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  pages: Page[]
}

export interface CSVRow {
  title: string
  slug: string
  menu?: string
  submenu?: string
  meta_description?: string
  keywords?: string
  content_type?: string
  priority?: string
  content?: string
}

export interface GenerateContentRequest {
  pageData: {
    title: string
    metaDescription?: string
    keywords?: string
    contentType?: string
    businessType?: string
  }
  generationType: 'individual' | 'batch'
}