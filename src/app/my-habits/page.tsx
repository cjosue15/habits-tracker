import Link from "next/link";

import Container from "@/components/Container";
import { PlusIcon } from "@/components/icons";

import { HabitsGrid } from "./ui/HabitsGrid";

export default async function MyHabitsPage() {
  return (
    <Container>
      <div className="flex justify-end pt-8">
        <Link href="/habit/create" className="flex items-center gap-x-2">
          Create new habit <PlusIcon />
        </Link>
      </div>
      <HabitsGrid />
    </Container>
  );
}
