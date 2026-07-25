import React from "react";
import ShopEmptyState from "./ShopEmptyState";

const GALLERY_LABELS = {
  storefront: "Storefront",
  warehouse: "Warehouse",
  office: "Office",
  certificate: "Certificate",
  team: "Team",
  other: "Gallery",
};

const ShopGallery = ({ gallery = [] }) => {
  if (!gallery.length) {
    return (
      <ShopEmptyState
        icon="🖼"
        title="No gallery images"
        description="The seller hasn't uploaded storefront photos yet."
      />
    );
  }

  return (
    <section aria-label="Shop gallery">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Gallery</h2>
      <div className="shop-gallery">
        {gallery.map((item, index) => (
          <figure key={item.public_id || index} className="shop-gallery__item">
            <img
              src={item.url}
              alt={item.caption || GALLERY_LABELS[item.type] || "Shop photo"}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </section>
  );
};

export default ShopGallery;
