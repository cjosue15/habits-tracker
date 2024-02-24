import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

import { prisma } from "@/libs/prisma";
import { ProfileGoogle } from "@/interfaces/auth.interface";
import { compare } from "./bcrypt";

export const checkIfUserExists = async (email: string, password: string) => {
  const userFound = await prisma?.user.findUnique({
    where: { email },
  });

  if (!userFound) return null;

  const matchPassword = await compare(password, userFound.password);

  if (!matchPassword) return null;

  return {
    id: userFound.id,
    email: userFound.email,
    name: userFound.name,
    isEmailVerified: userFound.isEmailVerified,
  };
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
    console.error("[signIn] error: ", error);
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
    jwt({ token, user, account }) {
      if (user) {
        token.user = { ...user, provider: account?.provider ?? "credentials" };
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};
