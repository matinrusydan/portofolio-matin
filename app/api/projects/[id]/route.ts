import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveFile, deleteFile } from '@/lib/file-storage'

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

    // Handle image upload using local storage
    let newImagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      // Upload new image first
      newImagePath = await saveFile(imageFile, 'project')
      console.log('New image uploaded:', newImagePath)
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(newImagePath && { imagePath: newImagePath }),
        updatedAt: new Date()
      }
    })

    // Delete old image only after successful update
    if (newImagePath) {
      const oldProject = await prisma.project.findUnique({
        where: { id },
        select: { imagePath: true }
      })
      if (oldProject?.imagePath && oldProject.imagePath !== newImagePath) {
        await deleteFile(oldProject.imagePath)
        console.log('Old image deleted:', oldProject.imagePath)
      }
    }

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
    // Delete image from storage
    const project = await prisma.project.findUnique({
      where: { id },
      select: { imagePath: true }
    })

    if (project?.imagePath) {
      await deleteFile(project.imagePath)
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