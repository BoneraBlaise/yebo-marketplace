import React, { useState } from "react";
import classNames from "classnames";
import { resolveCategoryPhoto } from "./categoryPhotoMap";

/**
 * Category photograph — exact title mapping only (no icons or illustrations).
 */
const CategoryImage = ({ src, title, className }) => {
  const [photo, setPhoto] = useState(() => resolveCategoryPhoto(title, src));

  return (
    <img
      src={photo}
      alt={`${title} — Yebone category`}
      className={classNames("home-cat-card__img", className)}
      onError={() => setPhoto(resolveCategoryPhoto(title))}
      loading="lazy"
      decoding="async"
    />
  );
};

export default CategoryImage;
