'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Project {
  id: string
  title: string
  description: string
  imagePath?: string
  projectLink?: string
  techStack: string[]
  isFeatured: boolean
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    console.log('handleSubmit called with formData:', Array.from(formData.entries()));

    setIsSubmitting(true);

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      console.log('Making fetch request:', { url, method, isCreate: !editingProject });

      const response = await fetch(url, {
        method,
        body: formData,
      })

      console.log('Response received:', { status: response.status, ok: response.ok, url, method });

      if (response.ok) {
        console.log('Response OK, refreshing projects...');
        await fetchProjects()
        setDialogOpen(false)
        setEditingProject(null)
        toast.success('Project berhasil dibuat!')
        console.log('Project saved successfully');
      } else {
        const errorText = await response.text();
        console.error('Response not OK:', { status: response.status, errorText });
        toast.error(`Terjadi kesalahan: ${errorText || 'Silakan coba lagi.'}`)
      }
    } catch (error) {
      console.error('Failed to save project:', error)
      toast.error('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProjects()
        toast.success('Project deleted successfully.')
      } else {
        toast.error('Failed to delete project.')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project.')
    }
  }

  const handleCreate = () => {
    console.log('Create button clicked', new Date().toISOString());
    setEditingProject(null)
    setDialogOpen(true)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleCreate} type="button" disabled={isSubmitting}>
          <Plus className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Creating...' : 'Add Project'}
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm
              initialData={editingProject || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-4">
            {project.imagePath && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image
                  src={`/uploads/${project.imagePath}`}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {project.isFeatured && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}