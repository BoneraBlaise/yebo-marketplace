import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useAIOptional } from "../ai/core/AIContext";
import CreateExperienceModal from "./CreateExperienceModal";

const CreateExperienceContext = createContext(null);

export const useCreateExperience = () => {
  const ctx = useContext(CreateExperienceContext);
  return ctx || { openCreate: () => {}, isOpen: false };
};

/** Must render inside AIProvider for panel suspend/restore */
export const CreateExperienceProvider = ({ children }) => {
  const ai = useAIOptional();
  const [open, setOpen] = useState(false);
  const [initialStep, setInitialStep] = useState("pick");
  const [initialCategory, setInitialCategory] = useState(null);
  const onCompleteRef = useRef(null);
  const restorePanelRef = useRef(false);

  const openCreate = useCallback((type = "pick", onComplete, options = {}) => {
    if (ai?.isPanelOpen) {
      restorePanelRef.current = true;
      ai.closePanel();
    }

    const normalizedOptions = typeof onComplete === "object" && onComplete !== null && !options?.category
      ? onComplete
      : options;
    const callback = typeof onComplete === "function" ? onComplete : null;

    if (type === "product") {
      setInitialStep("product");
      setInitialCategory(null);
    } else if (type === "property" || type === "vehicle") {
      setInitialStep("property");
      setInitialCategory(normalizedOptions.category || (type === "vehicle" ? "cars" : null));
    } else {
      setInitialStep("pick");
      setInitialCategory(null);
    }

    onCompleteRef.current = callback;
    setOpen(true);
  }, [ai]);

  const closeCreate = useCallback(() => {
    setOpen(false);
    setInitialStep("pick");
    setInitialCategory(null);
    onCompleteRef.current = null;
    if (restorePanelRef.current) {
      restorePanelRef.current = false;
      window.requestAnimationFrame(() => ai?.openPanel?.());
    }
  }, [ai]);

  const handleComplete = useCallback(() => {
    onCompleteRef.current?.();
    closeCreate();
  }, [closeCreate]);

  const value = useMemo(
    () => ({ openCreate, closeCreate, isOpen: open }),
    [openCreate, closeCreate, open]
  );

  return (
    <CreateExperienceContext.Provider value={value}>
      {children}
      <CreateExperienceModal
        open={open}
        onClose={closeCreate}
        onComplete={handleComplete}
        initialStep={initialStep}
        initialCategory={initialCategory}
      />
    </CreateExperienceContext.Provider>
  );
};

export default CreateExperienceContext;
