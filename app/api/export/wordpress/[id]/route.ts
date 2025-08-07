import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateWordPressXML } from '@/lib/wordpress-export'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
      include: { pages: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const xmlContent = generateWordPressXML({
      name: project.name,
      pages: project.pages
    })

    return new NextResponse(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="${project.name.toLowerCase().replace(/\s+/g, '-')}-wordpress.xml"`
      }
    })
  } catch (error) {
    console.error('Error exporting to WordPress:', error)
    return NextResponse.json(
      { error: 'Failed to export project' },
      { status: 500 }
    )
  }
}