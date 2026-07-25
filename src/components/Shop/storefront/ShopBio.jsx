import React, { useState } from "react";

const ShopBio = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text?.trim()) return null;

  const needsExpand = text.length > 120;

  return (
    <div className="shop-profile__bio">
      <p className={expanded ? "shop-profile__bio-text is-expanded" : "shop-profile__bio-text"}>
        {text}
      </p>
      {needsExpand && !expanded && (
        <button
          type="button"
          className="shop-profile__bio-more"
          onClick={() => setExpanded(true)}
        >
          Read more
        </button>
      )}
    </div>
  );
};

export default ShopBio;
