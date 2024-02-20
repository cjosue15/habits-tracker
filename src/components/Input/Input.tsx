import { forwardRef } from "react";

interface InputProps {
  type?: "text" | "password" | "email";
  error?: boolean;
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type, error, id, placeholder, value, ...props }: InputProps,
  ref,
) {
  return (
    <input
      type={type}
      id={id}
      ref={ref}
      value={value}
      className={`border text-sm rounded-lg block w-full p-3 bg-transparent 
                ${
                  error
                    ? "focus:ring-red-500 focus:border-red-500 border-red-400 text-white outline-red-500"
                    : "focus:ring-green-500 focus:border-green-500 border-white/80 placeholder-white/80 text-white outline-green-500"
                }`}
      placeholder={placeholder}
      {...props}
    />
  );
});
