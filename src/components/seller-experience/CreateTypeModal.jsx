import React from "react";
import CreateExperienceModal from "./CreateExperienceModal";

/** @deprecated Use CreateExperienceModal via CreateExperienceProvider */
const CreateTypeModal = ({ open, onClose }) => (
  <CreateExperienceModal open={open} onClose={onClose} initialStep="pick" />
);

export default CreateTypeModal;
