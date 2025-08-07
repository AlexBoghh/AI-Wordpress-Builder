export interface BrandVoice {
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'conversational' | 'technical'
  industry: string
  targetAudience: string
  companyValues: string[]
  writingStyle: {
    sentenceLength: 'short' | 'medium' | 'long'
    vocabularyLevel: 'simple' | 'moderate' | 'advanced'
    useOfHumor: boolean
    useOfEmojis: boolean
    formality: 'very-formal' | 'formal' | 'neutral' | 'informal' | 'very-informal'
  }
  keyPhrases: string[]
  avoidPhrases: string[]
  exampleContent?: string
}