import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
 
export default async function middleware(req) {
  const path = req.nextUrl.pathname

  if(path == "/"){
    return NextResponse.next()
  }

  const session = (await cookies()).get('session')?.value

  if (!session || session != process.env.SESSION_KEY) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}