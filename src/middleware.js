import { NextResponse } from "next/server";

export const middleware = (request) => {
  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  const isUserSignin = ["/signin", "/signup"];
  const protectedRoute = ["/mydata"];

  if (isUserSignin.includes(request.nextUrl.pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (protectedRoute.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/signin", "/signup", "/mydata"],
};
