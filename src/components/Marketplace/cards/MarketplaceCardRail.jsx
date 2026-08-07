import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import useHorizontalCarousel from "./useHorizontalCarousel";

const SCROLL_STEP_RATIO = 0.72;

const MarketplaceCardRail = memo(({
  children,
  className = "",
  itemClassName = "",
  "aria-label": ariaLabel = "Product carousel",
}) => {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  useHorizontalCarousel(railRef);

  const updateScrollState = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return undefined;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateScrollState)
      : null;
    observer?.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer?.disconnect();
    };
  }, [updateScrollState, children]);

  const scrollByStep = (direction) => {
    const el = railRef.current;
    if (!el) return;
    const step = el.clientWidth * SCROLL_STEP_RATIO;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div
      className={classNames("mpc-rail-wrap", {
        "mpc-rail-wrap--start": canScrollLeft,
        "mpc-rail-wrap--end": canScrollRight,
      })}
    >
      <button
        type="button"
        className="mpc-rail__arrow mpc-rail__arrow--prev"
        aria-label="Scroll previous"
        onClick={() => scrollByStep(-1)}
        disabled={!canScrollLeft}
      >
        <MdChevronLeft size={22} />
      </button>

      <div
        ref={railRef}
        className={classNames("mpc-rail mpc-rail--carousel mpc-rail--peek hide-scrollbar mpc-fade-in", className)}
        role="list"
        aria-label={ariaLabel}
      >
        {React.Children.map(children, (child, index) =>
          child ? (
            <div
              key={child.key ?? index}
              role="listitem"
              className={classNames("mpc-rail__item", itemClassName)}
            >
              {child}
            </div>
          ) : null
        )}
      </div>

      <button
        type="button"
        className="mpc-rail__arrow mpc-rail__arrow--next"
        aria-label="Scroll next"
        onClick={() => scrollByStep(1)}
        disabled={!canScrollRight}
      >
        <MdChevronRight size={22} />
      </button>
    </div>
  );
});

MarketplaceCardRail.displayName = "MarketplaceCardRail";

export default MarketplaceCardRail;
