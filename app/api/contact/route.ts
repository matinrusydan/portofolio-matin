import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactMessageSchema } from '@/lib/validations'
import { handleCORS } from '@/lib/cors'

export async function GET(request: NextRequest) {
  const corsHeaders = handleCORS(request)
  if (corsHeaders instanceof NextResponse) return corsHeaders
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search') || ''

    const where: any = {}

    if (status) {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where })
    ])

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('GET contact messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: NextRequest) {
  const corsHeaders = handleCORS(request)
  if (corsHeaders instanceof NextResponse) return corsHeaders

  try {
    const body = await request.json()
    const data = contactMessageSchema.parse(body)

    // Get client IP (if available)
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'

    const message = await prisma.contactMessage.create({
      data: {
        ...data,
        ipAddress,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    })

    return NextResponse.json(message, { headers: corsHeaders })
  } catch (error) {
    console.error('POST contact message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500, headers: corsHeaders })
  }
}