import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { compare, encrypt } from "@/libs/bcrypt";
import { ProfileGoogle } from "@/interfaces/auth.interface";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const userFound = await prisma?.user.findUnique({
      where: { email },
    });

    if (userFound) {
      return NextResponse.json(
        { message: "It seems you already have an account" },
        { status: 400 },
      );
    }

    const passwordEncrypted = await encrypt(password);
    const newUser = await prisma?.user.create({
      data: { email, password: passwordEncrypted, name },
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

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
