import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useCreateExperience } from "./CreateExperienceContext";
import "./seller-experience.css";

/** Header create button — desktop placement between My Shop and Wishlist */
const SellerCreateTrigger = ({ className = "" }) => {
  const { openCreate } = useCreateExperience();

  return (
    <button
      type="button"
      className={`seller-xp-header-btn ${className}`}
      onClick={() => openCreate()}
      aria-label="Create new listing"
      title="Create"
    >
      <AiOutlinePlus size={20} />
    </button>
  );
};

export default SellerCreateTrigger;
