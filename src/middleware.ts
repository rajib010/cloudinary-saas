import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/home"]);
const isPublicApiRoutes = createRouteMatcher(["/api/video"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingHome = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  // Redirect users trying to access "/" to "/home"
  if (currentUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If user is logged in and trying to access a public route (except /home), redirect to /home
  if (userId && isPublicRoute(req) && !isAccessingHome) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If user is not logged in
  if (!userId) {
    // Redirect protected routes to sign-in
    if (!isPublicRoute(req) && !isPublicApiRoutes(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Redirect protected API routes to sign-in
    if (isApiRequest && !isPublicApiRoutes(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
