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
  const onCompleteRef = useRef(null);
  const restorePanelRef = useRef(false);

  const openCreate = useCallback((type = "pick", onComplete) => {
    if (ai?.isPanelOpen) {
      restorePanelRef.current = true;
      ai.closePanel();
    }
    setInitialStep(type === "product" || type === "property" ? type : "pick");
    onCompleteRef.current = typeof onComplete === "function" ? onComplete : null;
    setOpen(true);
  }, [ai]);

  const closeCreate = useCallback(() => {
    setOpen(false);
    setInitialStep("pick");
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
      <CreateExperienceModal open={open} onClose={closeCreate} onComplete={handleComplete} initialStep={initialStep} />
    </CreateExperienceContext.Provider>
  );
};

export default CreateExperienceContext;
