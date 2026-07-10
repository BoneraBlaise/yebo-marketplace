import React, { useState } from "react";
import { resolveCategoryPhoto, CATEGORY_FALLBACK_PHOTO } from "./categoryPhotoMap";
import "./homeCategories.css";

const HomeCategoryCard = ({ title, onClick }) => {
  const [photo, setPhoto] = useState(() => resolveCategoryPhoto(title));

  return (
    <button type="button" className="home-cat-card" onClick={onClick}>
      <div className="home-cat-card__media">
        <img
          src={photo}
          alt={`${title} — shop on Yebone`}
          className="home-cat-card__img"
          loading="lazy"
          decoding="async"
          onError={() => setPhoto(CATEGORY_FALLBACK_PHOTO)}
        />
        <div className="home-cat-card__overlay" aria-hidden="true" />
        <h3 className="home-cat-card__title">{title}</h3>
      </div>
    </button>
  );
};

export default HomeCategoryCard;
