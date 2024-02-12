export const MenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <li className="mb-1">
      <button
        className="w-full flex flex-row gap-x-2 items-center p-1 text-[14px] rounded-sm hover:bg-zinc-900"
        onClick={() => onClick()}
      >
        {children}
      </button>
    </li>
  );
};
