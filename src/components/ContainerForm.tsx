export default function ContainerForm({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[600px] m-auto px-8">
      <div className="my-16">{children}</div>
    </div>
  );
}
