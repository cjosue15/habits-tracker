export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary rounded-lg shadow-appShadow p-6 hover:opacity-100">
      {children}
    </div>
  );
}
