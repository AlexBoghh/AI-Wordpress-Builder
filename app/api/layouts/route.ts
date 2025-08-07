import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/layouts - Get all layouts for a project
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const layouts = await prisma.layout.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' }
    })

    // Parse JSON fields
    const parsedLayouts = layouts.map(layout => ({
      ...layout,
      sections: JSON.parse(layout.sections as string),
      settings: JSON.parse(layout.settings as string)
    }))

    return NextResponse.json(parsedLayouts)
  } catch (error) {
    console.error('Error fetching layouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layouts' },
      { status: 500 }
    )
  }
}

// POST /api/layouts - Create a new layout
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, sections, settings, projectId } = body

    if (!name || !projectId) {
      return NextResponse.json(
        { error: 'Name and project ID are required' },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const layout = await prisma.layout.create({
      data: {
        name,
        description,
        sections: JSON.stringify(sections || []),
        settings: JSON.stringify(settings || {}),
        projectId
      }
    })

    // Return parsed layout
    const parsedLayout = {
      ...layout,
      sections: JSON.parse(layout.sections as string),
      settings: JSON.parse(layout.settings as string)
    }

    return NextResponse.json(parsedLayout, { status: 201 })
  } catch (error) {
    console.error('Error creating layout:', error)
    return NextResponse.json(
      { error: 'Failed to create layout' },
      { status: 500 }
    )
  }
}