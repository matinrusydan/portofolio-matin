import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('GET project error:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      techStack: JSON.parse(formData.get('techStack') as string),
      projectLink: formData.get('projectLink') as string || undefined,
      isFeatured: formData.get('isFeatured') === 'true',
      orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
    }

    // Handle image upload - TODO: Implement file storage solution (e.g., local storage, cloud storage)
    let imagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      // Delete old image if exists - TODO: Implement file deletion
      const currentProject = await prisma.project.findUnique({
        where: { id },
        select: { imagePath: true }
      })

      if (currentProject?.imagePath) {
        // TODO: Delete old file from storage
      }

      // Upload new image - TODO: Implement file upload
      const fileName = `project-${Date.now()}.${imageFile.name.split('.').pop()}`
      // TODO: Upload file to storage service
      imagePath = fileName
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(imagePath && { imagePath }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('PUT project error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Delete image from storage - TODO: Implement file deletion
    const project = await prisma.project.findUnique({
      where: { id },
      select: { imagePath: true }
    })

    if (project?.imagePath) {
      // TODO: Delete file from storage service
    }

    // Delete from database
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}