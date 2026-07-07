/** Accessibility utilities — Phase 8G */

export const a11yProps = {
  button: (label) => ({ role: "button", "aria-label": label, tabIndex: 0 }),
  dialog: (label) => ({ role: "dialog", "aria-modal": true, "aria-label": label }),
  alert: (live = "polite") => ({ role: "alert", "aria-live": live }),
  navigation: (label) => ({ role: "navigation", "aria-label": label }),
};

export const focusRingClass = "focus:outline-none focus-visible:ring-2 focus-visible:ring-yebone-primary focus-visible:ring-offset-2";

export const trapFocus = (container) => {
  if (!container) return () => {};
  const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handler = (e) => {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  container.addEventListener("keydown", handler);
  first?.focus();
  return () => container.removeEventListener("keydown", handler);
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const contrastRatio = (fg, bg) => {
  const luminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 255) / 255;
    const g = ((rgb >> 8) & 255) / 255;
    const b = (rgb & 255) / 255;
    const [rs, gs, bs] = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  try {
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  } catch {
    return 4.5;
  }
};

export default { a11yProps, focusRingClass, trapFocus, prefersReducedMotion, contrastRatio };
