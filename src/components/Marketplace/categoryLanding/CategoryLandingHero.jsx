import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { typography } from "../../../design-system/typography";
import { CATEGORY_FALLBACK_PHOTO } from "../../Home/categoryPhotoMap";
import { formatProductCount } from "./categoryLandingUtils";
import "./categoryLanding.css";

const CategoryLandingHero = ({ context, count }) => {
  const [imageSrc, setImageSrc] = useState(context?.imageUrl || CATEGORY_FALLBACK_PHOTO);

  useEffect(() => {
    setImageSrc(context?.imageUrl || CATEGORY_FALLBACK_PHOTO);
  }, [context?.imageUrl, context?.title]);

  if (!context) return null;

  return (
    <section className="cat-landing-hero yebone-fade-up mb-6 lg:mb-8" aria-labelledby="category-landing-title">
      <div className="cat-landing-hero__inner">
        <div>
          <nav className="cat-landing-hero__breadcrumb" aria-label="Breadcrumb">
            {context.breadcrumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && <span aria-hidden="true">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to}>{crumb.label}</Link>
                ) : (
                  <span className={index === context.breadcrumbs.length - 1 ? "is-current" : ""}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <span className="cat-landing-hero__badge">Category</span>
          <h1 id="category-landing-title" className={`cat-landing-hero__title ${typography.heading}`}>
            {context.displayTitle || context.title}
          </h1>
          <p className="cat-landing-hero__desc">{context.description}</p>
          <p className="cat-landing-hero__count">{formatProductCount(count)}</p>
        </div>

        <div className="cat-landing-hero__visual" aria-hidden="true">
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            onError={() => setImageSrc(CATEGORY_FALLBACK_PHOTO)}
          />
        </div>
      </div>
    </section>
  );
};

export default CategoryLandingHero;
