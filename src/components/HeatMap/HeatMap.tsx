import { DAYS_IN_WEEK, GAP, MILISECONDS_IN_DAY, RECT_SIZE } from "./constants";
import {
  convertToDate,
  getEmptyDaysAtStart,
  getNumberDays,
  getRange,
  getWeeksCount,
} from "./helpers";

import { Cell } from "./HeatMapCell";
import { CellData, HeatMapProps } from "./interfaces";

export default function HeatMap({
  startDate,
  endDate,
  dates,
  classForValue,
}: HeatMapProps) {
  const days = getNumberDays(startDate, endDate);
  const weeks = getWeeksCount(startDate, endDate);
  console.log({ days, weeks });

  const getWidthHeatMap = () => {
    return (RECT_SIZE + GAP) * weeks - GAP;
  };

  const getHeigthHeatMap = () => {
    return (RECT_SIZE + GAP) * DAYS_IN_WEEK - GAP;
  };

  const getDate = (index: number) =>
    new Date(startDate.getTime() + index * MILISECONDS_IN_DAY);

  const generateData = async (index: number): Promise<CellData> => {
    console.log({ index });
    const currentDate = getDate(index);
    const dateMatched = dates.find(
      ({ date }) => convertToDate(date).getTime() === currentDate.getTime(),
    );

    const value = dateMatched ? dateMatched.value : null;
    return {
      date: currentDate,
      value,
      cssClass: await classForValue({ date: currentDate, value }),
    };
  };

  return (
    <svg x="0" y="0" width={getWidthHeatMap()} height={getHeigthHeatMap()}>
      <svg x="0" y="0">
        {getRange(weeks).map((weekIndex) => {
          return getRange(DAYS_IN_WEEK).map(async (dayIndex) => {
            const index = weekIndex * DAYS_IN_WEEK + dayIndex;
            const isOutOfRange =
              index < getEmptyDaysAtStart(startDate) ||
              index >= getEmptyDaysAtStart(startDate) + days;

            if (isOutOfRange) return null;

            const data = await generateData(
              index - getEmptyDaysAtStart(startDate),
            );

            return (
              <Cell
                key={dayIndex}
                weekIndex={weekIndex}
                dayIndex={dayIndex}
                index={index}
                data={data}
              />
            );
          });
        })}
      </svg>
    </svg>
  );
}
