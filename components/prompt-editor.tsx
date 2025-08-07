"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Settings, RotateCcw } from 'lucide-react'

export interface ContentPrompts {
  page: string
  post: string
  product: string
  portfolio: string
}

const DEFAULT_PROMPTS: ContentPrompts = {
  page: `Generate professional stone fabrication website content for a page titled "{title}".

Business Context: Quartz & Granite Solutions is a premium stone fabrication company in Tampa, FL with over 20 years of experience. We serve homeowners, contractors, and commercial clients with custom quartz, granite, porcelain, and quartzite installations.

Page Details:
- Meta Description: {metaDescription}
- Target Keywords: {keywords}
- Content Type: page
- Business Focus: {businessType}

Brand Voice Guidelines:
- Professional but approachable (not overly formal)
- Confident and knowledgeable
- Focus on craftsmanship and quality
- Emphasize "premium solutions" not just "installation"
- Use industry terminology naturally (templating, fabrication, miters, waterfall edges)

Content Requirements:
1. Write engaging, SEO-optimized content that speaks to both homeowners and contractors
2. Structure with clear sections using headings (## for h2, ### for h3)
3. Include 3-5 sections highlighting our expertise and unique capabilities
4. Mention our Tampa Bay service area and 20+ years experience
5. Include specific stone fabrication processes (precision templating, CNC cutting, water jet technology)
6. Highlight premium features: waterfall edges, miters, integrated sinks, backlighting options
7. Keep paragraphs concise and scannable for busy contractors and homeowners
8. Include at least one bulleted list of services, benefits, or process steps
9. Write in our brand voice: "We don't just install countertops—we deliver premium solutions"
10. End with dual call-to-action: "Request Consultation" (homeowners) or "Request Quote" (contractors)
11. Aim for 400-600 words
12. Include contact information: (813) 226-2742, Tampa showroom location

Industry-Specific Elements to Include:
- Natural vs. engineered stone education (granite is "God-made", quartz is "man-made")
- Our proven 8-step process from consultation to installation
- Certifications: National Kitchen & Bath Association, Marble Institute of America, Cambria Premier Partner
- Unique capabilities: integrated sinks ($2,500), custom water jet cutting, backlighting systems
- Installation timeline: 1-3 weeks from approval to completion`,

  post: `Generate expert content about stone fabrication for Quartz & Granite Solutions blog post titled "{title}".

Meta Description: {metaDescription}
Keywords: {keywords}
Business Type: {businessType}

Business Context: Quartz & Granite Solutions is a premium stone fabrication company in Tampa, FL with over 20 years of experience. We serve homeowners, contractors, and commercial clients with custom quartz, granite, porcelain, and quartzite installations.

Content Structure:
1. Hook readers with industry insights or trends
2. Educational content about stone fabrication
3. Best practices and expert tips
4. Our approach and expertise
5. Real-world examples from Tampa Bay projects
6. Practical advice for homeowners/contractors
7. Call-to-action for consultation

Brand Voice Guidelines:
- Expert and authoritative but approachable
- Share industry knowledge generously
- Focus on educating readers
- Emphasize craftsmanship and quality
- Use industry terminology to establish expertise

Content Requirements:
1. Write engaging, educational content
2. Include industry insights and trends
3. Share practical tips and advice
4. Highlight our expertise without being salesy
5. Reference our 20+ years experience
6. Include Tampa Bay area context
7. Aim for 600-800 words
8. Include at least one bulleted list
9. End with helpful next steps

Include industry terminology: templating, fabrication, CNC cutting, water jet, miters, waterfall edges.
Mention our showroom at 5434 West Crenshaw St, Tampa, FL 33634.`,

  product: `Generate expert content about {title} for Quartz & Granite Solutions.

Page Title: {title}
Meta Description: {metaDescription}
Keywords: {keywords}
Business Type: {businessType}

Material-Specific Guidelines:

For GRANITE:
- Emphasize natural beauty, unique patterns, heat resistance
- Mention "God-made" natural stone with geological history
- Highlight durability and long-term value
- Include maintenance requirements and sealing needs

For QUARTZ:
- Focus on engineered consistency, non-porous benefits
- Mention Cambria Premier Partner status
- Highlight stain resistance and low maintenance
- Compare to natural stone advantages

For PORCELAIN:
- Emphasize ultra-thin capabilities, heat resistance
- Mention versatility for counters, walls, and outdoor use
- Address misconceptions about durability
- Highlight modern aesthetic appeal

For QUARTZITE:
- Explain as natural stone harder than granite
- Highlight unique veining and patterns
- Position between granite and quartz benefits

Content Structure:
1. Material overview and key characteristics
2. Best applications and use cases
3. Advantages and unique properties
4. Our fabrication process for this material
5. Why choose us for this material
6. Tampa Bay project examples
7. Care and maintenance guidance
8. Call-to-action for consultation

Include industry terminology: templating, fabrication, CNC cutting, water jet, miters, waterfall edges.
Mention our showroom at 5434 West Crenshaw St, Tampa, FL 33634.`,

  portfolio: `Generate detailed process content for "{title}" at Quartz & Granite Solutions.

Context: We have a proven 8-step process refined over 20+ years of stone fabrication experience in Tampa Bay.

Our Actual Process:
1. Initial consultation and vision discussion
2. Project quote within budget parameters
3. Guided material selection at supplier (within 5 miles of our facility)
4. Precision laser templating in 3D space
5. Computer-aided layout design with vein matching
6. Final quote and customer approval/verification
7. Expert fabrication using state-of-the-art CNC and water jet
8. Professional installation (typically 1 day, 1-3 weeks from approval)

Content Requirements:
1. Explain our process clearly for both homeowners and contractors
2. Emphasize precision, accuracy, and attention to detail
3. Highlight our advanced technology: laser templating, CNC machines, water jet cutting
4. Explain why we quote first before material selection (budget protection)
5. Detail our computer-aided layout program for vein matching
6. Mention our quality control: installers verify work before leaving shop
7. Emphasize clean, professional installation with minimal disruption
8. Include our emergency response: "all-stop" protocol if issues arise
9. Highlight installer expertise: our team, not subcontractors
10. Timeline clarity: 1-3 weeks from final approval to installation

Industry Details to Include:
- Templating technology and accuracy
- Supplier relationships (7-8 suppliers within 5 miles)
- Slab selection and budgeting process
- Vein matching and layout optimization
- CNC fabrication and water jet precision
- Installation best practices and cleanup
- Quality assurance and final inspection

Tone: Professional expertise with reassurance about our proven process.
Target: Both first-time homeowners and experienced contractors.`
}

interface PromptEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompts: ContentPrompts
  onSave: (prompts: ContentPrompts) => void
}

export function PromptEditor({ open, onOpenChange, prompts, onSave }: PromptEditorProps) {
  const [editedPrompts, setEditedPrompts] = useState<ContentPrompts>(prompts)
  const [activeTab, setActiveTab] = useState<keyof ContentPrompts>('page')

  useEffect(() => {
    setEditedPrompts(prompts)
  }, [prompts])

  const handleSave = () => {
    onSave(editedPrompts)
    onOpenChange(false)
  }

  const handleReset = (type: keyof ContentPrompts) => {
    setEditedPrompts({
      ...editedPrompts,
      [type]: DEFAULT_PROMPTS[type]
    })
  }

  const handleResetAll = () => {
    setEditedPrompts(DEFAULT_PROMPTS)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Customize AI Content Prompts
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Personalize how AI generates content for different page types. Use placeholders: {'{title}'}, {'{metaDescription}'}, {'{keywords}'}, {'{businessType}'}
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden px-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as keyof ContentPrompts)} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="page">Standard Page</TabsTrigger>
              <TabsTrigger value="post">Blog Post</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto">
              {(['page', 'post', 'product', 'portfolio'] as const).map((type) => (
                <TabsContent key={type} value={type} className="mt-0 h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Prompt Template</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReset(type)}
                        className="h-8 text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset to Default
                      </Button>
                    </div>
                    <Textarea
                      value={editedPrompts[type]}
                      onChange={(e) => setEditedPrompts({
                        ...editedPrompts,
                        [type]: e.target.value
                      })}
                      className="min-h-[400px] font-mono text-sm"
                      placeholder="Enter your custom prompt template..."
                    />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Available placeholders:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li><code className="bg-muted px-1 rounded">{'{title}'}</code> - Page title</li>
                        <li><code className="bg-muted px-1 rounded">{'{metaDescription}'}</code> - Meta description (if provided)</li>
                        <li><code className="bg-muted px-1 rounded">{'{keywords}'}</code> - SEO keywords (if provided)</li>
                        <li><code className="bg-muted px-1 rounded">{'{businessType}'}</code> - Business type from theme</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 bg-muted/50 border-t shrink-0">
          <Button
            variant="ghost"
            onClick={handleResetAll}
            className="mr-auto h-9"
          >
            Reset All
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="h-9"
          >
            Save Prompts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PromptSettingsButton({ prompts, onPromptsChange }: { 
  prompts: ContentPrompts
  onPromptsChange: (prompts: ContentPrompts) => void 
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9"
      >
        <Settings className="h-3 w-3 mr-1.5" />
        AI Prompts
      </Button>
      <PromptEditor
        open={open}
        onOpenChange={setOpen}
        prompts={prompts}
        onSave={onPromptsChange}
      />
    </>
  )
}