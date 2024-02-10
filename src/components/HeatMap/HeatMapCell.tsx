"use client";

import { Tooltip } from "react-tooltip";
import { GAP, RECT_SIZE, daysLabelsLong } from "./constants";
import { CellProps } from "./interfaces";

export const Cell = ({ weekIndex, dayIndex, index, data }: CellProps) => {
  const xPosition = weekIndex * (RECT_SIZE + GAP);
  const yPosition = dayIndex * (RECT_SIZE + GAP);
  const { date } = data;

  const getMessage = (date: Date) => {
    return `${daysLabelsLong.at(date.getDay())}, ${date.toLocaleDateString("en-US", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <g>
      <rect
        x={xPosition}
        y={yPosition}
        rx={2}
        ry={2}
        width={RECT_SIZE}
        height={RECT_SIZE}
        className={`cursor-pointer outline-none ${data.cssClass}`}
        onClick={() => {
          console.log(data.date);
        }}
        data-tooltip-id="dayTooltip"
        data-tooltip-content={
          data.value ? `You did it on ${getMessage(date)}` : null
        }
      />
    </g>
  );
};
