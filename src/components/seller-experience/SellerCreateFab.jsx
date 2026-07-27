import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useCreateExperience } from "./CreateExperienceContext";
import "./seller-experience.css";

/** Mobile-only floating create button — desktop uses header trigger */
const SellerCreateFab = () => {
  const { isSeller } = useSelector((state) => state.seller);
  const { openCreate } = useCreateExperience();

  if (!isSeller) return null;

  return (
    <button
      type="button"
      className="seller-xp-fab lg:hidden"
      onClick={() => openCreate()}
      aria-label="Create new listing"
      title="Create"
    >
      <AiOutlinePlus size={24} />
    </button>
  );
};

export default SellerCreateFab;
