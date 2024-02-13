import HabitForm from "@/app/habit/ui/HabitForm";
import HabitFormContainer from "@/app/habit/ui/HabitFormContainer";

export default function HabitEditPage({ params }: { params: any }) {
  return (
    <HabitFormContainer>
      <HabitForm id={params.id} />
    </HabitFormContainer>
  );
}
