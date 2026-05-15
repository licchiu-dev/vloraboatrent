import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

const PRIMARY_DOMAIN = 'vloraboatrent.com'
const SECRET = process.env.NEXTAUTH_SECRET ?? 'valona-fishing-local-dev-secret'

function isAllowedHost(hostname: string) {
  return (
    hostname === PRIMARY_DOMAIN ||
    hostname === `www.${PRIMARY_DOMAIN}` ||
    hostname === 'localhost' ||
    hostname.endsWith('.vercel.app')
  )
}

export default async function middleware(req: NextRequest) {
  const hostname = (req.headers.get('host') ?? '').split(':')[0]

  if (!isAllowedHost(hostname)) {
    const url = req.nextUrl.clone()
    url.hostname = PRIMARY_DOMAIN
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  const pathname = req.nextUrl.pathname
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/partner')) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: SECRET })

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const role = token.role

  if (pathname.startsWith('/admin') && role === 'PARTNER') {
    return NextResponse.redirect(new URL('/partner', req.url))
  }

  if (pathname.startsWith('/partner') && role !== 'PARTNER') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|images|videos|api).*)'],
}
