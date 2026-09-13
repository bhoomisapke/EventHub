import React, { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import "./Notification.css";

function Notification({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={21} />,
    error: <XCircle size={21} />,
    warning: <AlertTriangle size={21} />,
    info: <Info size={21} />,
  };

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">
        {icons[type]}
      </div>

      <div className="notification-content">
        <strong>
          {type === "success" && "Success"}
          {type === "error" && "Error"}
          {type === "warning" && "Warning"}
          {type === "info" && "Info"}
        </strong>

        <span>{message}</span>
      </div>

      <button
        type="button"
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default Notification;