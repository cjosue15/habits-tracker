import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { encrypt } from "@/libs/bcrypt";

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
