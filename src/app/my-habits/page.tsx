import Link from "next/link";
import dayjs from "dayjs";

import Container from "@/components/Container";
import { PlusIcon } from "@/components/icons";

import { HabitsGrid } from "./ui/HabitsGrid";

export default async function MyHabitsPage() {
  const response = await fetch(
    `https://habits-tracker-two.vercel.app/api/habits`,
    {
      headers: {
        Accept: "application/json; charset=UTF-8",
      },
      cache: "no-cache",
    },
  );
  const { habits } = await response.json();

  return (
    <Container>
      <div className="flex justify-end pt-8">
        <Link href="/habit/create" className="flex items-center gap-x-2">
          Create new habit <PlusIcon />
        </Link>
      </div>
      <HabitsGrid habits={habits} />
    </Container>
  );
}
