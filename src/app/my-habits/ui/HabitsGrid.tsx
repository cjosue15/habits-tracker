"use client";

import { Habit } from "@/interfaces/habits.interface";
import { Tooltip } from "react-tooltip";
import { HabitCard } from "./HabitCard";

export const HabitsGrid = ({ habits = [] }: { habits: Habit[] }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-16">
        {habits.map((habit: Habit) => {
          return <HabitCard key={habit.id} habit={habit} />;
        })}
      </div>

      <Tooltip id="dayTooltip" className="!text-xs" />
    </>
  );
};
