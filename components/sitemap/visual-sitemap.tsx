"use client"

import React, { useMemo, useCallback, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './sitemap.css'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react'
import { SitemapNode } from './sitemap-node'
import { pagesToSitemapNodes, calculateTreeLayout } from './sitemap-utils'

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
}

interface VisualSitemapProps {
  pages: Page[]
  pageContents: Record<string, string>
  onPageSelect?: (page: Page) => void
}

// Import the new expandable node
import { ExpandableSitemapNode } from './expandable-sitemap-node'
import { EditableSitemapNode } from './editable-sitemap-node'

const nodeTypes = {
  default: ExpandableSitemapNode,
  input: SitemapNode,
  output: ExpandableSitemapNode,
  editable: EditableSitemapNode,
}

export function VisualSitemap({ pages, pageContents, onPageSelect }: VisualSitemapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  
  // Initialize nodes and edges from pages
  useMemo(() => {
    if (pages.length === 0) return
    
    const { nodes: initialNodes, edges: initialEdges } = pagesToSitemapNodes(pages, pageContents)
    const layoutedNodes = calculateTreeLayout(initialNodes, initialEdges)
    
    setNodes(layoutedNodes)
    setEdges(initialEdges)
  }, [pages, pageContents, setNodes, setEdges])
  
  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
    
    // Find the actual page (not menu or root nodes)
    const page = pages.find(p => p.id === node.id)
    if (page && onPageSelect) {
      onPageSelect(page)
    }
  }, [pages, onPageSelect])
  
  // Handle edge connection
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )
  
  // Auto-layout function
  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = calculateTreeLayout(nodes, edges)
    setNodes(layoutedNodes)
  }, [nodes, edges, setNodes])
  
  // Export sitemap as image
  const handleExport = useCallback(() => {
    // This would require additional implementation with html2canvas or similar
    console.log('Export sitemap as image - to be implemented')
  }, [])
  
  // Minimap node color
  const nodeColor = (node: Node) => {
    if (node.id === 'root') return '#4f46e5'
    if (node.id.startsWith('menu-')) return '#9ca3af'
    if (node.data?.hasContent) return '#10b981'
    return '#e5e7eb'
  }
  
  if (pages.length === 0) {
    return (
      <Card className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">No Pages Yet</h3>
          <p className="text-sm text-muted-foreground">
            Create some pages to see your visual sitemap
          </p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="h-full w-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { strokeWidth: 2 }
        }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-left"
        />
        <MiniMap 
          nodeColor={nodeColor}
          position="bottom-right"
          pannable
          zoomable
          style={{
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb'
          }}
        />
        
        {/* Custom toolbar */}
        <Panel position="top-left" className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAutoLayout}
            className="shadow-sm"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Auto Layout
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="shadow-sm"
          >
            <Download className="h-3 w-3 mr-1.5" />
            Export
          </Button>
        </Panel>
        
        {/* Legend */}
        <Panel position="top-right" className="bg-card border rounded-lg shadow-sm p-3">
          <h4 className="text-sm font-semibold mb-2">Legend</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span>Root</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted" />
              <span>Menu Group</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Published Content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span>Draft Content</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2 border-border bg-white dark:bg-gray-800" />
              <span>No Content</span>
            </div>
            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="text-[10px] font-medium text-muted-foreground mb-1">INTERACTIONS</div>
              <div className="flex items-center gap-2">
                <span>▶</span>
                <span>Click to expand/collapse</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}