import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

import { prisma } from "@/libs/prisma";
import {
  CustomJWT,
  CustomUser,
  ProfileGoogle,
} from "@/interfaces/auth.interface";
import { compare } from "./bcrypt";
import { generateTokens } from "./jwt";

export const checkIfUserExists = async (
  email: string,
  password: string,
): Promise<CustomUser | null> => {
  try {
    const userFound = await prisma?.user.findUnique({
      where: { email },
    });

    if (!userFound) return null;

    const matchPassword = await compare(password, userFound.password);

    if (!matchPassword) return null;

    const user = {
      id: userFound.id,
      email: userFound.email,
      name: userFound.name,
      isEmailVerified: userFound.isEmailVerified,
      provider: userFound.isGoogleProvider ? "google" : "credentials",
      image: userFound.picture,
    };

    return {
      ...user,
      tokens: await generateTokens(user),
    };
  } catch (error) {
    return null;
  }
};

export const signUpWithGoogle = async (profile: ProfileGoogle) => {
  try {
    const { email, email_verified, name, picture, sub } = profile;

    const userFound = await prisma?.user.findUnique({
      where: { email },
    });

    if (userFound && !userFound.isGoogleProvider) {
      // user already exists and is not a google provider
      return false;
    }

    if (userFound && userFound.isGoogleProvider) {
      return true;
    }

    await prisma?.user.create({
      data: {
        id: sub,
        email,
        name,
        isGoogleProvider: true,
        password: "",
        isEmailVerified: email_verified,
        picture,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await checkIfUserExists(
          credentials.email,
          credentials.password,
        );

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (profile && account?.provider === "google") {
        return await signUpWithGoogle(profile as ProfileGoogle);
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const accessToken = user.tokens.accessToken;
        const refreshToken = user.tokens.refreshToken;
        const { tokens: _, ...newUser } = user;
        token.tokens = {
          accessToken,
          refreshToken,
        };

        token.user = {
          ...newUser,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as CustomUser;
      session.tokens = token.tokens;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};

declare module "next-auth" {
  interface User extends CustomUser {}
  interface Session extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends CustomJWT {}
}
