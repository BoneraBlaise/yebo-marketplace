import React, { useEffect } from "react";

import { RxCross1, RxArrowLeft } from "react-icons/rx";

import { HiOutlineSparkles } from "react-icons/hi";

import { useAI } from "./core/AIContext";

import { useCreateExperience } from "../seller-experience/CreateExperienceContext";

import YEBOErrorState from "../../ai/components/YEBOErrorState";

import YEBOPanelIntelligence from "./intelligence/YEBOPanelIntelligence";

import YEBOChatComposer from "./YEBOChatComposer";

import "./core/ai.css";

import "../seller-experience/seller-experience.css";



const MODE_LABELS = {

  chat: null,

  search: "Smart Search",

  compare: "Compare Products",

  budget: "Budget Assistant",

  visual: "Visual Search",

  gift: "Gift Finder",

};



const AIPanel = () => {

  const {

    isPanelOpen,

    closePanel,

    shoppingMode,

    setShoppingMode,

    inputValue,

    setInputValue,

    sendMessage,

    isTyping,

    lastError,

    pendingAction,

    confirmPendingAction,

    cancelPendingAction,

    runSmartSearch,

  } = useAI();



  const { openCreate, isOpen: isCreateOpen } = useCreateExperience();



  useEffect(() => {

    if (!isPanelOpen || isCreateOpen) return undefined;

    const onKey = (e) => {

      if (e.key === "Escape") closePanel();

    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);

    return () => {

      document.body.style.overflow = "";

      window.removeEventListener("keydown", onKey);

    };

  }, [isPanelOpen, isCreateOpen, closePanel]);



  if (!isPanelOpen || isCreateOpen) return null;



  const isHome = shoppingMode === "chat";

  const modeLabel = MODE_LABELS[shoppingMode];



  const handleSearch = (query) => {

    const q = (query || inputValue).trim();

    if (!q) return;

    runSmartSearch(q);

  };



  const handleSend = () => {

    if (shoppingMode === "chat") sendMessage(inputValue);

  };



  const goHome = () => setShoppingMode("chat");



  return (

    <>

      <div className="ai-panel-overlay ai-panel-overlay--workspace" onClick={closePanel} aria-hidden />

      <aside

        className="ai-panel ai-panel--premium ai-panel--workspace"

        role="dialog"

        aria-modal="true"

        aria-label="YEBO Shopping Intelligence"

      >

        <div className="ai-panel__canvas">

          <header className="ai-panel__header">

            <div className="ai-panel__header-start">

              {!isHome ? (

                <button

                  type="button"

                  onClick={goHome}

                  className="ai-panel__back-btn"

                  aria-label="Back to YEBO home"

                >

                  <RxArrowLeft size={16} />

                  <span>Back</span>

                </button>

              ) : (

                <div className="ai-panel__header-meta">

                  <div className="ai-panel__header-icon">

                    <HiOutlineSparkles className="text-yebone-gold" size={14} />

                  </div>

                  <span className="ai-panel__header-title">YEBO</span>

                </div>

              )}

              {!isHome && modeLabel && (

                <span className="ai-panel__header-sub">{modeLabel}</span>

              )}

            </div>

            <button

              type="button"

              onClick={closePanel}

              className="ai-panel__close-btn"

              aria-label="Close YEBO assistant"

            >

              <RxCross1 size={16} />

            </button>

          </header>



          <div className="ai-panel__body yebone-premium-scroll">

            {lastError && (

              <YEBOErrorState error={lastError} onRetry={() => sendMessage(inputValue)} className="mb-3" />

            )}



            {pendingAction && (

              <div className="ai-panel__confirm">

                <p className="ai-panel__confirm-title">Confirmation required</p>

                <p className="ai-panel__confirm-copy">{pendingAction.summary}</p>

                <div className="flex gap-2">

                  <button type="button" onClick={confirmPendingAction} disabled={isTyping} className="ai-panel__confirm-yes">

                    Confirm

                  </button>

                  <button type="button" onClick={cancelPendingAction} disabled={isTyping} className="ai-panel__confirm-no">

                    Cancel

                  </button>

                </div>

              </div>

            )}



            {!isHome && <YEBOPanelIntelligence premium />}

            {isHome && (

              <YEBOPanelIntelligence premium showConversationOnly onSuggestion={sendMessage} />

            )}

          </div>



          <YEBOChatComposer

            shoppingMode={shoppingMode}

            inputValue={inputValue}

            setInputValue={setInputValue}

            onSend={handleSend}

            onSearch={handleSearch}

            isTyping={isTyping}

            onSetMode={setShoppingMode}

            onOpenCreate={openCreate}

          />

        </div>

      </aside>

    </>

  );

};



export default AIPanel;


