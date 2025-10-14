import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: params.id }
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('GET contact message error:', error)
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!['PENDING', 'READ', 'REPLIED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === 'REPLIED') {
      updateData.repliedAt = new Date()
    }

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('PUT contact message error:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contactMessage.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE contact message error:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}