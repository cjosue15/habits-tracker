import { CustomUser, Tokens } from "@/interfaces/auth.interface";
import { SignJWT, decodeJwt, JWTPayload, jwtVerify } from "jose";
import { TokenSet } from "next-auth";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET as string);

export const signToken = async (
  payload: string | object | Buffer,
  expiresIn: string | number = "1d",
) => {
  const algorithm = "HS256";

  return await new SignJWT({ payload })
    .setProtectedHeader({
      alg: algorithm,
      typ: "JWT",
    })
    .setExpirationTime(expiresIn)
    .sign(secret);
};

export const decodeToken = (token: string) => {
  return decodeJwt(token);
};

export const verifyToken = async (token: string) => {
  return await jwtVerify(token, secret);
};

export const checkIfTokenIsExpired = (expiration: number) => {
  return Date.now() / 1000 > expiration;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const isValid = await verifyToken(refreshToken);

  const { exp } = decodeToken(refreshToken) as JWTPayload;
  if (!isValid || checkIfTokenIsExpired(exp || 0))
    throw new Error("Invalid token or expired token");

  const { payload } = decodeToken(refreshToken);
  return signToken(payload as CustomUser);
};

export const generateTokens = async (payload: JWTPayload): Promise<Tokens> => {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      signToken(payload),
      signToken(payload, "9w"),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new Error("Error generating tokens");
  }
};

export const refreshAccessTokenGoogle = async (refreshToken: string) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_ID!,
        client_secret: process.env.GOOGLE_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      method: "POST",
    });
    const tokens: TokenSet = await response.json();
    return tokens;
  } catch (error) {
    throw new Error("Error refreshing token from google");
  }
};
