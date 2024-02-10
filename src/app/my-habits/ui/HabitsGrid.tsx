"use client";

import HeatMap from "@/components/HeatMap/HeatMap";
import { HeatMapDate } from "@/components/HeatMap/interfaces";
import OptionsIcon from "@/components/icons/options";
import { Habit } from "@/interfaces/habits.interface";
import { Tooltip } from "react-tooltip";

export const HabitsGrid = ({ habits }: { habits: Habit[] }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-16">
        {habits.map((habit: Habit) => {
          const classForValue = ({ value }: HeatMapDate) => {
            if (value === 1) return "fill-red-500";
            if (value === 5) return "fill-green-500";

            return "fill-white/10";
          };

          return (
            <div
              key={habit.id}
              className="bg-secondary rounded-lg shadow-appShadow p-6 hover:opacity-100"
            >
              <div className="flex items-center gap-x-4">
                <div>
                  <OptionsIcon />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{habit.title}</h3>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="size-6" />
                </div>
              </div>

              <p className="text-sm my-6">
                {habit.description ?? "No description here."}
              </p>
              <div className="overflow-x-auto">
                <HeatMap
                  startDate={new Date(2023, 5, 15)}
                  endDate={new Date()}
                  dates={[
                    { date: new Date(2023, 6, 1), value: 1 },
                    { date: new Date(2023, 10, 5), value: 1 },
                    { date: new Date(2024, 0, 1), value: 5 },
                    { date: new Date(), value: 1 },
                  ]}
                  classForValue={classForValue}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Tooltip id="dayTooltip" className="!text-xs" />
    </>
  );
};
