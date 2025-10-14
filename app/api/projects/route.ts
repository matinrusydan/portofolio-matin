import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'

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
  console.log('[API] POST /api/projects called', new Date().toISOString());

  try {
    const formData = await request.formData()
    console.log('[API] FormData received:', Array.from(formData.entries()).map(([k, v]) => [k, typeof v === 'string' ? v : `File: ${v.name}`]));

    const rawTechStack = formData.get('techStack') as string;
    console.log('[API] Raw techStack value:', rawTechStack);

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      techStack: JSON.parse(rawTechStack || '[]'),
      projectLink: formData.get('projectLink') as string || undefined,
      isFeatured: formData.get('isFeatured') === 'true',
      orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
    }

    console.log('[API] Parsed data:', data);

    // Validate data
    projectSchema.parse(data)
    console.log('[API] Validation passed');

    // Handle image upload - TODO: Implement file storage solution (e.g., local storage, cloud storage)
    let imagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      console.log('[API] Image file received:', imageFile.name, imageFile.size);
      // For now, we'll store the filename but implement actual storage later
      const fileName = `project-${Date.now()}.${imageFile.name.split('.').pop()}`
      // TODO: Upload file to storage service
      imagePath = fileName
    }

    console.log('[API] Creating project in database...');
    const project = await prisma.project.create({
      data: {
        ...data,
        imagePath,
      }
    })

    console.log('[API] Project created successfully:', project.id);
    return NextResponse.json(project)
  } catch (error) {
    console.error('[API] POST project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}