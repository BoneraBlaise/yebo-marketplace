import React, { useState, useCallback, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineExpand } from "react-icons/ai";

const ProductGallery = ({ images = [], select, setSelect }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState({});
  const touchStartX = useRef(null);

  const safeImages = images?.length ? images : [{ url: "" }];
  const current = select ?? 0;

  const goTo = useCallback(
    (index) => {
      if (index < 0) setSelect(safeImages.length - 1);
      else if (index >= safeImages.length) setSelect(0);
      else setSelect(index);
    },
    [safeImages.length, setSelect]
  );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current - 1 : current + 1);
    touchStartX.current = null;
  };

  const mainImage = safeImages[current]?.url;

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-5 lg:gap-6 yebone-fade-up">
        {/* Thumbnails */}
        <div className="flex lg:flex-col gap-2.5 lg:gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[540px] hide-scrollbar lg:w-[76px] shrink-0 px-1">
          {safeImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelect(index)}
              className={`relative shrink-0 w-[68px] h-[68px] lg:w-[72px] lg:h-[72px] rounded-2xl overflow-hidden transition-all duration-300 ${
                current === index
                  ? "ring-2 ring-yebone-primary ring-offset-2 ring-offset-yebone-light-gray dark:ring-offset-gray-950 shadow-lg shadow-yebone-primary/25 scale-[1.03]"
                  : "ring-1 ring-gray-200/80 dark:ring-gray-700 opacity-75 hover:opacity-100 hover:ring-yebone-primary/40"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
            >
              {!loaded[index] && <div className="absolute inset-0 yebone-skeleton" />}
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover yebone-img-fade"
                loading="lazy"
                onLoad={() => setLoaded((p) => ({ ...p, [index]: true }))}
              />
            </button>
          ))}
        </div>

        {/* Hero frame */}
        <div
          className="relative flex-1 rounded-[1.75rem] lg:rounded-[2rem] overflow-hidden yebone-surface"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yebone-primary/[0.04] via-transparent to-yebone-gold/[0.06] pointer-events-none" />
          <div className="absolute inset-0 yebone-glass pointer-events-none opacity-40" />

          {!loaded[`main-${current}`] && (
            <div className="absolute inset-0 yebone-skeleton z-0" />
          )}

          <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden cursor-zoom-in group m-3 lg:m-5 rounded-2xl lg:rounded-3xl bg-white/50 dark:bg-gray-900/40 shadow-inner">
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-full object-contain pdp-gallery-zoom yebone-img-fade p-4 lg:p-8"
              onLoad={() => setLoaded((p) => ({ ...p, [`main-${current}`]: true }))}
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full yebone-glass bg-white/80 dark:bg-gray-900/80 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 yebone-btn-lift border border-white/60 dark:border-gray-700"
              aria-label="Open fullscreen"
            >
              <AiOutlineExpand size={18} className="text-yebone-primary" />
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image fullscreen"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition yebone-btn-lift"
            aria-label="Close"
          >
            <RxCross1 size={22} />
          </button>
          <img
            src={mainImage}
            alt="Product fullscreen"
            className="max-w-full max-h-[90vh] object-contain yebone-img-fade rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {safeImages.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelect(i);
                  }}
                  className={`w-14 h-14 rounded-xl overflow-hidden ring-2 transition ${
                    current === i ? "ring-yebone-gold scale-105" : "ring-white/25 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
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
