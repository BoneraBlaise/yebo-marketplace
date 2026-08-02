import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateExperience } from "../seller-experience/CreateExperienceContext";
import { CREATE_ACTIONS } from "../../navigation/createActions";

/** Desktop create popover — reuses shared create actions */
const CreateMenuPopover = ({ open, onClose, anchorRef, actions = CREATE_ACTIONS, title = "Create" }) => {
  const { openCreate } = useCreateExperience();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onDoc = (e) => {
      if (
        anchorRef?.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) {
        return;
      }
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const handlePick = (item) => {
    onClose();
    if (item.route) {
      navigate(item.route, item.state ? { state: item.state } : undefined);
      return;
    }
    window.requestAnimationFrame(() => openCreate(item.step));
  };

  return (
    <div ref={panelRef} className="create-menu-popover" role="menu" aria-label={title}>
      <p className="create-menu-popover__title">{title}</p>
      {actions.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className="create-menu-popover__row"
          onClick={() => handlePick(item)}
        >
          <span className="create-menu-popover__icon" aria-hidden="true">{item.icon}</span>
          <span>
            <span className="create-menu-popover__row-title">{item.title}</span>
            <span className="create-menu-popover__row-desc">{item.desc}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default CreateMenuPopover;
