import { AdminLayout } from '@/components/admin/AdminLayout'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}