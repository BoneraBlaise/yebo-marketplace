import { useEffect } from "react";

/** Click outside + ESC for header dropdowns (Phase 8H.11) */
const useHeaderDropdown = (open, onClose, containerRef) => {
  useEffect(() => {
    if (!open) return undefined;

    const onMouseDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, containerRef]);
};

export default useHeaderDropdown;
