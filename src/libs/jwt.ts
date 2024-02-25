import { CustomUser, Tokens } from "@/interfaces/auth.interface";
import { SignJWT, decodeJwt, JWTPayload, jwtVerify } from "jose";

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

export const checkIfTokenIsExpired = (token: string) => {
  const { exp } = decodeToken(token) as JWTPayload;
  const timestamp = exp || 0;
  const expirationDate = new Date(timestamp * 1000);
  const dateString = expirationDate.toLocaleString();
  console.log(dateString);
  return Date.now() / 1000 > (exp || 0);
};

export const refreshAccessToken = async (refreshToken: string) => {
  const isValid = await verifyToken(refreshToken);

  if (!isValid || checkIfTokenIsExpired(refreshToken))
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
