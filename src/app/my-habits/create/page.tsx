import HabitForm from "@/components/my-habits/create/HabitForm";

export default function FormPage() {
  return (
    <main>
      <div className="w-full max-w-[600px] m-auto">
        <div className="mt-16">
          <HabitForm />
        </div>
      </div>
    </main>
  );
}
