import Container from "@/components/Container";

import dayjs from "dayjs";
import { HabitsGrid } from "./ui/HabitsGrid";

export default async function MyHabitsPage() {
  const response = await fetch("http://localhost:3000/api/habits", {
    cache: "no-cache",
  });
  const { habits } = await response.json();
  console.log(dayjs().format());

  // console.log(habits);

  return (
    <Container>
      <HabitsGrid habits={habits} />
    </Container>
  );
}
