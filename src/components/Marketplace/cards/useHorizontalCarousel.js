import { useEffect } from "react";

const DRAG_THRESHOLD = 4;

/**
 * Premium horizontal carousel interactions: mouse drag, wheel, and trackpad.
 * Touch swipe is handled natively via overflow scrolling.
 */
const useHorizontalCarousel = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const state = {
      isDragging: false,
      hasDragged: false,
      startX: 0,
      scrollStart: 0,
    };

    const setDragging = (active) => {
      state.isDragging = active;
      el.classList.toggle("is-dragging", active);
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      state.isDragging = true;
      state.hasDragged = false;
      state.startX = e.pageX;
      state.scrollStart = el.scrollLeft;
      setDragging(true);
    };

    const onMouseMove = (e) => {
      if (!state.isDragging) return;
      const delta = e.pageX - state.startX;
      if (Math.abs(delta) > DRAG_THRESHOLD) {
        state.hasDragged = true;
      }
      if (state.hasDragged) {
        e.preventDefault();
        el.scrollLeft = state.scrollStart - delta;
      }
    };

    const endDrag = () => {
      if (!state.isDragging) return;
      setDragging(false);
      window.setTimeout(() => {
        state.hasDragged = false;
      }, 0);
    };

    const onWheel = (e) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX > absY) return;
      if (absY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const onClickCapture = (e) => {
      if (state.hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    el.addEventListener("mouseleave", endDrag);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      el.removeEventListener("mouseleave", endDrag);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("click", onClickCapture, true);
      el.classList.remove("is-dragging");
    };
  }, [ref]);
};

export default useHorizontalCarousel;
