import React from "react";
import "./WebsiteMessage.css";

function WebsiteMessage({
  message,
  type = "success",
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div className="website-message-overlay">
      <div className={`website-message-box ${type}`}>

        <div className="website-message-icon">
          {type === "success" && "✓"}
          {type === "error" && "!"}
          {type === "warning" && "!"}
        </div>

        <div className="website-message-content">
          <h3>
            {type === "success"
              ? "Success"
              : type === "error"
              ? "Something went wrong"
              : "Attention"}
          </h3>

          <p>{message}</p>
        </div>

        <button
          type="button"
          className="website-message-button"
          onClick={onClose}
        >
          OK
        </button>

      </div>
    </div>
  );
}

export default WebsiteMessage;