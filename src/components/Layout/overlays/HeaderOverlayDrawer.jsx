import React, { memo, useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import useHeaderOverlay from "./useHeaderOverlay";

const HeaderOverlayDrawer = memo(({
  open,
  onClose,
  title,
  icon: Icon,
  ariaLabel,
  children,
  footer,
  badge,
}) => {
  const closeRef = useRef(null);
  useHeaderOverlay(open, onClose);

  useEffect(() => {
    if (open && closeRef.current) {
      closeRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="yebone-header-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
    >
      <button
        type="button"
        className="yebone-header-drawer__backdrop"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div className="yebone-header-drawer__panel">
        <div className="yebone-header-drawer__header">
          <div className="yebone-header-drawer__title-wrap">
            {Icon && <Icon size={22} className="yebone-header-drawer__icon" aria-hidden="true" />}
            <h2 className="yebone-header-drawer__title">
              {title}
              {badge ? <span className="yebone-header-drawer__badge">{badge}</span> : null}
            </h2>
          </div>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            className="yebone-header-drawer__close"
            aria-label="Close"
          >
            <RxCross1 size={20} />
          </button>
        </div>

        <div className="yebone-header-drawer__body">{children}</div>

        {footer ? <div className="yebone-header-drawer__footer">{footer}</div> : null}
      </div>
    </div>
  );
});

HeaderOverlayDrawer.displayName = "HeaderOverlayDrawer";

export default HeaderOverlayDrawer;
