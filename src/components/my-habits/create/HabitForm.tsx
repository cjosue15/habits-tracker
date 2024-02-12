"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { BackIcon } from "@/components/icons";
import Card from "@/components/Card/Card";

interface Day {
  id: number;
  day: string;
  shortDay: string;
}
export default function HabitForm() {
  const [title, setTitle] = useState<string>("");
  const [isTitleEmpty, setIsTitleEmpty] = useState<boolean>(false);
  const [description, setDescription] = useState<string | null>(null);

  const days: Day[] = [
    { id: 1, shortDay: "M", day: "Monday" },
    { id: 2, shortDay: "T", day: "Tuesday" },
    { id: 3, shortDay: "W", day: "Wednesday" },
    { id: 4, shortDay: "T", day: "Thursday" },
    { id: 5, shortDay: "F", day: "Friday" },
    { id: 6, shortDay: "S", day: "Saturday" },
    { id: 7, shortDay: "S", day: "Sunday" },
  ];

  const router = useRouter();

  const handleBack = () => {
    router.push("/my-habits");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setIsTitleEmpty(true);
      return;
    }

    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      handleBack();
    } catch (error) {}
  };

  return (
    <>
      <button className="flex items-center mb-8" onClick={handleBack}>
        <BackIcon /> <span className="font-bold ml-2">BACK</span>
      </button>

      <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-white">Create new habit</h5>
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
              className={`border text-sm rounded-lg block w-full p-3 bg-white outline-green-500
                ${
                  isTitleEmpty
                    ? "focus:ring-red-500 focus:border-red-500 border-red-400 text-black"
                    : "focus:ring-green-500 focus:border-green-500 border-gray-500 placeholder-black text-black"
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
              rows={4}
              className="border text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 bg-white border-gray-500 outline-green-500 placeholder-black text-black"
              placeholder="You can use this space to write a description of your habit."
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <span className="block text-sm font-bold">Repeat</span>

          {/* days in week */}

          <div className="flex justify-between gap-x-4">
            {days.map((day) => (
              <div key={day.id} className="text-sm text-gray-300">
                <label
                  htmlFor={`${day.id}-${day.day}`}
                  className="flex flex-col justify-center items-center"
                >
                  <input
                    id={`${day.id}-${day.day}`}
                    type="checkbox"
                    className="size-6 mb-4 rounded-lg focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
                  />
                  <span>{day.shortDay}</span>
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full text-white bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-4 text-center"
          >
            Create habit
          </button>
        </form>
      </Card>
    </>
  );
}
