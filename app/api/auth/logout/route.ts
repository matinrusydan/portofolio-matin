import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { withCors } from '@/lib/cors'

export const POST = withCors(async (request: NextRequest) => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})