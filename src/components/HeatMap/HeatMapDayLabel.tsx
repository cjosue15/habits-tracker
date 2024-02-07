import { GAP, RECT_SIZE } from "./constants";

export const HeatMapDayLabel = ({
  label,
  index,
}: {
  label: string;
  index: number;
}) => {
  const y = index * (RECT_SIZE + GAP);

  return (
    <g>
      <rect
        className="fill-transparent"
        width={30}
        height={11}
        rx={2}
        ry={2}
        x={0}
        y={y}
      ></rect>
      <text
        dominantBaseline="central"
        textAnchor="start"
        className="fill-current text-[9px]"
        style={{ alignmentBaseline: "text-before-edge" }}
        x={0}
        y={y}
      >
        {label}
      </text>
    </g>
  );
};
