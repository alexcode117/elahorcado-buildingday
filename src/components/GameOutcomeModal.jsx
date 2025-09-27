
import ModalUI from "./ui/ModalUI";
import Button from "./ui/Button";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";

const GameOutcomeModal = ({ isOpen, onClose }) => {
  const { currentGame, startNewGame, hideOutcome, setCurrentGame } = useGame();
  const { user } = useAuth();

  if (!currentGame) return null;

  const player = currentGame.currentPlayer;
  const won =
    player && !currentGame.masked.includes("_") && currentGame.revealed;
  const lost =
    player &&
    player.wrong >= currentGame.maxTriesByPlayer &&
    currentGame.revealed;

  const message = won
    ? `Has ganado 🎉 — palabra: ${currentGame.word}`
    : lost
      ? `Has perdido 😢 — palabra: ${currentGame.word}`
      : "Partida finalizada";

  const handlePlayAgain = async () => {
    await startNewGame(user?.username ?? null);
    hideOutcome();
    if (onClose) onClose();
  };

  const handleBackToMenu = () => {
    // Reset game and hide outcome to show menu
    setCurrentGame(null);
    hideOutcome();
    if (onClose) onClose();
  };

  return (
    <ModalUI isOpen={isOpen} title={won ? "¡Ganaste!" : "Partida terminada"}>
      <div style={{ padding: 12 }}>
        <p>{message}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button variant="primary" onClick={handlePlayAgain}>
            Jugar de nuevo
          </Button>
          <Button variant="ghost" onClick={handleBackToMenu}>
            Volver al menú
          </Button>
        </div>
      </div>
    </ModalUI>
  );
};

export default GameOutcomeModal;
