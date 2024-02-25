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

  if (!session || !session.tokens.accessToken || !session.tokens.refreshToken)
    return signOut(request);

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
