import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/admin/StatsCard'
import { FolderOpen, Award, Mail, MailWarning } from 'lucide-react'

async function getStats() {
  try {
    const [projectCount, certificateCount, messageCount, unreadMessages] = await Promise.all([
      prisma.project.count(),
      prisma.certificate.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'PENDING' } })
    ])

    return {
      projects: projectCount,
      certificates: certificateCount,
      messages: messageCount,
      unreadMessages
    }
  } catch (error) {
    console.error('Database connection error:', error)
    // Return default values when database is not available
    return {
      projects: 0,
      certificates: 0,
      messages: 0,
      unreadMessages: 0,
      error: 'Database connection failed'
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your portfolio admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={stats.projects}
          icon={FolderOpen}
          trend="+12%"
        />
        <StatsCard
          title="Certificates"
          value={stats.certificates}
          icon={Award}
          trend="+8%"
        />
        <StatsCard
          title="Messages"
          value={stats.messages}
          icon={Mail}
          trend="+24%"
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={MailWarning}
          trend={stats.unreadMessages > 0 ? "Needs attention" : "All caught up"}
        />
      </div>
    </div>
  )
}