import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/admin') && role === 'PARTNER') {
      return NextResponse.redirect(new URL('/partner', req.url))
    }

    if (pathname.startsWith('/partner') && role !== 'PARTNER') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  },
  {
    secret: process.env.NEXTAUTH_SECRET ?? 'valona-fishing-local-dev-secret',
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/partner/:path*'],
}
