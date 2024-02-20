import HabitForm from "@/app/habit/ui/HabitForm";
import ContainerForm from "@/components/ContainerForm";

export default function HabitEditPage({ params }: { params: any }) {
  return (
    <ContainerForm>
      <HabitForm id={params.id} />
    </ContainerForm>
  );
}
