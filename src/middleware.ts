// export { default } from "next-auth/middleware";
//
//
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const isLoggedIn = Boolean(req.cookies.get("next-auth.session-token"));
//   const url = req.nextUrl;
//   const { pathname } = url;
//
//   if (pathname.startsWith(`/api/`)) {
//     //I figured that 'none' means the user pasted the url
//     if (req.headers.get("sec-fetch-site") == "none") {
//       return NextResponse.error();
//     }
//   }
//
//   if (!isLoggedIn && req.url == "http://localhost:3000/profile") {
//     return NextResponse.redirect(process.env.NEXTAUTH_URL as string);
//   }
//
//   return NextResponse.next();
// }
//
// export const config = { matcher: ["/my-habits", "/habit/:path*"] };
//

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get("next-auth.session-token");

  if (!jwt && !request.nextUrl.pathname.includes("/auth"))
    return NextResponse.redirect(new URL("/auth/login", request.url));

  // this condition avoid to show the login page if the user is logged in
  if (jwt && request.nextUrl.pathname.includes("/auth")) {
    return NextResponse.redirect(new URL("/my-habits", request.url));
  }

  return NextResponse.next();
  // if (jwt) {
  //   if (request.nextUrl.pathname.includes("/login")) {
  //     try {
  //       // await jwtVerify(jwt, new TextEncoder().encode("secret"));
  //       return NextResponse.redirect(new URL("/dashboard", request.url));
  //     } catch (error) {
  //       return NextResponse.next();
  //     }
  //   }
  // }

  // try {
  //   const { payload } = await jwtVerify(
  //     jwt.value,
  //     new TextEncoder().encode("secret")
  //   );
  //   return NextResponse.next();
  // } catch (error) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
}

export const config = {
  matcher: ["/my-habits", "/habit/:path*", "/auth/:path*"],
};
