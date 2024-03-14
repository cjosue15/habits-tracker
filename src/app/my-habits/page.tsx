import Link from "next/link";

import Container from "@/components/Container";
import { PlusIcon } from "@/components/icons";

import { HabitsGrid } from "./ui/HabitsGrid";
import { Suspense } from "react";
import Loading from "./loading";

export default async function MyHabitsPage() {
  return (
    <Container>
      <div className="flex justify-end pt-8">
        <Link
          href="/habit/create"
          className="flex items-center gap-x-2 bg-white text-black hover:bg-white/90 rounded-lg px-5 py-3"
        >
          Create new habit <PlusIcon />
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <HabitsGrid />
      </Suspense>
    </Container>
  );
}
