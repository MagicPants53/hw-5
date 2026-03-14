import { useEffect, useCallback } from "react";

export function useLockScroll(
  isOpen: boolean,
  onClose: () => void,
  ref?: React.RefObject<HTMLElement | null>,
) {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref && ref.current && ref.current === event.target) {
        onClose();
      }
    },
    [onClose, ref],
  );

  const handleClickEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleClickEsc);

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.marginRight = scrollbarWidth + "px";
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleClickEsc);
      document.body.style.marginRight = "";
      document.body.style.overflowY = "";
    };
  }, [isOpen, handleClickOutside, handleClickEsc]);

  return ref;
}
