import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { certificateSchema } from '@/lib/validations'
import { saveFile, deleteFile } from '@/lib/file-storage'
import { handleCORS } from '@/lib/cors'

export async function GET(request: NextRequest) {
  const corsHeaders = handleCORS(request)
  if (corsHeaders instanceof NextResponse) return corsHeaders
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

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

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        orderBy: { orderIndex: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.certificate.count({ where })
    ])

    return NextResponse.json({
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('GET certificates error:', error)
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: NextRequest) {
  const corsHeaders = handleCORS(request)
  if (corsHeaders instanceof NextResponse) return corsHeaders

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

    return NextResponse.json(certificate, { headers: corsHeaders })
  } catch (error) {
    console.error('POST certificate error:', error)
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500, headers: corsHeaders })
  }
}