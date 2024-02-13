import { ChangeEvent, useRef, useState } from "react";

import HeatMap from "@/components/HeatMap/HeatMap";
import { Habit } from "@/interfaces/habits.interface";
import { HeatMapDate } from "@/components/HeatMap/interfaces";
import Card from "@/components/Card/Card";
import { MenuItem, Menu, useClickOutside } from "@/components/Menu";
import { EditIcon, OptionsIcon, TrashIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { revalidate } from "@/actions/revalidate";

const addRecord = async (habitId: string) => {
  const response = await fetch(`/api/record`, {
    method: "POST",
    body: JSON.stringify({ habitId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(data);
};

const deleteRecord = async (recordId: string) => {
  const response = await fetch(`/api/record`, {
    method: "DELETE",
    body: JSON.stringify({ recordId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(data);
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
  const data = await response.json();
  console.log(data);
};

export const HabitCard = ({
  habit,
  classForValue,
}: {
  habit: Habit;
  classForValue: (value: HeatMapDate) => string;
}) => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(checkRecord(habit));
  const [open, setOpen] = useState(false);
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
    await deleteHabit(habit.id);
    revalidate("my-habits");
  };

  const handleEdit = () => {
    router.push(`/habit/${habit.id}/edit`);
  };

  return (
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
              <MenuItem onClick={handleDelete}>
                <TrashIcon className="size-4" /> Delete
              </MenuItem>
            </Menu>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">{habit.title}</h3>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="size-6 accent-green-500"
            checked={isChecked}
            onChange={(event) => handleCheckboxChange(event, habit)}
          />
        </div>
      </div>

      <p className="text-sm my-6">
        {habit.description ?? "No description here."}
      </p>
      <div className="overflow-x-auto">
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
    </Card>
  );
};
