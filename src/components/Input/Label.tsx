export interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  error?: boolean;
}

export const Label = ({ children, htmlFor, error }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block mb-4 text-sm font-medium ${error ? "text-red-400" : "text-white"}`}
    >
      {children}
    </label>
  );
};
