import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

import { ProfileGoogle } from "@/interfaces/auth.interface";
import {
  checkIfUserExists,
  signUpWithGoogle,
} from "@/app/api/auth/register/route";
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
