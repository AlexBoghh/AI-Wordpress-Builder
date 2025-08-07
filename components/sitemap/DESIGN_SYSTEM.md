# Expandable Sitemap Nodes Design System

## Overview

This design system provides a comprehensive UI for expandable sitemap nodes that display content blocks within each page node. The system is built on top of React Flow and follows modern design principles with accessibility, animations, and responsive design in mind.

## Design Principles

### 1. Visual Hierarchy
- **Primary Level**: Page nodes with clear titles and status indicators
- **Secondary Level**: Content blocks with type-based color coding
- **Tertiary Level**: Content previews and metadata

### 2. Typography Scale
Following the Perfect Fourth (1.333) ratio:
- **Page titles**: `text-sm` (14px) - semibold
- **Block titles**: `text-xs` (12px) - medium
- **Content preview**: `text-[10px]` - regular
- **Metadata**: `text-[9px]` - regular (compact mode)

### 3. Spacing System (8px grid)
- **Node padding**: 16px (space-4)
- **Block spacing**: 8px (space-2)
- **Element gaps**: 8px (space-2)
- **Compact spacing**: 8px (space-2)

## Component Architecture

### SitemapNode Component
**File**: `sitemap-node.tsx`

Main expandable node component with the following features:
- Smooth expand/collapse animations
- Status indicators (published, draft, empty)
- Content blocks summary when collapsed
- Full content blocks list when expanded

### ContentBlock Components
**File**: `content-block.tsx`

Reusable components for displaying content blocks:
- `ContentBlockItem`: Individual block display
- `ContentBlocksList`: Container for multiple blocks
- Type-based icon and color system

## Visual Design Elements

### 1. Expandable Page Node Container

#### Collapsed State (180px min-width)
```
┌─────────────────────────┐
│ 🌐 Home            ▶   │ ← Page title + expand button
│ /home                   │ ← Slug
│ [3 blocks] ●●●         │ ← Content summary
└─────────────────────────┘
```

#### Expanded State (320px min-width)
```
┌───────────────────────────────┐
│ 🌐 Home               ▼      │
│ /home                         │
│ [3 blocks] ●●●                │
├───────────────────────────────┤
│ CONTENT BLOCKS (3)            │
│ ① 🎯 Header          [header] │
│   Welcome to our company...   │
│ ② 📝 About Us         [text]  │
│   We are a leading...        │
│ ③ 💬 Testimonial [testimonial]│
│   Our clients love...        │
└───────────────────────────────┘
```

### 2. Content Block Layout

Each content block includes:
- **Index indicator** (numbered circle, left side)
- **Type icon** (colored background)
- **Title and type badge**
- **Content preview** (truncated)
- **Edit button** (appears on hover)

### 3. Icon System for Block Types

| Type | Icon | Color |
|------|------|-------|
| Header | Type | Blue |
| Text | FileText | Gray |
| Image | Image | Purple |
| Gallery | Layout | Indigo |
| Testimonial | MessageSquare | Green |
| Stats | BarChart3 | Orange |
| Contact | Users | Cyan |
| Form | Mail | Red |
| Custom | Edit3 | Pink |

### 4. Color Coding System

#### Light Mode
- **Header**: `bg-blue-100 text-blue-800 border-blue-200`
- **Text**: `bg-gray-100 text-gray-800 border-gray-200`
- **Image**: `bg-purple-100 text-purple-800 border-purple-200`
- **Gallery**: `bg-indigo-100 text-indigo-800 border-indigo-200`
- **Testimonial**: `bg-green-100 text-green-800 border-green-200`
- **Stats**: `bg-orange-100 text-orange-800 border-orange-200`
- **Contact**: `bg-cyan-100 text-cyan-800 border-cyan-200`
- **Form**: `bg-red-100 text-red-800 border-red-200`
- **Custom**: `bg-pink-100 text-pink-800 border-pink-200`

#### Dark Mode
All colors use the `-950` background variant with `-200` text for optimal contrast.

### 5. Status Indicators

#### Page Status (top-right corner)
- **Green dot**: Published content
- **Blue dot**: Draft content blocks
- **No dot**: Empty page

#### Interactive States
- **Selected**: Ring outline with primary color
- **Hover**: Subtle shadow and border highlight
- **Focus**: Accessibility-compliant focus ring

## Interaction Patterns

### 1. Expand/Collapse
- **Trigger**: Click chevron button or node header
- **Animation**: 300ms cubic-bezier ease with width/height transition
- **Icon**: ChevronRight → ChevronDown

### 2. Content Editing
- **Trigger**: Click edit button (appears on block hover)
- **Visual feedback**: Button opacity transition
- **Action**: Callback to parent component

### 3. Node Selection
- **Trigger**: Click anywhere on node
- **Visual feedback**: Ring outline
- **Action**: Fires onPageSelect callback

## Animations and Transitions

### CSS Animations
**File**: `sitemap.css`

- **Node expansion**: 300ms cubic-bezier transition
- **Block hover**: 200ms ease-in-out with subtle lift
- **Status indicators**: 2s pulse animation
- **Smooth scrollbars**: Custom webkit scrollbar styling

### Motion Accessibility
- Respects `prefers-reduced-motion` setting
- Disables animations when user prefers reduced motion

## Responsive Design

### Mobile Adaptations (< 768px)
- **Collapsed width**: 140px (reduced from 180px)
- **Expanded width**: 280px (reduced from 320px)
- **Touch-friendly**: Larger tap targets
- **Compact spacing**: Reduced padding and margins

### High Contrast Support
- Increased border widths for better visibility
- Enhanced color contrast ratios
- Focus indicators remain visible

## Accessibility Features

### Keyboard Navigation
- **Tab order**: Logical flow through expandable elements
- **Enter/Space**: Trigger expand/collapse
- **Focus indicators**: Clear visual focus states

### Screen Reader Support
- **ARIA labels**: Descriptive labels for all interactive elements
- **Role attributes**: Proper semantic markup
- **State announcements**: Expanded/collapsed state changes

### Color Accessibility
- **WCAG AA compliant**: All color combinations meet 4.5:1 contrast ratio
- **Color blindness**: Icons supplement color coding
- **High contrast mode**: Enhanced borders and outlines

## Performance Considerations

### Optimization Strategies
- **Virtual scrolling**: For large numbers of content blocks
- **Memoization**: React.memo for node components
- **Lazy expansion**: Content blocks load on expand
- **Efficient re-renders**: Minimal prop changes

### CSS Performance
- **GPU acceleration**: Transform-based animations
- **Containment**: CSS contain property for isolated reflows
- **Critical CSS**: Inline essential styles

## Usage Examples

### Basic Implementation
```tsx
import { SitemapNode } from '@/components/sitemap/sitemap-node'
import { ContentBlock } from '@/components/sitemap/content-block'

const pageData = {
  page: {
    id: 'home',
    title: 'Home',
    slug: 'home',
    contentType: 'page',
    priority: 'high'
  },
  hasContent: true,
  childCount: 2,
  contentBlocks: [
    {
      id: '1',
      type: 'header',
      title: 'Welcome Header',
      content: 'Welcome to our amazing website...'
    },
    {
      id: '2', 
      type: 'text',
      title: 'About Us',
      content: 'We are a leading company in...'
    }
  ],
  isExpanded: false
}
```

### Integration with React Flow
```tsx
const nodeTypes = {
  default: SitemapNode,
  input: SitemapNode,
  output: SitemapNode,
}

<ReactFlow 
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  // ... other props
/>
```

## Future Enhancements

### Planned Features
1. **Drag & Drop**: Reorder content blocks within nodes
2. **Inline Editing**: Edit block titles directly in the node
3. **Block Templates**: Pre-defined block configurations
4. **Export Options**: Save sitemap as image or PDF
5. **Collaboration**: Real-time multi-user editing indicators

### Technical Improvements
1. **Virtual Scrolling**: Handle thousands of nodes efficiently
2. **Progressive Loading**: Load node content on demand
3. **Caching**: Intelligent caching of node states
4. **Search**: Full-text search across node content

## Browser Support

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 88+
- **Accessibility tools**: NVDA, JAWS, VoiceOver compatible

## File Structure

```
components/sitemap/
├── sitemap-node.tsx          # Main expandable node component
├── content-block.tsx         # Content block components
├── visual-sitemap.tsx        # React Flow integration
├── sitemap.css              # Enhanced animations and styles
├── sitemap-utils.ts         # Utility functions
└── DESIGN_SYSTEM.md         # This documentation
```