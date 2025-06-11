import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/auth/login' || path === '/auth/register'
  
  const accessToken = request.cookies.get('access_token')?.value || ''

  if (path.startsWith('/dashboard') && !accessToken) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('from', path)
    return NextResponse.redirect(url)
  }

  // Prevent authenticated users from accessing auth pages
  if (accessToken && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 