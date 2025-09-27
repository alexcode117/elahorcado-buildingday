import { useEffect, useRef, useState } from "react";
import "./index.css";
import "./blockchain/blockchain";
import { hiveClient } from "./blockchain/blockchain";

import { AuthModal } from "./components/AuthModal";
import { useGame } from "./context/GameContext";
import { useAuth } from "./context/AuthContext";

import GameOutcomeModal from "./components/GameOutcomeModal";
import Menu from "./components/Menu";
import GameBoard from "./components/GameBoard";

export default function App() {
  const {
    currentGame,
    startNewGame,
    press,
    loseGame,
    outcomeVisible,
    hideOutcome,
  } = useGame();
  const { user } = useAuth();

  const keyboardRef = useRef(null);
  const [authOpen, setAuthOpen] = useState(false);

  async function handleStartNewGame() {
    if (currentGame) {
      console.error("Ya tiene un juego iniciado");
      return;
    }
    // Requerir autenticación: si no hay usuario, abrir modal de auth
    if (!user) {
      setAuthOpen(true);
      return;
    }
    await startNewGame(user?.username ?? null);
  }

  // Maneja el caso de derrota
  async function handleLose() {
    try {
      await loseGame();
    } catch (e) {
      console.error("Error al rendirse:", e);
    }
  }

  // Revela la palabra manualmente (botón "Mostrar")
  // async function reveal() {
  //   await currentGame?.reveal();
  // }

  // Da una pista revelando una letra aleatoria no descubierta
  function hint() {
    // if (revealed) return;
    // const unrevealed = masked
    //   .map((m, i) => (m === "_" ? i : -1))
    //   .filter((i) => i >= 0);
    // if (!unrevealed.length) return;
    // const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    // press(word[idx]);
    // logEvent('hint', { letter: word[idx] });
  }

  function handleKeyDown(e) {
    if (e.key && /^[a-zA-Z]$/.test(e.key)) press(e.key.toLowerCase());
  }

  async function handlePress(letter) {
    await press(letter);
  }

  useEffect(() => {
    keyboardRef.current?.focus();
    const stream = hiveClient.blockchain.getBlockStream();

    if (currentGame)
      stream.on("data", (block) => {
        const { transactions } = block;

        const operations = transactions.flatMap((tx) => tx.operations);

        for (const op of operations) {
          if (op[0] === "custom_json") {
            const [, data] = op;
            if (data.id === "elahorcado-builingday-test") {
              console.log(op);
              console.log(data);
            }
          }
        }
      });
    return () => {
      if (stream) stream.pause();
    };
  }, [currentGame]);

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <main
      className="app"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={keyboardRef}>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        icon={"/logo.png"}
      />
      {!currentGame ? (
        <Menu
          onNewGame={handleStartNewGame}
          onOpenAuth={() => setAuthOpen(true)}
          user={user}
        />
      ) : null}
      <GameOutcomeModal isOpen={outcomeVisible} onClose={hideOutcome} />
      <GameBoard
        currentGame={currentGame}
        letters={letters}
        onPress={handlePress}
        onLose={handleLose}
      />
    </main>
  );
}
