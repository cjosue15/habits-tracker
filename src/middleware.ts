// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";
//
// export async function middleware(request: NextRequest) {
//   const jwt = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
//
//   if (!jwt && !request.nextUrl.pathname.includes("/auth"))
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//
//   // verify if the token's expiration date is greater than the current date
//   // if the toeken is expired, call the refresh token endpoint
//
//   // this condition avoid to show the login page if the user is logged in
//   if (jwt && request.nextUrl.pathname.includes("/auth")) {
//     return NextResponse.redirect(new URL("/my-habits", request.url));
//   }
//
//   return NextResponse.next();
// }
//
// export const config = {
//   matcher: ["/my-habits", "/habit/:path*", "/auth/:path*"],
// };

import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { encode, getToken } from "next-auth/jwt";
import { checkIfTokenIsExpired, refreshAccessToken } from "./libs/jwt";

export const config = {
  matcher: ["/my-habits", "/habit/:path*"],
};

const sessionCookie =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

function signOut(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/auth/login", request.url));

  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes("next-auth")) response.cookies.delete(cookie.name);
  });

  return response;
}

function shouldUpdateToken(token: string) {
  return checkIfTokenIsExpired(token);
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) return signOut(request);

  const response = NextResponse.next();

  if (shouldUpdateToken(session.tokens.accessToken)) {
    try {
      // Here yoy retrieve the new access token from your custom backend
      const newAccessToken = await refreshAccessToken(
        session.tokens.refreshToken,
      );

      const newSessionToken = await encode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: {
          ...session,
          tokens: {
            refreshToken: session.tokens.refreshToken, // keep the same refresh token
            accessToken: newAccessToken, // update the access token
          },
        },
        maxAge: 1 * 24 * 60 * 60, // 1 day
      });

      // Update session token with new access token
      response.cookies.set(sessionCookie, newSessionToken);
    } catch (error) {
      return signOut(request);
    }
  }

  return response;
};
