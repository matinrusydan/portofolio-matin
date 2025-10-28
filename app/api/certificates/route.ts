import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { certificateSchema } from '@/lib/validations'
import { saveFile, deleteFile } from '@/lib/file-storage'
import { withCors } from '@/lib/cors'

export const GET = withCors(async (request: NextRequest) => {
  try {
    console.log('🔍 GET certificates: Starting request')
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    console.log('🔍 GET certificates: Params - page:', page, 'limit:', limit, 'search:', search, 'category:', category, 'featured:', featured)

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { issuer: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (featured !== null) {
      where.isFeatured = featured === 'true'
    }

    console.log('🔍 GET certificates: Where clause:', JSON.stringify(where))

    console.log('🔍 GET certificates: Attempting database connection and query')
    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        orderBy: { orderIndex: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.certificate.count({ where })
    ])

    console.log('🔍 GET certificates: Query successful - certificates count:', certificates.length, 'total:', total)

    return NextResponse.json({
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('❌ GET certificates error:', error)
    console.error('❌ GET certificates error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : String(error)
    })
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
})

export const POST = withCors(async (request: NextRequest) => {

  try {
    const formData = await request.formData()

    const data = {
      title: formData.get('title') as string,
      issuer: formData.get('issuer') as string,
      credentialUrl: formData.get('credentialUrl') as string || undefined,
      issuedAt: formData.get('issuedAt') as string || undefined,
      category: formData.get('category') as string || undefined,
      isFeatured: formData.get('isFeatured') === 'true',
      orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
    }

    // Validate data
    certificateSchema.parse(data)

    // Handle image upload using local storage
    let imagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      imagePath = await saveFile(imageFile, 'certificate')
    }

    const certificate = await prisma.certificate.create({
      data: {
        ...data,
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : null,
        imagePath,
      }
    })

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('POST certificate error:', error)
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
})