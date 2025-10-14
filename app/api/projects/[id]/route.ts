import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id }
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
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      techStack: JSON.parse(formData.get('techStack') as string),
      projectLink: formData.get('projectLink') as string || undefined,
      isFeatured: formData.get('isFeatured') === 'true',
      orderIndex: parseInt(formData.get('orderIndex') as string) || 0,
    }

    // Handle image upload
    let imagePath = null
    const imageFile = formData.get('image') as File
    if (imageFile) {
      // Delete old image if exists
      const currentProject = await prisma.project.findUnique({
        where: { id: params.id },
        select: { imagePath: true }
      })

      if (currentProject?.imagePath) {
        await supabase.storage
          .from('projects')
          .remove([currentProject.imagePath])
      }

      // Upload new image
      const fileName = `project-${Date.now()}.${imageFile.name.split('.').pop()}`
      const { error } = await supabase.storage
        .from('projects')
        .upload(fileName, imageFile)

      if (error) throw error
      imagePath = fileName
    }

    const project = await prisma.project.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    // Delete image from storage
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { imagePath: true }
    })

    if (project?.imagePath) {
      await supabase.storage
        .from('projects')
        .remove([project.imagePath])
    }

    // Delete from database
    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE project error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}