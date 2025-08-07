import { Node, Edge } from 'reactflow'
import { ContentBlock, PageWithBlocks } from '@/types/content-blocks'
import { parseContentToBlocks, groupBlocksIntoSections } from '@/lib/content-block-parser'

interface Page {
  id: string
  title: string
  slug: string
  menu?: string
  submenu?: string
  metaDescription?: string
  keywords?: string
  contentType: 'page' | 'post' | 'product' | 'portfolio'
  priority: string
  parentId?: string
}

export interface SitemapNode extends Node {
  data: {
    page: PageWithBlocks
    hasContent: boolean
    childCount: number
    contentBlocks?: ContentBlock[]
    isExpanded?: boolean
    onContentUpdate?: (pageId: string, blocks: ContentBlock[]) => void
  }
}

export interface SitemapEdge extends Edge {
  type: 'smoothstep'
  animated?: boolean
}

// Convert flat page array to hierarchical structure for React Flow
export function pagesToSitemapNodes(
  pages: Page[], 
  pageContents: Record<string, string>,
  options?: {
    useEditableNodes?: boolean
    onContentUpdate?: (pageId: string, blocks: ContentBlock[]) => void
  }
): { nodes: SitemapNode[], edges: SitemapEdge[] } {
  const nodes: SitemapNode[] = []
  const edges: SitemapEdge[] = []
  
  // Group pages by menu
  const menuGroups = pages.reduce((acc, page) => {
    const menu = page.menu || 'Other'
    if (!acc[menu]) acc[menu] = []
    acc[menu].push(page)
    return acc
  }, {} as Record<string, Page[]>)
  
  let yOffset = 0
  const MENU_SPACING = 300
  const PAGE_SPACING_X = 250
  const PAGE_SPACING_Y = 100
  
  // Create a virtual root node
  const rootNode: SitemapNode = {
    id: 'root',
    type: 'input',
    position: { x: 400, y: 0 },
    data: {
      page: {
        id: 'root',
        title: 'Website',
        slug: '/',
        contentType: 'page',
        priority: 'high'
      },
      hasContent: false,
      childCount: Object.keys(menuGroups).length
    }
  }
  nodes.push(rootNode)
  
  // Process each menu group
  Object.entries(menuGroups).forEach(([menuName, menuPages], menuIndex) => {
    const menuX = 200 + (menuIndex * MENU_SPACING)
    const menuY = 150
    
    // Create menu node
    const menuNode: SitemapNode = {
      id: `menu-${menuName}`,
      type: 'default',
      position: { x: menuX, y: menuY },
      data: {
        page: {
          id: `menu-${menuName}`,
          title: menuName,
          slug: menuName.toLowerCase().replace(/\s+/g, '-'),
          contentType: 'page',
          priority: 'medium'
        },
        hasContent: false,
        childCount: menuPages.length
      }
    }
    nodes.push(menuNode)
    
    // Connect root to menu
    edges.push({
      id: `root-menu-${menuName}`,
      source: 'root',
      target: `menu-${menuName}`,
      type: 'smoothstep',
      animated: false
    })
    
    // Process pages in this menu
    menuPages.forEach((page, pageIndex) => {
      const pageX = menuX - 100 + (pageIndex * 150)
      const pageY = menuY + PAGE_SPACING_Y + (page.submenu ? 0 : 50)
      
      // Parse content blocks if content exists
      const contentBlocks = pageContents[page.id] 
        ? groupBlocksIntoSections(parseContentToBlocks(pageContents[page.id]))
        : []
      
      // Create page node
      const pageNode: SitemapNode = {
        id: page.id,
        type: options?.useEditableNodes ? 'editable' : (page.contentType === 'page' ? 'default' : 'output'),
        position: { x: pageX, y: pageY },
        data: {
          page: page as PageWithBlocks,
          hasContent: !!pageContents[page.id],
          childCount: 0,
          contentBlocks: contentBlocks,
          isExpanded: false,
          onContentUpdate: options?.onContentUpdate
        }
      }
      nodes.push(pageNode)
      
      // Connect menu to page
      edges.push({
        id: `menu-${menuName}-${page.id}`,
        source: `menu-${menuName}`,
        target: page.id,
        type: 'smoothstep',
        animated: !!pageContents[page.id]
      })
    })
  })
  
  return { nodes, edges }
}

// Calculate automatic layout positions using a tree algorithm
export function calculateTreeLayout(
  nodes: SitemapNode[],
  edges: SitemapEdge[]
): SitemapNode[] {
  const nodeMap = new Map(nodes.map(node => [node.id, node]))
  const childrenMap = new Map<string, string[]>()
  
  // Build children map
  edges.forEach(edge => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, [])
    }
    childrenMap.get(edge.source)!.push(edge.target)
  })
  
  // Recursive function to calculate positions
  const calculatePositions = (
    nodeId: string,
    x: number,
    y: number,
    level: number = 0
  ): number => {
    const node = nodeMap.get(nodeId)
    if (!node) return x
    
    const children = childrenMap.get(nodeId) || []
    const LEVEL_HEIGHT = 120
    const NODE_WIDTH = 200
    
    if (children.length === 0) {
      // Leaf node
      node.position = { x, y }
      return x + NODE_WIDTH
    }
    
    // Process children first
    let childX = x
    const childY = y + LEVEL_HEIGHT
    
    children.forEach(childId => {
      childX = calculatePositions(childId, childX, childY, level + 1)
    })
    
    // Center parent over children
    const totalWidth = childX - x - NODE_WIDTH
    node.position = {
      x: x + totalWidth / 2,
      y
    }
    
    return childX
  }
  
  // Start from root
  calculatePositions('root', 0, 0)
  
  return Array.from(nodeMap.values())
}

// Get page icon based on content type
export function getPageIcon(contentType: Page['contentType']) {
  switch (contentType) {
    case 'post':
      return '📝'
    case 'product':
      return '🛍️'
    case 'portfolio':
      return '🎨'
    default:
      return '📄'
  }
}

// Get node style based on page properties
export function getNodeStyle(page: Page, hasContent: boolean) {
  const baseStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    border: '2px solid',
    minWidth: '150px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
  
  if (page.id === 'root') {
    return {
      ...baseStyle,
      backgroundColor: '#4f46e5',
      color: 'white',
      borderColor: '#4f46e5'
    }
  }
  
  if (page.id.startsWith('menu-')) {
    return {
      ...baseStyle,
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderColor: '#d1d5db'
    }
  }
  
  if (hasContent) {
    return {
      ...baseStyle,
      backgroundColor: '#10b981',
      color: 'white',
      borderColor: '#10b981'
    }
  }
  
  return {
    ...baseStyle,
    backgroundColor: '#ffffff',
    color: '#374151',
    borderColor: '#e5e7eb'
  }
}