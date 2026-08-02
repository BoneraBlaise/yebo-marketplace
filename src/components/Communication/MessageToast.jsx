import React from "react";
import { IoChatbubblesOutline } from "react-icons/io5";

const MessageToast = ({ senderName, preview, avatarUrl, onOpen, closeToast }) => (
  <button
    type="button"
    className="mc-message-toast"
    onClick={() => {
      onOpen?.();
      closeToast?.();
    }}
  >
    <div className="mc-message-toast__avatar">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" />
      ) : (
        <IoChatbubblesOutline aria-hidden="true" />
      )}
    </div>
    <div className="mc-message-toast__body">
      <strong>{senderName || "New message"}</strong>
      <p>{preview || "You have a new message"}</p>
    </div>
  </button>
);

export default MessageToast;
