'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from './ImageUpload'
import { certificateSchema, CertificateFormData } from '@/lib/validations'

interface CertificateFormProps {
  initialData?: Partial<CertificateFormData & { id: string; imagePath?: string }>
  onSubmit: (data: FormData) => Promise<void>
  onCancel?: () => void
}

const categories = [
  'Technical',
  'Business',
  'Design',
  'Marketing',
  'Language',
  'Other'
]

export function CertificateForm({ initialData, onSubmit, onCancel }: CertificateFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: initialData?.title || '',
      issuer: initialData?.issuer || '',
      credentialUrl: initialData?.credentialUrl || '',
      issuedAt: initialData?.issuedAt || '',
      category: initialData?.category || '',
      isFeatured: initialData?.isFeatured || false,
      orderIndex: initialData?.orderIndex || 0,
    }
  })

  const handleFormSubmit = async (data: CertificateFormData) => {
    const formData = new FormData()

    if (initialData?.id) {
      formData.append('id', initialData.id)
    }

    formData.append('title', data.title)
    formData.append('issuer', data.issuer)
    formData.append('credentialUrl', data.credentialUrl || '')
    formData.append('issuedAt', data.issuedAt || '')
    formData.append('category', data.category || '')
    formData.append('isFeatured', data.isFeatured.toString())
    formData.append('orderIndex', data.orderIndex.toString())

    if (selectedImage) {
      formData.append('image', selectedImage)
    }

    await onSubmit(formData)
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
                  <FormLabel>Certificate Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced React Patterns" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Frontend Masters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentialUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://verify.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel>Featured Certificate</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <FormLabel>Certificate Image</FormLabel>
              <ImageUpload
                onImageSelect={setSelectedImage}
                currentImage={initialData?.imagePath ?
                  initialData.imagePath
                  : undefined
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialData?.id ? 'Update Certificate' : 'Create Certificate'}
          </Button>
        </div>
      </form>
    </Form>
  )
}