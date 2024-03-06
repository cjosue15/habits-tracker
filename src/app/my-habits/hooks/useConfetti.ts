import confetti from "canvas-confetti";
import { useEffect, useState, RefObject, useCallback } from "react";

export const useConfetti = (
  ref: RefObject<HTMLLabelElement>,
  isAdding: boolean,
) => {
  const [done, setDone] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const confettiCreator = useCallback(
    async (event: MouseEvent) => {
      if (isShow) return;

      try {
        setIsShow(true);
        setDone(false);
        const { x, y } = event;
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        await confetti({
          angle: 120,
          particleCount: 60,
          spread: 50,
          origin: { y: y / height, x: x / width },
        });
      } finally {
        setIsShow(false);
        setDone(true);
      }
    },
    [isShow],
  );

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        isAdding &&
        ref.current &&
        ref.current.contains(event.target as HTMLLabelElement)
      ) {
        confettiCreator(event);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, confettiCreator, isAdding]);

  return { isShow, done };
};
