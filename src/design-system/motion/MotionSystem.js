import { animationTokens } from "../tokens";
import { prefersReducedMotion } from "../accessibility";

/** Motion System — Phase 8G */
export const motionClasses = {
  pageTransition: "transition-all duration-300 ease-in-out motion-safe:animate-in",
  dialog: "transition-all duration-300 ease-out motion-safe:data-[state=open]:animate-in",
  toast: "transition-transform duration-200 ease-out",
  cardHover: "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
  loading: "animate-pulse",
  progress: "transition-all duration-500 ease-out",
  micro: "transition-colors duration-150",
  theme: "transition-[background-color,border-color,color,box-shadow] duration-300 ease-in-out",
  skeleton: "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] motion-safe:animate-[shimmer_1.5s_ease-in-out_infinite]",
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
