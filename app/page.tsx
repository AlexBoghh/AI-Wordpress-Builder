"use client"

import { useState, useEffect } from 'react'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/container'
import { Heading, Text } from '@/components/ui/typography'
import { Stack, HStack, VStack } from '@/components/ui/stack'
import { FileText, Layout, Download, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Home() {
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDataLoaded = async (data: Record<string, string>[]) => {
    setError(null)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Project ${new Date().toLocaleDateString()}`,
          pages: data
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const project = await response.json()
      window.location.href = `/projects/${project.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-20">
          <Container padding="sm">
            <HStack justify="between" className="py-4">
              <div className="flex items-center gap-2">
                <Layout className="h-3 w-3 text-primary" />
                <span className="font-semibold">Website Builder</span>
              </div>
              <nav aria-label="Main navigation">
                <HStack gap={2}>
                  <Link href="/projects">
                    <Button variant="ghost" size="sm">
                      My Projects
                    </Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="ghost" size="sm">
                      Templates
                    </Button>
                  </Link>
                </HStack>
              </nav>
            </HStack>
          </Container>
        </header>

        <main id="main-content">
          {/* Hero Section */}
          <Section spacing="xl" containerSize="md">
            <VStack gap={6} align="center" className="text-center">
              <VStack gap={4}>
                <Heading as="h2" level="h1">
                  Plan, Structure, and Generate Your Website Content
                </Heading>
                <Text size="lg" color="muted" className="max-w-3xl">
                  Use our visual builder to create your website structure or upload a CSV file. 
                  Let AI generate professional content for each page and export to WordPress when ready.
                </Text>
              </VStack>
              
              <HStack gap={3} wrap="wrap" justify="center">
                <Link href="/builder">
                  <Button size="lg" className="group">
                    <Layout className="h-3 w-3 mr-2" />
                    Visual Site Builder
                    <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/builder?tab=import">
                  <Button size="lg" variant="outline">
                    <FileText className="h-3 w-3 mr-2" />
                    Upload CSV
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </Section>

          {/* Upload Section */}
          <Section spacing="md" containerSize="sm">
            <VStack gap={4}>
              <FileUpload 
                onDataLoaded={handleDataLoaded}
                onError={handleError}
              />
              
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg" role="alert">
                  <Text size="sm" color="destructive">{error}</Text>
                </div>
              )}
            </VStack>
          </Section>

          {/* Features */}
          <Section spacing="xl" className="border-t">
            <VStack gap={12} align="center">
              <Heading as="h3" level="h3" className="text-center">
                How It Works
              </Heading>
              
              <div className="grid md:grid-cols-3 gap-8 w-full">
                {[
                  {
                    icon: FileText,
                    title: '1. Upload CSV',
                    description: 'Upload a CSV file with your website structure including pages, menus, and SEO data'
                  },
                  {
                    icon: Sparkles,
                    title: '2. Generate Content',
                    description: 'AI generates unique, SEO-optimized content for each page based on your specifications'
                  },
                  {
                    icon: Download,
                    title: '3. Export to WordPress',
                    description: 'Download a WordPress-ready XML file with all your pages and content ready to import'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <VStack key={index} gap={3} align="center" className="text-center">
                      <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center">
                        <Icon className="h-3 w-3 text-primary" aria-hidden="true" />
                      </div>
                      <Heading as="h4" level="h6" weight="semibold">{feature.title}</Heading>
                      <Text size="sm" color="muted">
                        {feature.description}
                      </Text>
                    </VStack>
                  )
                })}
              </div>
            </VStack>
          </Section>

          {/* Templates Preview */}
          <Section spacing="xl" className="bg-muted/30">
            <VStack gap={12} align="center">
              <VStack gap={4} align="center" className="text-center">
                <Heading as="h3" level="h3">
                  Start with a Template
                </Heading>
                <Text color="muted">
                  Choose from our pre-built industry templates to get started quickly
                </Text>
              </VStack>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[
                  { title: 'Web Agency', description: 'Portfolio, services, team' },
                  { title: 'Restaurant', description: 'Menu, locations, reservations' },
                  { title: 'E-commerce', description: 'Shop, categories, checkout' },
                  { title: 'Professional Services', description: 'Services, about, contact' }
                ].map((template, index) => (
                  <Link key={index} href="/templates" className="group">
                    <div className="border rounded-lg p-5 bg-background hover:shadow-md transition-all cursor-pointer h-full">
                      <VStack gap={2} align="start">
                        <Heading as="h4" level="h6" weight="semibold" className="group-hover:text-primary transition-colors">
                          {template.title}
                        </Heading>
                        <Text size="sm" color="muted">
                          {template.description}
                        </Text>
                      </VStack>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link href="/templates">
                <Button>
                  View All Templates
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
            </VStack>
          </Section>
        </main>
      </div>
    </>
  )
}