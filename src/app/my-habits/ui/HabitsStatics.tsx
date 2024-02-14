import { MILISECONDS_IN_DAY } from "@/components/HeatMap/constants";
import { convertToDate } from "@/components/HeatMap/helpers";
import { Record } from "@/interfaces/habits.interface";
import { Tooltip } from "react-tooltip";

let staticsIdConsistency = 0;

interface HabitStaticProps {
  records: Record[];
  daysEllapsed: number;
  createdAt: string;
}

export const HabitsStatics = (props: HabitStaticProps) => {
  staticsIdConsistency++;

  const getDateString = () => {
    return `${parsedDate.toLocaleDateString("en-US", { month: "long" })} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  };

  const { records, createdAt, daysEllapsed } = props;
  const initialDate = new Date(createdAt);
  const parsedDate = convertToDate(initialDate);
  const today = convertToDate(new Date());

  const getConsistency = () => {
    return Math.round((records.length / daysEllapsed) * 100);
  };

  const calculateStreak = () => {
    // if the date previous to today not match with a record, the streak is 0
    // if has record, the streak should be 1

    const previousDate = new Date(today.getTime() - MILISECONDS_IN_DAY);
    const lastRecord = records.at(-1);
    let lastRecordDate;

    if (!lastRecord) return 0;

    lastRecordDate = convertToDate(new Date(lastRecord.createdAt));

    if (previousDate.getTime() !== lastRecordDate.getTime()) {
      return 0;
    }

    let counterStreak = 0;
    let index = 1;
    for (let i = records.length - 1; i >= 0; i--) {
      const today = new Date();
      const date = convertToDate(
        new Date(today.getTime() - index * MILISECONDS_IN_DAY),
      );
      const recordDate = convertToDate(new Date(records[i].createdAt));

      if (date.getTime() !== recordDate.getTime()) {
        break;
      }
      counterStreak++;
      index++;
    }

    return counterStreak;
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <span className="text-xl font-bold text-center mb-2">
          {calculateStreak()}
        </span>
        <span className="text-xs">Streak</span>
      </div>

      <div
        className="flex flex-col"
        data-tooltip-id={`${staticsIdConsistency}-consistency`}
      >
        <span className="text-xl font-bold text-center mb-2">
          {getConsistency()}%
        </span>
        <span className="text-xs">Consistency</span>
      </div>

      <Tooltip
        id={`${staticsIdConsistency}-consistency`}
        className="!bg-black !border-gray-500/50 !border !w-[300px]"
      >
        <p className="text-xs mb-2">
          This is how much you stick to your habit sice you started on{" "}
          <b>{getDateString()}</b>
        </p>
        <p className="text-xs mb-2">
          Daily habit: (Total check-ins / days ellapsed)
        </p>
        <p className="text-xs">
          An score over 100% means you event completed your habit on days off!
        </p>
      </Tooltip>

      <div className="flex flex-col">
        <span className="text-xl font-bold text-center mb-2">
          {records.length}
        </span>
        <span className="text-xs">Check-ins</span>
      </div>
    </div>
  );
};
