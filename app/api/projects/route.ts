import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CSVRow } from '@/types'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { pages: true }
        }
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, pages } = body

    if (!name || !pages || !Array.isArray(pages)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        pages: {
          create: pages.map((page: CSVRow) => ({
            title: page.title,
            slug: page.slug,
            menu: page.menu || null,
            submenu: page.submenu || null,
            metaDescription: page.meta_description || null,
            keywords: page.keywords || null,
            contentType: page.content_type || 'page',
            priority: page.priority || 'medium',
            content: page.content || null
          }))
        }
      },
      include: {
        pages: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}