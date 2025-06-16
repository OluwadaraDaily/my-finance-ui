import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/auth/login' || path === '/auth/register'
  
  const accessToken = request.cookies.get('access_token')?.value || ''

  // Always allow access to public paths
  if (isPublicPath) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!accessToken) {
    const url = new URL('/auth/login', request.url)
    if (!isPublicPath) {
      url.searchParams.set('from', path)
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
  ],
} 