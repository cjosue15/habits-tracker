import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/libs/prisma";
import { SessionUser } from "@/interfaces/auth.interface";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const {
      user: { id },
    } = (await getServerSession(authOptions)) as SessionUser;
    const { habitId } = await request.json();
    const newRecord = await prisma?.record.create({
      data: { forUser: id, forHabit: habitId },
    });
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { recordId } = await request.json();
    const recordDeleted = await prisma?.record.delete({
      where: { id: recordId },
    });
    return NextResponse.json(recordDeleted);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
