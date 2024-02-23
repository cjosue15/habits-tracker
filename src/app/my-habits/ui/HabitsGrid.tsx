"use client";

import { Habit } from "@/interfaces/habits.interface";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import { HabitCard } from "./HabitCard";
import { notify } from "@/shared/notify";

export interface HabitsGridProps {
  habits: Habit[];
}

export const HabitsGrid = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    fetchHabts();
  }, []);

  const fetchHabts = async () => {
    try {
      const response = await fetch(`/api/habits`, {
        headers: {
          Accept: "application/json; charset=UTF-8",
        },
        cache: "no-cache",
      });
      const { habits } = await response.json();
      setHabits(habits);
    } catch (error) {
      notify("Ops! An error occurred. Please try again.");
    }
  };

  const handleUpdateGrid = () => {
    fetchHabts();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-16">
        {habits?.map((habit: Habit) => {
          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              updateGrid={handleUpdateGrid}
            />
          );
        })}
      </div>

      <Tooltip id="dayTooltip" className="!text-xs" />
    </>
  );
};
