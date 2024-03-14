import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const Modal = ({ children, isOpen }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [isOpen]);

  return (
    isOpen &&
    createPortal(
      <ModalContent isOpen={isOpen}>{children}</ModalContent>,
      document.body,
    )
  );
};

export const ModalContent = ({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  return (
    <div>
      <div
        data-state={isOpen ? "open" : "close"}
        className="group fixed h-screen w-screen top-0 left-0 z-40 bg-black/60 group-data-[state=open]:animate-backdrop-in"
      ></div>
      <div
        className="group z-50 h-screen w-screen left-0 top-0 fixed overflow-auto flex justify-center items-center"
        data-state={isOpen ? "open" : "close"}
      >
        <div
          className="bg-secondary shadow-appShadow 
          relative rounded-md min-w-96 p-6 mx-6
          group-data-[state=open]:animate-dialog-in group-data-[state=close]:animate-dialog-out"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
