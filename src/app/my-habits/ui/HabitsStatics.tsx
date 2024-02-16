import { MILISECONDS_IN_DAY } from "@/components/HeatMap/constants";
import { convertToDate } from "@/components/HeatMap/helpers";
import { Record } from "@/interfaces/habits.interface";
import { Tooltip } from "react-tooltip";

let staticsIdConsistency = 0;
let staticsIdStreak = 0;

interface HabitStaticProps {
  records: Record[];
  daysEllapsed: number;
  createdAt: string;
}

const calculateStreak = (records: Record[]) => {
  // if the date previous to today not match with a record, the streak is 0
  // if has record, the streak should be 1

  const today = convertToDate(new Date());
  records = records.toSorted(
    (a, b) =>
      convertToDate(new Date(a.createdAt)).getTime() -
      convertToDate(new Date(b.createdAt)).getTime(),
  );
  const lastRecord = records.at(-1);
  let lastRecordDate;

  if (!lastRecord) return [0, 0];

  lastRecordDate = convertToDate(new Date(lastRecord.createdAt));

  let counterStreak = 0;
  let index = lastRecordDate.getTime() === today.getTime() ? 0 : 1;

  for (let i = records.length - 1; i >= 0; i--) {
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

  let maxConsecutive = 0;
  let currentConsecutive = 1; // Start with 1 as the first date is always consecutive

  for (let i = 1; i < records.length; i++) {
    const previousDate = convertToDate(new Date(records[i - 1].createdAt));
    const currentDate = convertToDate(new Date(records[i].createdAt));

    // Check if consecutive (difference is 1 day)
    if (Math.abs(currentDate.getTime() - previousDate.getTime()) === 86400000) {
      // 1 day in milliseconds
      currentConsecutive++;
    } else {
      // Not consecutive, reset counter and track the maximum
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      currentConsecutive = 1;
    }
  }

  // Update maxConsecutive after the last date
  maxConsecutive = Math.max(maxConsecutive, currentConsecutive);

  return [counterStreak, maxConsecutive];
};

export const HabitsStatics = (props: HabitStaticProps) => {
  staticsIdConsistency++;
  staticsIdStreak++;
  const { records, createdAt, daysEllapsed } = props;

  const [streak, maxStreak] = calculateStreak(records);

  const getDateString = () => {
    return `${parsedDate.toLocaleDateString("en-US", { month: "long" })} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
  };

  const initialDate = new Date(createdAt);
  const parsedDate = convertToDate(initialDate);

  const getConsistency = () => {
    return Math.round((records.length / daysEllapsed) * 100);
  };

  return (
    <div className="flex justify-between">
      <div
        className="flex flex-col"
        data-tooltip-id={`${staticsIdStreak}-streak`}
      >
        <span className="text-xl font-bold text-center mb-2">{streak}</span>
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

      <div className="flex flex-col">
        <span className="text-xl font-bold text-center mb-2">
          {records.length}
        </span>
        <span className="text-xs">Check-ins</span>
      </div>

      <Tooltip
        id={`${staticsIdStreak}-streak`}
        className="!bg-black !border-gray-500/50 !border !w-[300px]"
      >
        {maxStreak > 0 && (
          <p className="mb-2 font-bold">Best streak: {maxStreak} 🔥</p>
        )}
        <p className="text-xs mb-2">
          Daily habit: 1 Check-in{"  "}➡️{"  "}Streak + 1
        </p>
        <p className="text-xs">
          If you miss a daily check-in, the streak will reset to 0
        </p>
      </Tooltip>

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
          An score over <b>100%</b> means you event completed your habit on days
          off!
        </p>
      </Tooltip>
    </div>
  );
};
