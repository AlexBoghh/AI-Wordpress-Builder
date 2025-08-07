import { ContentBlock } from '@/types/content-blocks'

// Parse WordPress Gutenberg blocks into our content block format
export function parseContentToBlocks(content: string): ContentBlock[] {
  if (!content) return []
  
  const blocks: ContentBlock[] = []
  let blockId = 0
  
  // Regular expressions for parsing Gutenberg blocks
  const blockRegex = /<!-- wp:(\w+)(?:\s+({[^}]*}))? -->([\s\S]*?)<!-- \/wp:\1 -->/g
  const headingRegex = /<h(\d)>(.*?)<\/h\1>/g
  const paragraphRegex = /<p>(.*?)<\/p>/g
  const listItemRegex = /<li>(.*?)<\/li>/g
  
  let match
  let order = 0
  
  // First, try to parse as WordPress blocks
  while ((match = blockRegex.exec(content)) !== null) {
    const [fullMatch, blockType, attributes, blockContent] = match
    
    switch (blockType) {
      case 'heading':
        const headingMatch = /<h(\d)>(.*?)<\/h\1>/.exec(blockContent)
        if (headingMatch) {
          const level = parseInt(headingMatch[1])
          const text = stripHtml(headingMatch[2])
          blocks.push({
            id: `block-${blockId++}`,
            type: 'heading',
            content: text,
            attributes: { level },
            order: order++
          })
        }
        break
        
      case 'paragraph':
        const paragraphText = stripHtml(blockContent.replace(/<\/?p>/g, ''))
        if (paragraphText.trim()) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'paragraph',
            content: paragraphText,
            order: order++
          })
        }
        break
        
      case 'list':
        const listItems: string[] = []
        let listMatch
        while ((listMatch = listItemRegex.exec(blockContent)) !== null) {
          listItems.push(stripHtml(listMatch[1]))
        }
        if (listItems.length > 0) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'list',
            content: listItems.join('\n'),
            attributes: { items: listItems },
            order: order++
          })
        }
        break
        
      case 'quote':
        const quoteText = stripHtml(blockContent.replace(/<\/?blockquote>/g, '').replace(/<\/?p>/g, ''))
        blocks.push({
          id: `block-${blockId++}`,
          type: 'quote',
          content: quoteText,
          order: order++
        })
        break
        
      case 'buttons':
      case 'button':
        const buttonMatch = /<a[^>]*>(.*?)<\/a>/.exec(blockContent)
        if (buttonMatch) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'button',
            content: stripHtml(buttonMatch[1]),
            order: order++
          })
        }
        break
        
      case 'separator':
        blocks.push({
          id: `block-${blockId++}`,
          type: 'separator',
          content: '',
          order: order++
        })
        break
    }
  }
  
  // If no WordPress blocks found, try to parse as plain HTML
  if (blocks.length === 0) {
    // Parse headings
    content.replace(headingRegex, (match, level, text) => {
      blocks.push({
        id: `block-${blockId++}`,
        type: 'heading',
        content: stripHtml(text),
        attributes: { level: parseInt(level) },
        order: order++
      })
      return match
    })
    
    // Parse paragraphs
    content.replace(paragraphRegex, (match, text) => {
      const cleanText = stripHtml(text)
      if (cleanText.trim()) {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          content: cleanText,
          order: order++
        })
      }
      return match
    })
  }
  
  // If still no blocks, treat entire content as one paragraph
  if (blocks.length === 0 && content.trim()) {
    blocks.push({
      id: `block-${blockId++}`,
      type: 'paragraph',
      content: stripHtml(content),
      order: 0
    })
  }
  
  return blocks
}

// Helper function to strip HTML tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

// Get semantic title for content blocks
export function getBlockTitle(block: ContentBlock): string {
  switch (block.type) {
    case 'heading':
      const level = block.attributes?.level || 2
      if (level === 1 || level === 2) {
        // Main headings often represent sections
        const content = block.content.toLowerCase()
        if (content.includes('about')) return 'About Us'
        if (content.includes('service')) return 'Our Services'
        if (content.includes('contact')) return 'Contact'
        if (content.includes('testimonial') || content.includes('client')) return 'What Our Clients Say'
        if (content.includes('welcome')) return 'Welcome Section'
        if (content.includes('hero')) return 'Hero Section'
        return block.content
      }
      return `Heading ${level}`
      
    case 'paragraph':
      // Try to identify the paragraph type based on content
      const text = block.content.toLowerCase()
      if (text.includes('header') && text.includes('section')) return 'Header'
      if (text.includes('hero') && text.includes('section')) return 'Hero Section'
      if (text.includes('testimonial')) return 'Testimonial'
      if (text.includes('impact') && text.includes('dashboard')) return 'Impact Dashboard Preview'
      return 'Text Block'
      
    case 'list':
      return 'List'
      
    case 'quote':
      return 'Quote'
      
    case 'button':
      return 'Call to Action'
      
    case 'separator':
      return 'Divider'
      
    default:
      return 'Content Block'
  }
}

// Group consecutive blocks into logical sections
export function groupBlocksIntoSections(blocks: ContentBlock[]): ContentBlock[] {
  const sections: ContentBlock[] = []
  let currentSection: ContentBlock | null = null
  
  blocks.forEach((block, index) => {
    // If it's a main heading (H1 or H2), start a new section
    if (block.type === 'heading' && block.attributes?.level && block.attributes.level <= 2) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        id: `section-${sections.length}`,
        type: 'section',
        content: block.content,
        attributes: {
          title: getBlockTitle(block),
          blocks: [block]
        },
        order: sections.length
      }
    } else if (currentSection && currentSection.attributes?.blocks) {
      // Add to current section
      currentSection.attributes.blocks.push(block)
    } else {
      // No section yet, add as standalone block
      sections.push(block)
    }
  })
  
  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection)
  }
  
  return sections
}