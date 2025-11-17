import { useToast } from "../../hooks/useToast";
import "./Toast.css";

export default function Toast() {
  const { toast, showToast } = useToast();

  if (!toast) return null;

  return (
    <div
      className="toast-notification"
      onClick={() => showToast("")}
      role="alert"
    >
      <span className="toast-icon">✔</span>
      <span className="toast-message">{toast}</span>
    </div>
  );
}
