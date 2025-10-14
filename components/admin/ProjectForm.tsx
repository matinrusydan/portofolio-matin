'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ImageUpload } from './ImageUpload'
import { projectSchema, ProjectFormData } from '@/lib/validations'
import { X, Plus } from 'lucide-react'

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData & { id: string; imagePath?: string }>
  onSubmit: (data: FormData) => Promise<void>
  onCancel?: () => void
}

export function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [techInput, setTechInput] = useState('')
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      techStack: initialData?.techStack || [],
      projectLink: initialData?.projectLink || '',
      isFeatured: initialData?.isFeatured || false,
      orderIndex: initialData?.orderIndex || 0,
    }
  })

  const handleFormSubmit = async (data: ProjectFormData) => {
    console.log('handleFormSubmit called with data:', data);
    console.log('Tech stack state:', techStack);

    // Validate tech stack
    if (techStack.length === 0) {
      console.error('Tech stack is empty - validation failed');
      setSubmitError('Please add at least one technology to the tech stack.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData()

      if (initialData?.id) {
        formData.append('id', initialData.id)
      }

      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('techStack', JSON.stringify(techStack))
      formData.append('projectLink', data.projectLink || '')
      formData.append('isFeatured', data.isFeatured.toString())
      formData.append('orderIndex', data.orderIndex.toString())

      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      console.log('FormData prepared:', Array.from(formData.entries()));
      console.log('Calling onSubmit...');
      await onSubmit(formData)
      console.log('onSubmit completed successfully');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan');
      throw error; // Re-throw to let React Hook Form handle it
    } finally {
      setIsSubmitting(false);
    }
  }

  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()])
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTech()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Technologies</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={addTech} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Featured Project</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <FormLabel>Project Image</FormLabel>
              <ImageUpload
                onImageSelect={setSelectedImage}
                currentImage={initialData?.imagePath ?
                  `/uploads/${initialData.imagePath}`
                  : undefined
                }
              />
            </div>
          </div>
        </div>

        {submitError && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {submitError}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Project' : 'Create Project')}
          </Button>
        </div>
      </form>
    </Form>
  )
}