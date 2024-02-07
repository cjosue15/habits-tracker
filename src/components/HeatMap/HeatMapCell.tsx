"use client";

import { GAP, RECT_SIZE } from "./constants";
import { CellProps } from "./interfaces";

export const Cell = ({ weekIndex, dayIndex, index, data }: CellProps) => {
  const xPosition = weekIndex * (RECT_SIZE + GAP);
  const yPosition = dayIndex * (RECT_SIZE + GAP);

  return (
    <g>
      <rect
        x={xPosition}
        y={yPosition}
        rx={1}
        ry={1}
        width={RECT_SIZE}
        height={RECT_SIZE}
        className={`cursor-pointer ${data.cssClass}`}
        onClick={() => {
          console.log(data.date);
        }}
      />
    </g>
  );
};
