import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher(["/dashboard(.*)", "/api/me", "/api/stripe(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtected(req)) return;

  const { userId } = await auth();
  if (userId) return;

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const login = new URL("/login", req.url);
  login.searchParams.set("redirect_url", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(login);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)",
    "/(api|trpc)(.*)",
  ],
};
