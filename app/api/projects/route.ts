import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'
import { saveFile } from '@/lib/file-storage' // Aligned with Certificate API imports

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const featured = searchParams.get('featured')

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { techStack: { hasSome: [search] } }
      ]
    }

    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { orderIndex: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('GET projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Parse form data - aligned with Certificate API pattern
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      techStack: JSON.parse(formData.get('techStack') as string || '[]'),
      projectLink: formData.get('projectLink') as string || undefined,
      isFeatured: formData.get('isFeatured') === 'true',
      orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
    }

    // Validate data - aligned with Certificate API pattern
    projectSchema.parse(data)

    // Handle image upload using local storage - aligned with Certificate API pattern
    let imagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      imagePath = await saveFile(imageFile, 'project')
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        imagePath,
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('POST project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}