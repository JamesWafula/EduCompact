import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url))
    }

    // Check for write operations (POST, PUT, DELETE) and restrict HEAD role
    if (token?.role === "HEAD" && ["POST", "PUT", "DELETE"].includes(req.method)) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  },
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)", "/api/((?!auth).*)(.+)"],
}
