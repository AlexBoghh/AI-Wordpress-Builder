import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { GenerateContentRequest } from '@/types'
import { BrandVoice } from '@/types/brand-voice'
import { BusinessSettings } from '@/components/business-settings'
import { trackApiUsage, calculateClaudeCost, getOptimalClaudeModel, estimateContentLength, checkUsageWarnings } from '@/lib/api-usage'

// Initialize Anthropic client
const getAnthropicClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Generate Content API Called ===')
    
    const body = await request.json()
    console.log('Request body received:', JSON.stringify(body, null, 2))
    
    const { pageData, brandVoice, customPrompt, businessSettings } = body as GenerateContentRequest & { brandVoice?: BrandVoice, customPrompt?: string, businessSettings?: BusinessSettings }

    console.log('Claude API Key exists:', !!process.env.ANTHROPIC_API_KEY)
    console.log('Page data:', pageData)
    
    if (!pageData || !pageData.title) {
      console.error('Invalid page data:', pageData)
      return NextResponse.json(
        { error: 'Invalid page data: title is required' },
        { status: 400 }
      )
    }

    // Check usage warnings before proceeding (with error handling)
    let usageWarnings = { hasWarnings: false, warnings: [] }
    try {
      usageWarnings = await checkUsageWarnings()
      if (usageWarnings.hasWarnings) {
        console.warn('API Usage Warnings:', usageWarnings.warnings)
      }
    } catch (usageError) {
      console.warn('Failed to check usage warnings:', usageError)
      // Continue without usage warnings
    }

    const anthropic = getAnthropicClient()
    if (!anthropic) {
      return NextResponse.json(
        { error: 'Claude API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    // Optimize model selection based on content complexity
    let contentLength: 'short' | 'medium' | 'long' = 'medium'
    let optimalModel = 'claude-3-5-sonnet-20241022' // Default fallback
    
    try {
      contentLength = estimateContentLength(pageData)
      optimalModel = getOptimalClaudeModel(contentLength)
      console.log(`Using ${optimalModel} for ${contentLength} content`)
    } catch (modelError) {
      console.warn('Failed to optimize model selection, using default:', modelError)
    }

    const prompt = customPrompt ? generateCustomPrompt(pageData, customPrompt, brandVoice) : generatePrompt(pageData, brandVoice)
    
    console.log('Attempting to generate content with Claude, prompt length:', prompt.length)
    
    const result = await anthropic.messages.create({
      model: optimalModel,
      max_tokens: contentLength === 'short' ? 2000 : 4000, // Reduce tokens for shorter content
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
    
    const content = result.content[0].type === 'text' ? result.content[0].text : ''
    
    console.log('Content generated successfully with Claude, length:', content.length)

    // Track API usage
    const inputTokens = result.usage?.input_tokens || 0
    const outputTokens = result.usage?.output_tokens || 0
    const totalTokens = inputTokens + outputTokens
    const estimatedCost = calculateClaudeCost(optimalModel, inputTokens, outputTokens)
    
    console.log(`API Usage - Input: ${inputTokens}, Output: ${outputTokens}, Cost: $${estimatedCost.toFixed(4)}`)
    
    // Track the usage in database (with error handling)
    try {
      await trackApiUsage({
        provider: 'claude',
        model: optimalModel,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost,
        pageTitle: pageData.title,
        projectId: body.projectId
      })
    } catch (trackingError) {
      console.warn('Failed to track API usage:', trackingError)
      // Continue without tracking - don't fail the request
    }

    // Replace business placeholders in the generated content
    const processedContent = businessSettings ? replaceBusinessPlaceholders(content, businessSettings) : content
    
    return NextResponse.json({ 
      content: formatContentAsGutenbergBlocks(processedContent),
      raw: processedContent,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost,
        model: optimalModel
      },
      warnings: usageWarnings.hasWarnings ? usageWarnings.warnings : undefined
    })
  } catch (error: unknown) {
    console.error('Error generating content:', error)
    
    // Check for specific API errors
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      return NextResponse.json(
        { error: 'Invalid or missing Claude API key. Please check your .env.local file.' },
        { status: 401 }
      )
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (errorMessage.includes('credit') || errorMessage.includes('billing')) {
      return NextResponse.json(
        { error: 'Claude API credits exhausted. Please check your Anthropic billing.' },
        { status: 402 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: errorMessage || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

function generatePrompt(pageData: GenerateContentRequest['pageData'], brandVoice?: BrandVoice): string {
  const { title, metaDescription, keywords, contentType, businessType } = pageData

  let prompt = ''
  
  // Customize prompt based on content type
  switch (contentType) {
    case 'post':
      prompt = `Generate an engaging blog post titled "${title}".`
      break
    case 'product':
      prompt = `Generate compelling product description content for "${title}".`
      break
    case 'portfolio':
      prompt = `Generate a portfolio showcase page for "${title}".`
      break
    default:
      prompt = `Generate professional website content for a page titled "${title}".`
  }

  if (metaDescription) {
    prompt += ` The content should focus on: ${metaDescription}.`
  }

  if (keywords) {
    prompt += ` Important keywords to naturally incorporate: ${keywords}.`
  }

  if (businessType) {
    prompt += ` This is for a ${businessType} business.`
  }

  // Add brand voice instructions
  if (brandVoice) {
    prompt += `\n\nBrand Voice Guidelines:`
    prompt += `\n- Tone: ${brandVoice.tone}`
    prompt += `\n- Target Audience: ${brandVoice.targetAudience}`
    prompt += `\n- Industry: ${brandVoice.industry}`
    
    if (brandVoice.companyValues.length > 0) {
      prompt += `\n- Company Values: ${brandVoice.companyValues.join(', ')}`
    }
    
    prompt += `\n- Writing Style:`
    prompt += `\n  - Sentence Length: ${brandVoice.writingStyle.sentenceLength}`
    prompt += `\n  - Vocabulary: ${brandVoice.writingStyle.vocabularyLevel}`
    prompt += `\n  - Formality: ${brandVoice.writingStyle.formality}`
    prompt += `\n  - Use humor: ${brandVoice.writingStyle.useOfHumor ? 'Yes' : 'No'}`
    
    if (brandVoice.keyPhrases.length > 0) {
      prompt += `\n- Key phrases to use: ${brandVoice.keyPhrases.join(', ')}`
    }
    
    if (brandVoice.avoidPhrases.length > 0) {
      prompt += `\n- Phrases to avoid: ${brandVoice.avoidPhrases.join(', ')}`
    }
    
    if (brandVoice.exampleContent) {
      prompt += `\n- Match this writing style example: "${brandVoice.exampleContent.substring(0, 200)}..."`
    }
  }

  // Add content-type specific requirements
  let requirements = '\n\nRequirements:\n'
  
  switch (contentType) {
    case 'post':
      requirements += `1. Write an engaging, informative blog post
2. Include an introduction that hooks the reader
3. Structure with 3-5 main sections using ## headings
4. Include practical tips, insights, or actionable advice
5. Add a conclusion that summarizes key points
6. Write in a conversational, engaging tone
7. Aim for 600-800 words
8. Include at least one bulleted list
9. End with a thought-provoking question or next steps`
      break
      
    case 'product':
      requirements += `1. Create compelling product description content
2. Start with key benefits and value proposition
3. Include sections for: Features, Benefits, Specifications, Why Choose Us
4. Use persuasive language that converts
5. Include a customer testimonial quote (format: "quote text" - Customer Name)
6. Add clear calls-to-action throughout
7. Aim for 400-600 words
8. Use bullet points for features and benefits
9. Consider using a comparison table if relevant
10. End with a strong purchase call-to-action`
      break
      
    case 'portfolio':
      requirements += `1. Showcase the project/work professionally
2. Include sections for: Overview, Challenge, Solution, Results
3. Focus on outcomes and impact
4. Use descriptive language to paint a picture
5. Include technical details where relevant
6. Add a client testimonial quote (format: "quote text" - Client Name, Company)
7. Highlight unique aspects and innovations
8. Aim for 500-700 words
9. Structure content to tell a story
10. End with project outcomes and impact metrics`
      break
      
    default:
      requirements += `1. Write engaging, SEO-optimized content
2. Structure the content with clear sections using headings
3. Include 3-5 sections with descriptive headings (use ## for h2, ### for h3)
4. Keep paragraphs concise and scannable
5. Include a call-to-action section at the end
6. Write in a professional, conversational tone
7. Aim for 400-600 words
8. Include at least one bulleted list
9. End with a clear call-to-action section`
  }
  
  requirements += `
10. Do NOT include h1 tags (the title is already displayed)
11. Start directly with the content, no title needed
12. Use markdown format: ## for headings, - for list items, regular text for paragraphs

Format the response in clean markdown without any code blocks or HTML tags.`

  prompt += requirements

  return prompt
}

function formatContentAsGutenbergBlocks(content: string): string {
  // Clean up any potential code block formatting
  content = content.replace(/```.*?\n?/g, '')
  content = content.replace(/```\n?/g, '')
  
  // Split content into lines
  const lines = content.split('\n')
  const blocks: string[] = []
  let currentList: string[] = []
  let inList = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) continue
    
    // Handle headings
    if (line.startsWith('## ')) {
      // Close any open list
      if (inList && currentList.length > 0) {
        blocks.push(createListBlock(currentList))
        currentList = []
        inList = false
      }
      
      const headingText = line.substring(3).trim()
      blocks.push(createHeadingBlock(headingText, 2))
    }
    else if (line.startsWith('### ')) {
      // Close any open list
      if (inList && currentList.length > 0) {
        blocks.push(createListBlock(currentList))
        currentList = []
        inList = false
      }
      
      const headingText = line.substring(4).trim()
      blocks.push(createHeadingBlock(headingText, 3))
    }
    // Handle list items
    else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      inList = true
      const listItem = line.substring(2).trim()
      currentList.push(listItem)
    }
    // Handle quotes (lines starting with > or containing quotation marks)
    else if (line.startsWith('>') || (line.startsWith('"') && line.endsWith('"'))) {
      // Close any open list
      if (inList && currentList.length > 0) {
        blocks.push(createListBlock(currentList))
        currentList = []
        inList = false
      }
      
      const quoteText = line.replace(/^>/, '').replace(/^"|"$/g, '').trim()
      // Check if next line might be attribution (starts with - or —)
      if (i + 1 < lines.length && (lines[i + 1].startsWith('-') || lines[i + 1].startsWith('—'))) {
        const citation = lines[i + 1].replace(/^[-—]\s*/, '').trim()
        blocks.push(createQuoteBlock(quoteText, citation))
        i++ // Skip the citation line
      } else {
        blocks.push(createQuoteBlock(quoteText))
      }
    }
    // Handle regular paragraphs
    else {
      // Close any open list
      if (inList && currentList.length > 0) {
        blocks.push(createListBlock(currentList))
        currentList = []
        inList = false
      }
      
      // Check if this might be a call-to-action
      const lowerLine = line.toLowerCase()
      if (lowerLine.includes('contact us') || lowerLine.includes('get started') || 
          lowerLine.includes('learn more') || lowerLine.includes('call us') ||
          lowerLine.includes('schedule') || lowerLine.includes('book now')) {
        // Check if it's a standalone CTA that could be a button
        if (line.length < 50 && !line.includes('.')) {
          blocks.push(createButtonBlock(line))
        } else {
          blocks.push(createParagraphBlock(line))
        }
      } else {
        blocks.push(createParagraphBlock(line))
      }
    }
  }
  
  // Close any remaining list
  if (inList && currentList.length > 0) {
    blocks.push(createListBlock(currentList))
  }
  
  // Add a separator before the last section if it looks like a CTA
  if (blocks.length > 3) {
    const lastBlocks = blocks.slice(-3).join('')
    if (lastBlocks.toLowerCase().includes('contact') || 
        lastBlocks.toLowerCase().includes('get started') ||
        lastBlocks.toLowerCase().includes('ready to')) {
      // Find the position to insert separator (before the last heading or 3 blocks from end)
      let insertPos = blocks.length - 3
      for (let i = blocks.length - 1; i >= Math.max(0, blocks.length - 5); i--) {
        if (blocks[i].includes('<!-- wp:heading')) {
          insertPos = i
          break
        }
      }
      blocks.splice(insertPos, 0, createSeparatorBlock())
    }
  }
  
  return blocks.join('\n\n')
}

function createHeadingBlock(text: string, level: number): string {
  return `<!-- wp:heading {"level":${level}} -->
<h${level} class="wp-block-heading">${escapeHtml(text)}</h${level}>
<!-- /wp:heading -->`
}

function createParagraphBlock(text: string): string {
  return `<!-- wp:paragraph -->
<p>${escapeHtml(text)}</p>
<!-- /wp:paragraph -->`
}

function createListBlock(items: string[]): string {
  const listItems = items.map(item => `<li>${escapeHtml(item)}</li>`).join('')
  return `<!-- wp:list -->
<ul class="wp-block-list">${listItems}</ul>
<!-- /wp:list -->`
}

function createButtonBlock(text: string, url: string = '#'): string {
  return `<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="${url}">${escapeHtml(text)}</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`
}

function createSeparatorBlock(): string {
  return `<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->`
}

function createQuoteBlock(text: string, citation?: string): string {
  const cite = citation ? `<cite>${escapeHtml(citation)}</cite>` : ''
  return `<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>${escapeHtml(text)}</p>
${cite}
</blockquote>
<!-- /wp:quote -->`
}

function generateCustomPrompt(pageData: GenerateContentRequest['pageData'], customPrompt: string, brandVoice?: BrandVoice): string {
  const { title, metaDescription, keywords, businessType } = pageData
  
  // Replace placeholders in custom prompt
  let prompt = customPrompt
    .replace(/{title}/g, title)
    .replace(/{metaDescription}/g, metaDescription ? `The content should focus on: ${metaDescription}.` : '')
    .replace(/{keywords}/g, keywords ? `Important keywords to naturally incorporate: ${keywords}.` : '')
    .replace(/{businessType}/g, businessType ? `This is for a ${businessType} business.` : '')
  
  // Add brand voice if provided
  if (brandVoice) {
    prompt += `\n\nBrand Voice Guidelines:`
    prompt += `\n- Tone: ${brandVoice.tone}`
    prompt += `\n- Target Audience: ${brandVoice.targetAudience}`
    prompt += `\n- Industry: ${brandVoice.industry}`
    
    if (brandVoice.companyValues.length > 0) {
      prompt += `\n- Company Values: ${brandVoice.companyValues.join(', ')}`
    }
    
    prompt += `\n- Writing Style:`
    prompt += `\n  - Sentence Length: ${brandVoice.writingStyle.sentenceLength}`
    prompt += `\n  - Vocabulary: ${brandVoice.writingStyle.vocabularyLevel}`
    prompt += `\n  - Formality: ${brandVoice.writingStyle.formality}`
    prompt += `\n  - Use humor: ${brandVoice.writingStyle.useOfHumor ? 'Yes' : 'No'}`
    
    if (brandVoice.keyPhrases.length > 0) {
      prompt += `\n- Key phrases to use: ${brandVoice.keyPhrases.join(', ')}`
    }
    
    if (brandVoice.avoidPhrases.length > 0) {
      prompt += `\n- Phrases to avoid: ${brandVoice.avoidPhrases.join(', ')}`
    }
    
    if (brandVoice.exampleContent) {
      prompt += `\n- Match this writing style example: "${brandVoice.exampleContent.substring(0, 200)}..."`
    }
  }
  
  // Add standard formatting requirements
  prompt += `\n\n10. Do NOT include h1 tags (the title is already displayed)
11. Start directly with the content, no title needed
12. Use markdown format: ## for headings, - for list items, regular text for paragraphs\n\nFormat the response in clean markdown without any code blocks or HTML tags.`
  
  return prompt
}

function escapeHtml(text: string): string {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return text.replace(/[&<>"']/g, match => htmlEntities[match] || match)
}

function replaceBusinessPlaceholders(content: string, settings: BusinessSettings): string {
  let result = content
  
  // Basic information replacements
  result = result.replace(/\[Company Name\]/gi, settings.companyName)
  result = result.replace(/\[Business Name\]/gi, settings.companyName)
  result = result.replace(/\[Company\]/gi, settings.companyName)
  result = result.replace(/\[Tagline\]/gi, settings.tagline)
  result = result.replace(/\[Year Established\]/gi, settings.yearEstablished)
  result = result.replace(/\[Years in Business\]/gi, settings.yearsInBusiness)
  result = result.replace(/\[Experience\]/gi, settings.yearsInBusiness)
  
  // Contact information replacements
  result = result.replace(/\[Phone Number\]/gi, settings.phone)
  result = result.replace(/\[Phone\]/gi, settings.phone)
  result = result.replace(/\[Email Address\]/gi, settings.email)
  result = result.replace(/\[Email\]/gi, settings.email)
  result = result.replace(/\[Address\]/gi, `${settings.address}, ${settings.city}, ${settings.state} ${settings.zipCode}`)
  result = result.replace(/\[Street Address\]/gi, settings.address)
  result = result.replace(/\[City\]/gi, settings.city)
  result = result.replace(/\[State\]/gi, settings.state)
  result = result.replace(/\[Zip Code\]/gi, settings.zipCode)
  result = result.replace(/\[Zip\]/gi, settings.zipCode)
  result = result.replace(/\[Service Area\]/gi, settings.serviceArea)
  result = result.replace(/\[Location\]/gi, `${settings.city}, ${settings.state}`)
  
  // Business hours and online presence
  result = result.replace(/\[Business Hours\]/gi, settings.businessHours)
  result = result.replace(/\[Hours\]/gi, settings.businessHours)
  result = result.replace(/\[Emergency Response\]/gi, settings.emergencyResponse)
  result = result.replace(/\[Website\]/gi, settings.website)
  result = result.replace(/\[Showroom Address\]/gi, settings.showroomAddress)
  result = result.replace(/\[Showroom\]/gi, settings.showroomAddress)
  
  // Lists - Join with commas or "and"
  result = result.replace(/\[Specialties\]/gi, settings.specialties.join(', '))
  result = result.replace(/\[Certifications\]/gi, settings.certifications.join(', '))
  result = result.replace(/\[Brands\]/gi, settings.brands.join(', '))
  result = result.replace(/\[Materials\]/gi, settings.materials.join(', '))
  result = result.replace(/\[Services\]/gi, settings.services.join(', '))
  result = result.replace(/\[Unique Capabilities\]/gi, settings.uniqueCapabilities.join(', '))
  
  // Process steps - Format as numbered list
  result = result.replace(/\[Process Steps\]/gi, settings.processSteps.map((step, i) => `${i + 1}. ${step}`).join('\n'))
  result = result.replace(/\[Process\]/gi, settings.processSteps.map((step, i) => `${i + 1}. ${step}`).join('\n'))
  
  // Timeline and CTAs
  result = result.replace(/\[Installation Timeline\]/gi, settings.installationTimeline)
  result = result.replace(/\[Timeline\]/gi, settings.installationTimeline)
  result = result.replace(/\[Homeowner CTA\]/gi, settings.homeownerCTA)
  result = result.replace(/\[Contractor CTA\]/gi, settings.contractorCTA)
  result = result.replace(/\[CTA\]/gi, settings.homeownerCTA)
  
  // Common variations
  result = result.replace(/\[Contact Information\]/gi, `${settings.phone} | ${settings.email}`)
  result = result.replace(/\[Contact\]/gi, `${settings.phone} | ${settings.email}`)
  result = result.replace(/\[Full Address\]/gi, `${settings.address}, ${settings.city}, ${settings.state} ${settings.zipCode}`)
  
  // Material-specific replacements (for first material in list)
  if (settings.materials.length > 0) {
    result = result.replace(/\[Primary Material\]/gi, settings.materials[0])
  }
  
  // Service-specific replacements (for first service in list)
  if (settings.services.length > 0) {
    result = result.replace(/\[Primary Service\]/gi, settings.services[0])
  }
  
  return result
}