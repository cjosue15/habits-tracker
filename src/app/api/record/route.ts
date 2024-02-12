import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request: Request) {
  try {
    const { habitId } = await request.json();
    const newRecord = await prisma?.record.create({
      data: { forUser: "user1234", forHabit: habitId },
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
