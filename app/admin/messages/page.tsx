'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Mail, Eye, Archive, Trash2, Reply } from 'lucide-react'
import { apiEndpoints } from '@/lib/api'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: 'PENDING' | 'READ' | 'REPLIED' | 'ARCHIVED'
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
  repliedAt?: string
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  READ: 'bg-blue-100 text-blue-800',
  REPLIED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800'
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch(apiEndpoints.contact)
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${apiEndpoints.contact}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to update message:', error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`${apiEndpoints.contact}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setDialogOpen(true)

    // Mark as read if pending
    if (message.status === 'PENDING') {
      updateMessageStatus(message.id, 'READ')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Manage incoming contact messages</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{message.name}</h3>
                  <Badge className={statusColors[message.status]}>
                    {message.status.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                <p className="text-sm line-clamp-2">{message.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewMessage(message)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                {message.status !== 'REPLIED' && (
                  <Select onValueChange={(value) => updateMessageStatus(message.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="READ">Read</SelectItem>
                      <SelectItem value="REPLIED">Replied</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMessage(message.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={statusColors[selectedMessage.status]}>
                    {selectedMessage.status.toLowerCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {selectedMessage.ipAddress && (
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="text-sm text-muted-foreground">{selectedMessage.ipAddress}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}