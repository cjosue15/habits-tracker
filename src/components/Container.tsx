export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-[1040px] m-auto px-8">{children}</div>;
}
