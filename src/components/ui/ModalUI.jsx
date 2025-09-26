import { useEffect, useRef } from "react";
import "./ModalUI.css";
import Button from "./Button";

export const ModalUI = ({
  isOpen = false,
  onClose = () => {},
  className = "",
  title = "",
  showClose = true,
  children,
  ariaLabel,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen) {
      if (typeof dialog.showModal === "function") {
        try {
          dialog.showModal();
        } catch (e) {}
      }
      document.body.style.overflow = "hidden";
    } else {
      try {
        if (typeof dialog.close === "function") dialog.close();
      } catch (e) {}
      document.body.style.overflow = "";
    }

    return () => {
      try {
        if (dialog && typeof dialog.close === "function") dialog.close();
      } catch (e) {}
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <dialog
      ref={ref}
      className={`modal-ui ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}>
      <div className="modal-ui-inner">
        <header className="modal-ui-header">
          {title ? <h3 className="modal-ui-title">{title}</h3> : null}
          {showClose && (
            <Button
              variant={"primary"}
              className="modal-ui-close"
              aria-label="Cerrar"
              onClick={onClose}>
              ×
            </Button>
          )}
        </header>
        <div className="modal-ui-body">{children}</div>
      </div>
    </dialog>
  );
};

export default ModalUI;
