import toast from "react-hot-toast";

type ToastType = "success" | "error" | "warning";

export const notify = (message: string, type?: ToastType) => {
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.error(message);
    default:
      return toast(message);
  }
};
