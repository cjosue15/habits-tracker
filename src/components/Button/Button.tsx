export interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  className,
  disabled,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`
        w-full text-black bg-white hover:bg-white/90 focus:ring-4 
        focus:outline-none focus:ring-green-500 font-medium
        disabled:cursor-not-allowed disabled:bg-white/80
        rounded-lg px-5 py-3 text-center ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
