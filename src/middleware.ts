import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import NextAuth from "next-auth/next"
import { NextResponse } from "next/server"
import { Route } from "react-router-dom"

export default withAuth(async function middleware(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection  
    const isAuth = await getToken({ req })
    const isLoginPage = pathname.startsWith('/login')

    const sensitveRoutes = ['/dashboard']
    const isAccessingSensitveRoute = sensitveRoutes.some((route) => pathname.startsWith(route))

    if (isLoginPage) {
        if (isAuth) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        return NextResponse.next()
    }

    if (!isAuth && isAccessingSensitveRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    }, 
    {

    callbacks: {
        async authorized() {
            return true
        }
            
    }
})

export const config = {
    mmatcher: ['/', '/login', '/dashboard/:path*']
}