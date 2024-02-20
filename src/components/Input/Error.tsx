export interface ErrorProps {
  children: React.ReactNode;
  error?: boolean;
}

export const Error = ({ children, error }: ErrorProps) => {
  return (
    <p className={`mt-2 text-xs ${error ? "text-red-400" : "text-white"}`}>
      {children}
    </p>
  );
};
