import Link from "next/link";
import dayjs from "dayjs";

import Container from "@/components/Container";
import PlusIcon from "@/components/icons/plus";

import { HabitsGrid } from "./ui/HabitsGrid";

export default async function MyHabitsPage() {
  const response = await fetch("http://localhost:3000/api/habits", {
    cache: "no-cache",
  });
  const { habits } = await response.json();
  console.log(dayjs().format());

  return (
    <Container>
      <div className="flex justify-end pt-8">
        <Link href="/my-habits/create" className="flex items-center gap-x-2">
          Create new habit <PlusIcon />
        </Link>
      </div>
      <HabitsGrid habits={habits} />
    </Container>
  );
}
