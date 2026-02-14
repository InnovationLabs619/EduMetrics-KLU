import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Public routes
    if (pathname === '/login' || pathname === '/' || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next()
    }

    const token = request.cookies.get('token')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = await verifyToken(token)

    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin route protection
    if (pathname.startsWith('/admin')) {
        // In a real app, check for admin role in payload
        // For now, assuming anyone with a valid token can access (or implement specific logic)
        // If we have an "role" in payload:
        // if (payload.role !== 'admin') return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/assessment/:path*', '/admin/:path*', '/api/assessment/:path*'],
}
