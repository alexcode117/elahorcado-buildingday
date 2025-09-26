import "./AuthModal.css";

import { useState } from "react";
import ModalUI from "./ui/ModalUI";
import useAuth from "../context/AuthContext";
import { AuthForm } from "./AuthForm";

export const AuthModal = ({
  isOpen = false,
  onClose = () => {},
  icon = null,
  network = null,
}) => {
  const { user, login, logout, loading, error } = useAuth();
  const [feedback, setFeedback] = useState(null);

  // Intercepta el close: si no hay usuario autenticado, evita cerrar el modal
  const handleAttemptClose = () => {
    if (!user) {
      setFeedback({
        type: "error",
        message: "Debes autenticarte antes de cerrar este diálogo.",
      });
      return;
    }
    onClose();
  };

  const handleLogin = async (input) => {
    setFeedback(null);
    try {
      await login(input);
      setFeedback({ type: "success", message: `Conectado como ${input}` });
      // Cerrar el modal automáticamente después de login exitoso
      try {
        onClose();
      } catch (e) {
        // no bloquear si onClose falla
      }
    } catch (e) {
      setFeedback({
        type: "error",
        message: e.message || "Error al iniciar sesi\u00f3n",
      });
    }
  };

  const handleLogout = () => {
    logout();
    setFeedback({ type: "info", message: "Sesión cerrada" });
  };

  return (
    <ModalUI
      isOpen={isOpen}
      onClose={onClose}
      title="Autenticación"
      ariaLabel="Modal de autenticación">
      <div className="auth-modal-modal-body">
        <div className="auth-modal-identity">
          <div className="auth-modal-icon">
            {icon ? (
              typeof icon === "string" ? (
                <img src={icon} alt="icon" />
              ) : (
                icon
              )
            ) : (
              <div className="auth-modal-icon-placeholder">A</div>
            )}
          </div>
          <div className="auth-modal-identity-info">
            <div className="auth-modal-identity-name">
              {user?.username ?? "Invitado"}
            </div>
            <div className="auth-modal-identity-network muted">
              {network?.name ?? "Hive"}
            </div>
          </div>
        </div>

        {!user ? (
          <AuthForm
            onSubmit={handleLogin}
            error={error}
            feedback={feedback}
            loading={loading}
          />
        ) : (
          <div className="auth-logged">
            <div className="auth-modal-actions">
              <button className="btn ghost" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
            {feedback ? (
              <div className={`auth-feedback ${feedback.type}`}>
                {feedback.message}
              </div>
            ) : null}
          </div>
        )}

        <div className="auth-modal-modal-footer">
          <small className="muted"></small>
        </div>
      </div>
    </ModalUI>
  );
};

export default AuthModal;
