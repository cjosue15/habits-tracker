import HabitForm from "@/app/habit/ui/HabitForm";
import ContainerForm from "@/components/ContainerForm";

export default function HabitEditPage({ params }: { params: any }) {
  console.log(new Date());
  console.log(new Date().getHours());
  console.log(new Date().getUTCHours());
  return (
    <ContainerForm>
      <HabitForm id={params.id} />
    </ContainerForm>
  );
}
