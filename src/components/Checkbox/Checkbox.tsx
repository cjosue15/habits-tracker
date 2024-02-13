import { ChangeEvent } from "react";

let checkboxId = 0;

export type CheckboxProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export const Checkbox = (props: CheckboxProps) => {
  checkboxId++;
  const { checked, onChange, label } = props;
  return (
    <label
      className={`${props.className ?? ""} ${label ? "gap-y-4" : ""}`}
      htmlFor={`${checkboxId}-checkbox`}
    >
      <div
        className={`
          size-5 rounded text-white cursor-pointer border flex items-center justify-center 
          ${checked ? "bg-green-500 border-green-500 hover:bg-green-500" : "border-gray-100 hover:bg-black"}
        `}
      >
        {checked && <CheckIcon />}
      </div>
      <input
        id={`${checkboxId}-checkbox`}
        checked={checked}
        type="checkbox"
        style={{ clip: "rect(0 0 0 0)" }}
        className="border-0 h-[1px] -m-[1px] overflow-hidden p-0 absolute w-[1px] whitespace-normal"
        onChange={(event) => onChange(event)}
      />
      {label && <span className="text-xs">{label}</span>}
    </label>
  );
};

const CheckIcon = () => {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
    >
      <title>Check Icon</title>
      <path
        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
