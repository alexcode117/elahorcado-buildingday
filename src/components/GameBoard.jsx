import { useEffect, useRef, useCallback } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import "./GameBoard.css";

const GameBoard = ({ currentGame, letters, onPress, onLose }) => {
  if (!currentGame) return null;

  const remaining = Math.max(
    0,
    currentGame?.maxTriesByPlayer - currentGame?.currentPlayer.wrong
  );

  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const prevMaskedRef = useRef(currentGame.masked.slice());

  const scrollToStart = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  }, []);

  const scrollToEnd = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const prev = prevMaskedRef.current || [];
    const cur = currentGame.masked || [];
    // find index that changed from '_' to revealed
    for (let i = 0; i < cur.length; i++) {
      if (prev[i] === "_" && cur[i] !== "_") {
        const node = slotRefs.current[i];
        if (node && node.scrollIntoView) {
          node.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
        break;
      }
    }
    prevMaskedRef.current = cur.slice();
  }, [currentGame.masked]);

  return (
    <>
      <div className={`board-header`}>
        <div className={`tries ${remaining <= 2 ? "low" : ""}`}>
          <div className="tries-label">Intentos</div>
          <div className="tries-value">{remaining}</div>
        </div>
        <div className="status">
          <div className="score">Score</div>
          <div className="score-value">
            {currentGame.currentPlayer.score}
          </div>
        </div>
      </div>

      <div className="board-body">
        <div className="secret">
          <div className="secret-viewport" ref={containerRef}>
            <div
              className="secret-inner"
              style={{
                "--cols": Math.min(currentGame.masked.length || 0, 11),
              }}>
              {currentGame.masked.map((ch, i) => (
                <div
                  key={i}
                  ref={(el) => (slotRefs.current[i] = el)}
                  className={`slot ${ch === "_" ? "empty" : "revealed"}`}>
                  {ch}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="secret-arrows">
          <button
            className="secret-arrow"
            onClick={scrollToStart}
            aria-label="Ir principio">
            ‹
          </button>
          <button
            className="secret-arrow"
            onClick={scrollToEnd}
            aria-label="Ir final">
            ›
          </button>
        </div>
        <div className="keyboard">
          {letters.map((l) => (
            <button
              key={l}
              className={`key ${currentGame.used.has(l) ? "used" : ""}`}
              onClick={() => onPress(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="controls">
        <Button variant={"primary"} onClick={onLose}>
          Rendirme
        </Button>
      </div>
    </>
  );
};

export default GameBoard;
