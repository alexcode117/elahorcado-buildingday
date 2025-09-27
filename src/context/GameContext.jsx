import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Game as GameClass, Player } from "../logic/game";

const GameContext = createContext(null);

export const GameProvider = ({ children, storageKey = "current_game" }) => {
  const [currentGame, setCurrentGame] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Restaurar Set
      parsed.used = new Set(parsed.used);
      return parsed;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentGame) {
        // Al serializar, convertir Set a array
        const toSave = { ...currentGame, used: Array.from(currentGame.used) };
        localStorage.setItem(storageKey, JSON.stringify(toSave));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) { }
  }, [currentGame, storageKey]);

  // Control para mostrar el modal de resultado (win/lose)
  const [outcomeVisible, setOutcomeVisible] = useState(false);

  const startNewGame = useCallback(async (username = null) => {
    const game = new GameClass();
    if (username) {
      game.currentPlayer = new Player(username);
    }
    const newGameState = await GameClass.startGame(game);
    setCurrentGame(newGameState);
    return newGameState;
  }, []);

  const press = useCallback(
    async (letter) => {
      if (!currentGame) return null;
      const updated = await GameClass.press(currentGame, letter);
      setCurrentGame(updated);
      if (updated?.revealed) setOutcomeVisible(true);
      return updated;
    },
    [currentGame]
  );

  const saveGame = useCallback(async () => {
    if (!currentGame) return;
    await GameClass.saveGame(currentGame);
    // ya persistido en localStorage por efecto
  }, [currentGame]);

  const loadGame = useCallback(async (gameId) => {
    const g = await GameClass.loadGame(gameId);
    if (g) setCurrentGame(g);
    return g;
  }, []);

  const loseGame = useCallback(async () => {
    if (!currentGame) return null;
    const g = await GameClass.loseGame(currentGame);
    setCurrentGame(g);
    setOutcomeVisible(true);
    return g;
  }, [currentGame]);

  const winGame = useCallback(async () => {
    if (!currentGame) return null;
    const g = await GameClass.winGame(currentGame);
    setCurrentGame(g);
    setOutcomeVisible(true);
    return g;
  }, [currentGame]);

  const hideOutcome = useCallback(() => setOutcomeVisible(false), []);

  const value = {
    currentGame,
    startNewGame,
    press,
    saveGame,
    loadGame,
    loseGame,
    winGame,
    outcomeVisible,
    hideOutcome,
    setCurrentGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};

export default useGame;
