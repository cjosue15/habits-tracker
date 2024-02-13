import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const habitFound = await prisma?.habit.findFirst({
      where: { id },
    });

    if (!habitFound) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habitFound);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { title, description } = await request.json();
    const habitFound = await prisma?.habit.findFirst({
      where: { id },
    });

    if (!habitFound) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    const updatedHabit = await prisma?.habit.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(updatedHabit);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
