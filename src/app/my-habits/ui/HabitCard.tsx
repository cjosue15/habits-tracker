import { ChangeEvent, useRef, useState } from "react";

import HeatMap from "@/components/HeatMap/HeatMap";
import { Habit } from "@/interfaces/habits.interface";
import { HeatMapDate } from "@/components/HeatMap/interfaces";
import Card from "@/components/Card/Card";
import { MenuItem, Menu, useClickOutside } from "@/components/Menu";
import { EditIcon, OptionsIcon, TrashIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { revalidate } from "@/actions/revalidate";
import { Checkbox } from "@/components/Checkbox/Checkbox";
import { HabitsStatics } from "./HabitsStatics";
import {
  convertToDate,
  getEmptyDaysAtStart,
  getMapedDay,
} from "@/components/HeatMap/helpers";
import { MILISECONDS_IN_DAY } from "@/components/HeatMap/constants";
import { Modal } from "@/components/Modal/Modal";
import { notify } from "@/shared/notify";

const addRecord = async (habitId: string) => {
  try {
    const response = await fetch(`/api/record`, {
      method: "POST",
      body: JSON.stringify({ habitId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await response.json();

    notify("Record added successfully", "success");
  } catch (error) {
    notify("Error adding record", "error");
  }
};

const deleteRecord = async (recordId: string) => {
  try {
    const response = await fetch(`/api/record`, {
      method: "DELETE",
      body: JSON.stringify({ recordId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await response.json();
    notify("Record deleted successfully", "success");
  } catch (error) {
    notify("Error deleting record", "error");
  }
};

const checkRecord = (habit: Habit) => {
  const lastRecord = habit.records.at(-1);

  if (!lastRecord) return false;

  const { createdAt } = lastRecord;

  const dateWithOutHours = new Date(new Date(createdAt).setHours(0, 0, 0, 0));
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));

  if (dateWithOutHours.getTime() !== currentDate.getTime()) {
    return false;
  }

  return true;
};

const deleteHabit = async (habitId: string) => {
  const response = await fetch(`/api/habits`, {
    method: "DELETE",
    body: JSON.stringify({ id: habitId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await response.json();
};

export const HabitCard = ({ habit }: { habit: Habit }) => {
  const router = useRouter();
  const createdAt = convertToDate(new Date(habit.createdAt));
  const now = convertToDate(new Date());
  let daysOff = !habit.daysOff ? [] : JSON.parse(habit.daysOff);
  daysOff = daysOff.map((day: number) => getMapedDay(day));

  const [isChecked, setIsChecked] = useState(checkRecord(habit));
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => {
    setOpen(false);
  });

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    habit: Habit,
  ) => {
    const { checked } = event.target;
    setIsChecked(!isChecked);

    if (checked) {
      addRecord(habit.id);
    } else {
      const lastRecord = habit.records.at(-1);
      if (checkRecord(habit) && lastRecord) {
        deleteRecord(lastRecord.id);
      }
    }

    revalidate("my-habits");
  };

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id);
      setModalOpen(false);
      notify("Habit deleted successfully", "success");
      revalidate("my-habits");
    } catch (error) {
      notify("Error deleting habit", "error");
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleEdit = () => {
    router.push(`/habit/${habit.id}/edit`);
  };

  const calculateMissingDays = () => {
    const daysEllapsed = Math.round(
      (now.getTime() - createdAt.getTime()) / MILISECONDS_IN_DAY,
    );

    const CURRENT_DAY = 1;

    let dayOffsCounter = 0;

    for (let i = 0; i <= daysEllapsed; i++) {
      const date = convertToDate(
        new Date(createdAt.getTime() + i * MILISECONDS_IN_DAY),
      );
      const dayMaped = getEmptyDaysAtStart(date);
      if (daysOff.includes(dayMaped)) {
        dayOffsCounter++;
      }
    }

    return {
      daysEllapsed: daysEllapsed + CURRENT_DAY - dayOffsCounter,
      daysMissing: daysEllapsed - habit.records.length,
    };
  };

  const { daysEllapsed } = calculateMissingDays();

  const classForValue = ({ value, date }: HeatMapDate) => {
    // missing record
    if (
      date.getTime() >= createdAt.getTime() &&
      date.getTime() !== now.getTime() &&
      !value &&
      !daysOff.includes(getEmptyDaysAtStart(date))
    ) {
      return "fill-red-500";
    }

    if (value === 1) return "fill-green-500";

    return "fill-white/10";
  };

  return (
    <>
      <Card key={habit.id}>
        <div className="flex items-center gap-x-4">
          <div className="relative flex" ref={wrapperRef}>
            <button onClick={() => setOpen(!open)}>
              <OptionsIcon />
            </button>
            {open && (
              <Menu>
                <MenuItem onClick={handleEdit}>
                  <EditIcon className="size-4" /> Edit
                </MenuItem>
                <MenuItem onClick={handleModalOpen}>
                  <TrashIcon className="size-4" /> Delete
                </MenuItem>
              </Menu>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{habit.title}</h3>
          </div>
          <div className="flex items-center">
            <Checkbox
              checked={isChecked}
              onChange={(event) => handleCheckboxChange(event, habit)}
            />
          </div>
        </div>

        <p className="text-sm my-6">
          {habit.description ?? "No description here."}
        </p>

        <HabitsStatics
          records={habit.records}
          createdAt={habit.createdAt}
          daysEllapsed={daysEllapsed}
        />

        <div className="overflow-x-auto mt-6">
          <HeatMap
            startDate={new Date(2023, 5, 15)}
            endDate={new Date()}
            dates={habit.records.map((record) => ({
              date: new Date(record.createdAt),
              value: 1,
            }))}
            classForValue={classForValue}
          />
        </div>
        <HabitLegend />
      </Card>

      <Modal isOpen={modalOpen}>
        <p className="text-center text-2xl font-bold mb-6">Are you sure?</p>
        <p className="text-sm">
          If you delete this habit, all of your records will be lost forever.
        </p>
        <div className="mt-6 flex justify-end gap-x-4">
          <button
            className="bg-red-500 rounded-md px-4 py-2 text-center text-sm hover:bg-red-400 font-bold"
            onClick={handleDelete}
          >
            Delete {habit.title}
          </button>
          <button
            className="rounded-md px-4 py-2 text-center text-sm font-bold border border-white/30 hover:bg-black/10"
            onClick={() => setModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

const HabitLegend = () => {
  return (
    <div className="flex items-center justify-end mt-4 gap-x-4">
      <div className="flex items-center gap-x-2">
        <small className="text-[10px]">Day off</small>
        <div className="size-[11px] bg-white/10 rounded-sm"></div>
      </div>
      <div className="flex items-center gap-x-2">
        <small className="text-[10px]">Missing day</small>
        <div className="size-[11px] bg-red-500 rounded-sm"></div>
      </div>
      <div className="flex items-center gap-x-2">
        <small className="text-[10px]">Day completed</small>
        <div className="size-[11px] bg-green-500 rounded-sm"></div>
      </div>
    </div>
  );
};
