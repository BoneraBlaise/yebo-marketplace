import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineExpand } from "react-icons/ai";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { optimizeProductImage } from "../../utils/productImageUtils";
import "./product-details.css";

const ZOOM_SCALE = 2.25;

const ProductGallery = ({ images = [], select, setSelect }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState({});
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [mobileZoomed, setMobileZoomed] = useState(false);
  const [heroFade, setHeroFade] = useState(true);
  const touchStartX = useRef(null);
  const lastTap = useRef(0);
  const pinchStartDist = useRef(null);
  const heroRef = useRef(null);
  const isDesktop = useRef(typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);

  const safeImages = images?.length ? images : [{ url: "" }];
  const current = select ?? 0;
  const mainImage = safeImages[current]?.url;

  const heroSrc = useMemo(() => optimizeProductImage(mainImage, "hero"), [mainImage]);
  const zoomSrc = useMemo(() => optimizeProductImage(mainImage, "zoom"), [mainImage]);
  const lightboxSrc = useMemo(() => optimizeProductImage(mainImage, "lightbox"), [mainImage]);

  const goTo = useCallback(
    (index) => {
      if (index < 0) setSelect(safeImages.length - 1);
      else if (index >= safeImages.length) setSelect(0);
      else setSelect(index);
      setMobileZoomed(false);
    },
    [safeImages.length, setSelect]
  );

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, current, goTo]);

  useEffect(() => {
    setMobileZoomed(false);
    setZoomActive(false);
    setHeroFade(false);
    const frame = requestAnimationFrame(() => setHeroFade(true));
    return () => cancelAnimationFrame(frame);
  }, [current]);

  const handleMouseMove = (e) => {
    if (!heroRef.current || !isDesktop.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const getTouchDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getTouchDistance(e.touches);
      return;
    }
    touchStartX.current = e.touches[0].clientX;

    const now = Date.now();
    if (now - lastTap.current < 300) {
      setMobileZoomed((z) => !z);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDist.current) {
      const dist = getTouchDistance(e.touches);
      if (dist > pinchStartDist.current * 1.15) setMobileZoomed(true);
      if (dist < pinchStartDist.current * 0.85) setMobileZoomed(false);
      return;
    }
    if (mobileZoomed) return;
    if (touchStartX.current == null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 10) e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) pinchStartDist.current = null;
    if (mobileZoomed || touchStartX.current == null) {
      touchStartX.current = null;
      return;
    }
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current - 1 : current + 1);
    touchStartX.current = null;
  };

  return (
    <>
      <div className="pdp-gallery flex flex-col-reverse lg:flex-row gap-3 lg:gap-4 yebone-fade-up">
        {/* Thumbnails */}
        <div className="pdp-gallery__thumbs flex lg:flex-col gap-2 lg:gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[min(80vh,860px)] hide-scrollbar lg:w-[68px] px-0.5">
          {safeImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelect(index)}
              className={`relative shrink-0 w-16 h-16 lg:w-[68px] lg:h-[68px] rounded-xl overflow-hidden transition-all duration-300 ${
                current === index
                  ? "ring-2 ring-yebone-primary ring-offset-2 ring-offset-yebone-light-gray dark:ring-offset-gray-950 shadow-lg shadow-yebone-primary/25 scale-[1.03]"
                  : "ring-1 ring-gray-200/80 dark:ring-gray-700 opacity-75 hover:opacity-100 hover:ring-yebone-primary/40"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
            >
              {!loaded[index] && <div className="absolute inset-0 yebone-skeleton" />}
              <img
                src={optimizeProductImage(img.url, "thumb")}
                alt=""
                className="pdp-gallery-thumb-img yebone-img-fade"
                loading="lazy"
                onLoad={() => setLoaded((p) => ({ ...p, [index]: true }))}
              />
            </button>
          ))}
        </div>

        {/* Hero — full column width; zoom pane floats beside on hover */}
        <div className="pdp-gallery__main">
          <div
            className="pdp-gallery__surface relative yebone-surface"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yebone-primary/[0.03] via-transparent to-yebone-gold/[0.04] pointer-events-none rounded-[inherit]" />

            {!loaded[`main-${current}`] && (
              <div className="absolute inset-0 yebone-skeleton z-0 rounded-[inherit]" />
            )}

            <div
              ref={heroRef}
              className={`pdp-gallery-hero group ${
                mobileZoomed ? "pdp-gallery-hero--mobile-zoom" : ""
              }`}
              onMouseEnter={() => isDesktop.current && setZoomActive(true)}
              onMouseLeave={() => setZoomActive(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                key={heroSrc}
                src={heroSrc}
                alt="Product"
                className={`pdp-gallery-hero-img yebone-img-fade transition-opacity duration-300 ${
                  heroFade ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded((p) => ({ ...p, [`main-${current}`]: true }))}
                draggable={false}
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full yebone-glass bg-white/80 dark:bg-gray-900/80 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 yebone-btn-lift border border-white/60 dark:border-gray-700"
                aria-label="Open fullscreen"
              >
                <AiOutlineExpand size={17} className="text-yebone-primary" />
              </button>
            </div>
          </div>

          {/* Side zoom — positioned in column gap, does not shrink hero */}
          <div
            className={`pdp-gallery-zoom-wrap hidden lg:block ${zoomActive ? "is-active" : ""}`}
            aria-hidden={!zoomActive}
          >
            <div
              className="pdp-gallery-zoom-pane yebone-surface"
              style={{
                backgroundImage: zoomSrc ? `url(${zoomSrc})` : undefined,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: `${ZOOM_SCALE * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 pdp-lightbox-enter"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image fullscreen"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition yebone-btn-lift z-10"
            aria-label="Close"
          >
            <RxCross1 size={22} />
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(current - 1);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
                aria-label="Previous image"
              >
                <IoChevronBack size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(current + 1);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
                aria-label="Next image"
              >
                <IoChevronForward size={22} />
              </button>
            </>
          )}

          <img
            key={`lb-${current}`}
            src={lightboxSrc}
            alt="Product fullscreen"
            className="max-w-full max-h-[92vh] pdp-lightbox-image yebone-img-fade rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {safeImages.length > 1 && (
            <div className="absolute bottom-6 flex gap-2 max-w-[90vw] overflow-x-auto hide-scrollbar px-2">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelect(i);
                  }}
                  className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden ring-2 transition ${
                    current === i ? "ring-yebone-gold scale-105" : "ring-white/25 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={optimizeProductImage(img.url, "thumb")}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductGallery;
