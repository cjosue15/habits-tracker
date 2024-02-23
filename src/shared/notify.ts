import toast, { Renderable, ValueOrFunction } from "react-hot-toast";

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

type msgType = {
  loading: Renderable;
  success: ValueOrFunction<Renderable, any>;
  error: ValueOrFunction<Renderable, any>;
};

export const notifyPromise = async (promise: Promise<any>, msgs: msgType) => {
  return toast.promise(promise, msgs);
};
