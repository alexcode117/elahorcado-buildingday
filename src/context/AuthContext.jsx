import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children, storageKey = "elahorcado_user" }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  }, [user, storageKey]);

  const login = useCallback(async (username) => {
    // Normaliza y valida el nombre de usuario
    const normalized = username?.toString().trim().toLowerCase();
    if (!normalized) {
      const msg = "Por favor, ingresa un nombre de usuario de Hive.";
      setError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);

    // Comprueba la disponibilidad de Hive Keychain
    if (!window?.hive_keychain) {
      const msg =
        "La extensión Hive Keychain no está instalada o está deshabilitada.";
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    const message = `Autenticación Hive @${normalized} - ${Date.now()}`;

    // Envuelve el callback de Keychain en una Promise
    try {
      const response = await new Promise((resolve, reject) => {
        try {
          window.hive_keychain.requestSignBuffer(
            normalized,
            message,
            "Posting",
            (res) => {
              if (res && res.success) resolve(res);
              else
                reject(
                  new Error(
                    res?.message || "La autenticación fue cancelada o falló."
                  )
                );
            }
          );
        } catch (err) {
          reject(err);
        }
      });

      // Si la firma fue exitosa, establecemos el usuario
      const u = {
        username: normalized,
        keychain: true,
        keychainResponse: response,
      };
      setUser(u);
      return u;
    } catch (e) {
      setError(e?.message || "Error");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) { }
  }, [storageKey]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // For backwards compatibility, allow standalone usage by creating a local instance
    // but prefer to wrap the app with AuthProvider.
    // We'll throw a helpful error to prompt the developer.
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export default useAuth;
