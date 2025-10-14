import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id }
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('GET certificate error:', error)
    return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Handle image upload
    let imagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      // Delete old image if exists
      const currentCertificate = await prisma.certificate.findUnique({
        where: { id: params.id },
        select: { imagePath: true }
      })

      if (currentCertificate?.imagePath) {
        await supabase.storage
          .from('certificates')
          .remove([currentCertificate.imagePath])
      }

      // Upload new image
      const fileName = `certificate-${Date.now()}.${imageFile.name.split('.').pop()}`
      const { error } = await supabase.storage
        .from('certificates')
        .upload(fileName, imageFile)

      if (error) throw error
      imagePath = fileName
    }

    const certificate = await prisma.certificate.update({
      where: { id: params.id },
      data: {
        ...data,
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : null,
        ...(imagePath && { imagePath }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('PUT certificate error:', error)
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete image from storage
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id },
      select: { imagePath: true }
    })

    if (certificate?.imagePath) {
      await supabase.storage
        .from('certificates')
        .remove([certificate.imagePath])
    }

    // Delete from database
    await prisma.certificate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE certificate error:', error)
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 })
  }
}