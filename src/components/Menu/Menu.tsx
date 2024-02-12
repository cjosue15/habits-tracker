export const Menu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="z-10 absolute left-0 top-10 p-2 min-w-[100px] bg-black rounded-md border border-gray-500/50 shadow">
      <ul className="text-sm text-gray-200">{children}</ul>
    </div>
  );
};
