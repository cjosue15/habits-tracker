"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BackIcon } from "@/components/icons";
import Card from "@/components/Card/Card";
import { revalidate } from "@/actions/revalidate";
import { Checkbox } from "@/components/Checkbox/Checkbox";

interface Day {
  id: number;
  day: string;
  shortDay: string;
  checked?: boolean;
}

const days: Day[] = [
  { id: 1, shortDay: "M", day: "Monday" },
  { id: 2, shortDay: "T", day: "Tuesday" },
  { id: 3, shortDay: "W", day: "Wednesday" },
  { id: 4, shortDay: "T", day: "Thursday" },
  { id: 5, shortDay: "F", day: "Friday" },
  { id: 6, shortDay: "S", day: "Saturday" },
  { id: 7, shortDay: "S", day: "Sunday" },
];

export default function HabitForm({ id }: { id?: string }) {
  const mapedDays = days.map((day) => ({ ...day, checked: false }));
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isTitleEmpty, setIsTitleEmpty] = useState<boolean>(false);
  const [description, setDescription] = useState<string | null>(null);
  const [checkboxes, setCheckboxes] = useState<Day[]>(mapedDays);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchHabit(id);
    }
  }, [id]);

  const handleCheckboxChange = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
    setCheckboxes(updatedCheckboxes);
  };

  const fetchHabit = async (id: string) => {
    try {
      const response = await fetch(`/api/habit/${id}`);
      const { title, description } = await response.json();
      console.log({ title, description });
      setTitle(title);
      setDescription(description);
    } catch (error) {}
  };

  const handleBack = () => {
    router.push("/my-habits");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setIsTitleEmpty(true);
      return;
    }

    const route = isEditMode ? `/api/habit/${id}` : "/api/habits";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(route, {
        method: method,
        body: JSON.stringify({
          title,
          description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      revalidate("/my-habits");
      console.log(data);
      router.push("/my-habits");
    } catch (error) {}
  };

  return (
    <>
      <button className="flex items-center mb-8" onClick={handleBack}>
        <BackIcon /> <span className="font-bold ml-2">BACK</span>
      </button>

      <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-white">
            {!id ? "Create new" : "Edit"} habit
          </h5>
          <div>
            <label
              htmlFor="newHabit"
              className={`block mb-4 text-sm font-medium ${isTitleEmpty ? "text-red-400" : "text-white"}`}
            >
              My new habit
            </label>
            <input
              type="text"
              name="newHabit"
              id="newHabit"
              value={title}
              className={`border text-sm rounded-lg block w-full p-3 bg-transparent outline-green-500
                ${
                  isTitleEmpty
                    ? "focus:ring-red-500 focus:border-red-500 border-red-400 text-white"
                    : "focus:ring-green-500 focus:border-green-500 border-white/80 placeholder-white/80 text-white"
                }`}
              placeholder="I commited to... or chose below"
              onChange={(e) => setTitle(e.target.value)}
            />

            {isTitleEmpty && (
              <p
                className={`mt-2 text-xs ${isTitleEmpty ? "text-red-400" : "text-white"}`}
              >
                This field is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-4 text-sm font-medium text-white"
            >
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              value={description ?? ""}
              rows={4}
              className="border text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 bg-transparent border-white/80 outline-green-500 placeholder-white/80 text-white"
              placeholder="You can use this space to write a description of your habit."
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <span className="block text-sm font-bold">Repeat</span>

          {/* days in week */}

          <div className="flex justify-between gap-x-4">
            {checkboxes.map((day, index) => (
              <div key={day.id} className="text-sm text-gray-300">
                <Checkbox
                  checked={day.checked ?? false}
                  onChange={() => handleCheckboxChange(index)}
                  label={day.shortDay}
                  className="flex flex-col justify-center items-center"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full text-black bg-white hover:bg-white/90 focus:ring-4 focus:outline-none focus:ring-green-500 font-medium rounded-lg px-5 py-3 text-center"
          >
            {!id ? "Create" : "Edit"} habit
          </button>
        </form>
      </Card>
    </>
  );
}
