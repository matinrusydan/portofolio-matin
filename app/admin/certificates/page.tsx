'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CertificateForm } from '@/components/admin/CertificateForm'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface Certificate {
  id: string
  title: string
  issuer: string
  imagePath?: string
  credentialUrl?: string
  issuedAt?: string
  category?: string
  isFeatured: boolean
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      const data = await response.json()
      setCertificates(data.certificates)
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const url = editingCertificate ? `/api/certificates/${editingCertificate.id}` : '/api/certificates'
      const method = editingCertificate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (response.ok) {
        await fetchCertificates()
        setDialogOpen(false)
        setEditingCertificate(null)
      }
    } catch (error) {
      console.error('Failed to save certificate:', error)
    }
  }

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return

    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCertificates()
      }
    } catch (error) {
      console.error('Failed to delete certificate:', error)
    }
  }

  const handleCreate = () => {
    setEditingCertificate(null)
    setDialogOpen(true)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Manage your certificates and achievements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCertificate ? 'Edit Certificate' : 'Create New Certificate'}
              </DialogTitle>
            </DialogHeader>
            <CertificateForm
              initialData={editingCertificate || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="border rounded-lg p-4 space-y-4">
            {certificate.imagePath && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <Image
                  src={certificate.imagePath}
                  alt={certificate.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg">{certificate.title}</h3>
              <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
              {certificate.issuedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {certificate.category && (
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                  {certificate.category}
                </span>
              )}
              {certificate.isFeatured && (
                <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                  Featured
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {certificate.credentialUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(certificate.credentialUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(certificate)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(certificate.id)}
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