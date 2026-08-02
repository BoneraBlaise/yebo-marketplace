import React, { useCallback, useRef, useState } from "react";
import { HiOutlinePhotograph, HiOutlineStar, HiOutlineTrash } from "react-icons/hi";
import InlineField from "./InlineField";
import {
  MAX_LISTING_PHOTOS,
  computeListingQuality,
} from "./listingWizardConfig";
import "./seller-experience.css";

const ListingMediaUploader = ({ values, setField, setValues, showError }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const inputRef = useRef(null);
  const dragIndexRef = useRef(null);

  const quality = computeListingQuality(values);

  const addFiles = useCallback(
    (files) => {
      const list = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
      if (!list.length) return;

      const remaining = MAX_LISTING_PHOTOS - (values.photos?.length || 0);
      const batch = list.slice(0, remaining);
      if (!batch.length) return;

      setUploadProgress(0);
      let loaded = 0;

      batch.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setValues((prev) => ({
              ...prev,
              photos: [...(prev.photos || []), reader.result],
            }));
            loaded += 1;
            setUploadProgress(Math.round((loaded / batch.length) * 100));
            if (loaded === batch.length) {
              setTimeout(() => setUploadProgress(null), 400);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [setValues, values.photos?.length]
  );

  const removePhoto = (index) => {
    setValues((prev) => {
      const next = prev.photos.filter((_, i) => i !== index);
      let coverIndex = prev.coverIndex;
      if (index === coverIndex) coverIndex = 0;
      else if (index < coverIndex) coverIndex -= 1;
      return { ...prev, photos: next, coverIndex: Math.min(coverIndex, Math.max(0, next.length - 1)) };
    });
  };

  const reorderPhotos = (from, to) => {
    if (from === to) return;
    setValues((prev) => {
      const next = [...prev.photos];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      let coverIndex = prev.coverIndex;
      if (from === prev.coverIndex) coverIndex = to;
      else if (from < prev.coverIndex && to >= prev.coverIndex) coverIndex -= 1;
      else if (from > prev.coverIndex && to <= prev.coverIndex) coverIndex += 1;
      return { ...prev, photos: next, coverIndex };
    });
  };

  return (
    <div className="listing-media">
      <InlineField label="Photos" required error={showError("photos")}>
        <div
          className={`listing-media__dropzone ${dragOver ? "is-dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <HiOutlinePhotograph size={28} className="listing-media__dropzone-icon" aria-hidden="true" />
          <p className="listing-media__dropzone-title">Drag photos here or tap to browse</p>
          <p className="listing-media__dropzone-hint">
            Up to {MAX_LISTING_PHOTOS} images · Drag to reorder · Tap star for cover
          </p>
          {uploadProgress != null && (
            <div className="listing-media__progress">
              <div className="listing-media__progress-bar" style={{ width: `${uploadProgress}%` }} />
              <span>Uploading {uploadProgress}%</span>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </InlineField>

      {values.photos?.length > 0 && (
        <div className="listing-media__grid">
          {values.photos.map((src, index) => (
            <div
              key={`${index}-${String(src).slice(0, 20)}`}
              className={`listing-media__thumb${values.coverIndex === index ? " is-cover" : ""}`}
              draggable
              onDragStart={() => {
                dragIndexRef.current = index;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndexRef.current != null) {
                  reorderPhotos(dragIndexRef.current, index);
                  dragIndexRef.current = null;
                }
              }}
            >
              <img src={src} alt="" />
              <button
                type="button"
                className="listing-media__cover-btn"
                onClick={() => setField("coverIndex", index)}
                title={values.coverIndex === index ? "Cover photo" : "Set as cover"}
              >
                <HiOutlineStar size={14} />
              </button>
              <button
                type="button"
                className="listing-media__remove-btn"
                onClick={() => removePhoto(index)}
                aria-label="Remove photo"
              >
                <HiOutlineTrash size={14} />
              </button>
              {values.coverIndex === index && (
                <span className="listing-media__cover-badge">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={`listing-media__quality listing-media__quality--${quality.level}`}>
        <span className="listing-media__quality-label">Listing quality</span>
        <strong>{quality.label}</strong>
        <span className="listing-media__quality-score">{quality.score}/100</span>
      </div>

      <div className="listing-media__video">
        <InlineField label="Video (optional)" hint="Upload a clip or paste a YouTube link">
          <input
            type="url"
            className="seller-xp-input dark:text-white"
            placeholder="https://youtube.com/watch?v=…"
            value={values.youtubeUrl}
            onChange={(e) => setField("youtubeUrl", e.target.value)}
          />
        </InlineField>
        <input
          type="file"
          accept="video/*"
          className="seller-xp-input dark:text-white mt-2"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.readyState === 2) setField("videoFile", reader.result);
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>
    </div>
  );
};

export default ListingMediaUploader;
