import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  projectLink: z.string().url().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
})

export const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  issuedAt: z.string().optional(),
  category: z.string().optional(),
  isFeatured: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
})

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type CertificateFormData = z.infer<typeof certificateSchema>
export type ContactMessageData = z.infer<typeof contactMessageSchema>