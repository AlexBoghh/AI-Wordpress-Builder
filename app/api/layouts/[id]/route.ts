import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/layouts/[id] - Get a specific layout
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const layout = await prisma.layout.findUnique({
      where: { id },
      include: { project: true }
    })

    if (!layout) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedLayout = {
      ...layout,
      sections: JSON.parse(layout.sections as string),
      settings: JSON.parse(layout.settings as string)
    }

    return NextResponse.json(parsedLayout)
  } catch (error) {
    console.error('Error fetching layout:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layout' },
      { status: 500 }
    )
  }
}

// PUT /api/layouts/[id] - Update a layout
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, sections, settings } = body

    // Check if layout exists
    const existingLayout = await prisma.layout.findUnique({
      where: { id }
    })

    if (!existingLayout) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      )
    }

    // Update layout
    const updatedLayout = await prisma.layout.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(sections !== undefined && { sections: JSON.stringify(sections) }),
        ...(settings !== undefined && { settings: JSON.stringify(settings) }),
        updatedAt: new Date()
      }
    })

    // Return parsed layout
    const parsedLayout = {
      ...updatedLayout,
      sections: JSON.parse(updatedLayout.sections as string),
      settings: JSON.parse(updatedLayout.settings as string)
    }

    return NextResponse.json(parsedLayout)
  } catch (error) {
    console.error('Error updating layout:', error)
    return NextResponse.json(
      { error: 'Failed to update layout' },
      { status: 500 }
    )
  }
}

// DELETE /api/layouts/[id] - Delete a layout
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if layout exists
    const existingLayout = await prisma.layout.findUnique({
      where: { id }
    })

    if (!existingLayout) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      )
    }

    // Delete layout
    await prisma.layout.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Layout deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting layout:', error)
    return NextResponse.json(
      { error: 'Failed to delete layout' },
      { status: 500 }
    )
  }
}