import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/libs/prisma";
import { CustomSession } from "@/interfaces/auth.interface";
import { authOptions } from "@/libs/auth";

export async function GET(request: Request) {
  try {
    const {
      user: { id },
    } = (await getServerSession(authOptions)) as CustomSession;
    const habits = await prisma?.habit.findMany({ where: { forUser: id } });
    let newHabits: any[] = [];
    for await (const habit of habits) {
      const records = await prisma?.record.findMany({
        where: { forHabit: habit.id },
      });
      newHabits = [...newHabits, { ...habit, records }];
    }
    return NextResponse.json({ habits: newHabits });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      user: { id },
    } = (await getServerSession(authOptions)) as CustomSession;
    const { title, description, daysOff } = await request.json();
    const newHabit = await prisma?.habit.create({
      data: { title, description, daysOff, forUser: id },
    });
    return NextResponse.json(newHabit, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma?.record.deleteMany({
      where: { forHabit: id },
    });
    const deletedHabit = await prisma?.habit.delete({ where: { id } });
    return NextResponse.json(deletedHabit);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
