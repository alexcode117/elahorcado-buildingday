import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Game } from "./logic/game";
import "./blockchain/blockchain";
import { hiveClient } from "./blockchain/blockchain";

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  // Referencia para el teclado virtual
  const keyboardRef = useRef(null);

  async function handleStartNewGame() {
    if (currentGame) {
      console.error("Ya tiene un juego iniciado");
      return;
    }
    const game = new Game();
    const newGame = await Game.startGame(game);

    setCurrentGame(newGame);
  }

  // Maneja el caso de derrota
  function handleLose() {}

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
    if (e.key && /^[a-zA-Z]$/.test(e.key))
      Game.press(currentGame, e.key.toLowerCase());
  }

  async function handlePress(letter) {
    const newGameState = await Game.press(currentGame, letter);
    setCurrentGame(newGameState);
  }

  // Inicializa la partida al montar el componente
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

  // Letras del teclado virtual
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  // Renderizado de la interfaz
  return (
    <div
      className="app"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={keyboardRef}>
      <div className="container">
        <header className="top">
          <div className="brand">
            <div className="logo">H</div>
            <div>
              <h1>El Ahorcado</h1>
              <p className="subtitle">Edición: Pokémon • 1ª generación</p>
            </div>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={handleStartNewGame}>
              Nueva partida
            </button>
            <button className="btn" onClick={hint}>
              Pista
            </button>
          </div>
        </header>

        {currentGame && currentGame.currentPlayer && (
          <main className="game">
            <section className="center">
              <div className="card main">
                <div className="tries">
                  Intentos:{" "}
                  <strong>
                    {Math.max(
                      0,
                      currentGame?.maxTriesByPlayer -
                        currentGame?.currentPlayer.wrong
                    )}
                  </strong>
                </div>
                <div className="secret">
                  <div className="secret-inner">
                    {currentGame.masked.map((ch, i) => (
                      <div
                        key={i}
                        className={`slot ${ch === "_" ? "empty" : ""}`}>
                        {ch}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="keyboard">
                  {letters.map((l) => (
                    <button
                      key={l}
                      className={`key ${currentGame.used.has(l) ? "used" : ""}`}
                      onClick={() => handlePress(l)}
                      // aria-pressed={`${currentGame.used.has(l) as React.AriaAttributes["aria-pressed"]}`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="controls">
                  {/* <button className="btn primary" onClick={reveal}>
                    Mostrar
                  </button> */}
                  <button className="btn ghost" onClick={handleLose}>
                    Rendirme
                  </button>
                </div>
              </div>
              <div className="status">
                <div>
                  Score: <strong>{currentGame.currentPlayer.score}</strong>
                </div>
              </div>
            </section>
          </main>
        )}
        <footer className="foot">Hecho con ❤️ • Demo Building Day</footer>
      </div>
    </div>
  );
}
