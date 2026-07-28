import React, { useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineSparkles, HiOutlinePhotograph, HiOutlineCamera } from "react-icons/hi";
import { PreviewExperience } from "../../ai-experience-ui/components/preview/PreviewExperience";
import { Button } from "../ui";

const ProductTryOnModal = ({ open, onClose, productId, productName, userId }) => {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  if (!open) return null;

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[1.75rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl pdp-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tryon-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-t-[1.75rem] sm:rounded-t-[1.75rem]">
          <div className="flex items-center gap-2 min-w-0">
            <HiOutlineSparkles className="text-yebone-primary shrink-0" size={20} />
            <div className="min-w-0">
              <h2 id="tryon-modal-title" className="font-Poppins text-lg font-semibold dark:text-white truncate">
                See it on you
              </h2>
              {productName && (
                <p className="text-xs text-gray-500 truncate">{productName}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
            aria-label="Close"
          >
            <RxCross1 size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-yebone-primary/25 bg-yebone-primary/[0.04] hover:border-yebone-primary/50 transition"
            >
              <HiOutlinePhotograph className="text-yebone-primary" size={28} />
              <span className="text-sm font-semibold dark:text-white">Upload photo</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-yebone-primary/30 transition"
            >
              <HiOutlineCamera className="text-yebone-primary" size={28} />
              <span className="text-sm font-semibold dark:text-white">Use camera</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>

          {photoPreview && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-[4/5] max-h-48 sm:max-h-56 bg-gray-50 dark:bg-gray-800">
              <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
            </div>
          )}

          <PreviewExperience userId={userId || "guest"} productId={productId} />

          <Button variant="secondary" size="lg" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTryOnModal;
