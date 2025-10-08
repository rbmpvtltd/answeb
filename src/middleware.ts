// middleware.ts
import { redirect } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password'
];

// Protected routes
const protectedRoutes = [
    '/',
  '/profile',
  '/post',
  '/reels',
  '/explore',
  '/search'
];

export default function middleware(req: NextRequest) {
  // const token = localStorage.get('authToken');
  const token = req.cookies.get("authToken")?.value;

  const { pathname } = req.nextUrl;
 console.log('🔐 Token:', token);  

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // heck if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );


  // if (!token && isProtectedRoute) {
  //   const loginUrl = new URL("/auth/login", req.url);
  //   loginUrl.searchParams.set("redirect", pathname); // optional: to remember page
  //   return NextResponse.redirect(loginUrl);
  // }

  //  ager token nhi to redirect login page
if (!token && isProtectedRoute) {
  return NextResponse.redirect(new URL('/auth/login', req.url));
}

if (token && isPublicRoute) {
  return NextResponse.redirect(new URL('/explore', req.url));
}

  return NextResponse.next();
}

//  Matcher - specify which paths middleware should run on
export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/post/:path*', 
    '/reels/:path*',
    '/explore/:path*',
    '/search/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password'
  ]
};
