import { useState } from "react";
import "./AuthForm.css";
export const AuthForm = ({ loading, error, feedback, onSubmit }) => {
  const [input, setInput] = useState("");

  return (
    <div className="auth-form">
      <label htmlFor="auth-username">Nombre de usuario (Hive)</label>
      <input
        id="auth-username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="ej: miguel"
      />

      <button
        className="btn primary"
        onClick={() => onSubmit(input)}
        disabled={loading}>
        {loading ? "Conectando..." : "Iniciar sesión"}
      </button>

      {error ? <div className="auth-error">{error}</div> : null}
      {feedback ? (
        <div className={`auth-feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      ) : null}
    </div>
  );
};
