import { animationTokens } from "../tokens";
import { prefersReducedMotion } from "../accessibility";

/** Motion System — Phase 8G */
export const motionClasses = {
  pageTransition: "transition-opacity duration-300 ease-in-out",
  dialog: "transition-all duration-300 ease-out data-[state=open]:animate-in",
  toast: "transition-transform duration-200 ease-out",
  cardHover: "transition-shadow duration-200 hover:shadow-lg",
  loading: "animate-pulse",
  progress: "transition-all duration-500 ease-out",
  micro: "transition-colors duration-150",
};

export const getMotionDuration = (key = "normal") => {
  if (prefersReducedMotion()) return "0ms";
  return animationTokens.duration[key] || animationTokens.duration.normal;
};

export const motionStyle = (key = "normal") => ({
  transitionDuration: getMotionDuration(key),
  transitionTimingFunction: animationTokens.easing.default,
});

export default { motionClasses, getMotionDuration, motionStyle };
