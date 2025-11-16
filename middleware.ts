import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { routeAccess } from './lib/route'

// Create matchers for role-based access
const roleMatchers = Object.keys(routeAccess).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccess[route]
}))

// Define public routes that don't require authentication
const publicRoutes = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Skip authentication for public routes
  if (publicRoutes(request)) {
    return
  }

  // Authenticate the user for protected routes
  const { userId, sessionClaims } = await auth()
  
  // If no user ID, authentication will handle redirection
  if (!userId) {
    return
  }

  // Get user role from session claims
  const role = (sessionClaims?.metadata as { role?: string })?.role
  
  console.log('User role:', role)

  // Check role-based access for each route pattern
  for (const { matcher, allowedRoles } of roleMatchers) {
    if (matcher(request)) {
      // If route matches and user has a role, check if role is allowed
      if (role && !allowedRoles.includes(role)) {
        // Handle unauthorized access - you might want to redirect or throw an error
        console.error(`User with role ${role} not authorized for route ${request.url}`)
        // You can redirect to unauthorized page or handle as needed
        // return Response.redirect(new URL('/unauthorized', request.url))
      }
      break // Stop checking once a matching route is found
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}