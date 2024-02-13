export default function HabitFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[600px] m-auto">
      <div className="mt-16">{children}</div>
    </div>
  );
}
