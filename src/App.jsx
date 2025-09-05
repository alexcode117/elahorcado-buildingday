import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import { getRamdonNamePokemon } from './pokeapi/pokeapi';

export default function App() {

  const [token, setToken] = useState(false)

  const handleLogin = () => {
    
  }
  // Estado para la palabra actual
  const [word, setWord] = useState('');
  // Estado para la palabra oculta (guiones bajos y letras reveladas)
  const [masked, setMasked] = useState([]);
  // Estado para las letras ya usadas
  const [used, setUsed] = useState(new Set());
  // Estado para el número de errores cometidos
  const [wrong, setWrong] = useState(0);
  // Estado para el puntaje acumulado
  const [score, setScore] = useState(0);
  // Estado para saber si la palabra está revelada (fin de partida)
  const [revealed, setRevealed] = useState(false);
  // Número máximo de intentos permitidos
  const maxTries = 6;
  // Referencia para el teclado virtual
  const keyboardRef = useRef(null);

  // Inicia una nueva partida obteniendo una palabra aleatoria
  async function startNewGame() {
    // Llama a la función que obtiene un nombre de Pokémon aleatorio
    const w = await getRamdonNamePokemon({ minLength: 5 });
    setWord(w);
    // Inicializa la palabra oculta con guiones bajos
    setMasked(w.split('').map(ch => /[a-z]/i.test(ch) ? '_' : ch));
    setUsed(new Set());
    setWrong(0);
    setRevealed(false);
    // Aquí podrías llamar a un logger externo para registrar el inicio de partida
    // logEvent('startGame', { word: w });
  }

  // Procesa la letra presionada por el usuario
  function press(letter) {
    if (used.has(letter) || revealed) return; // Ignora si ya fue usada o si la partida terminó
    const newUsed = new Set(used);
    newUsed.add(letter);
    setUsed(newUsed);

    if (word.includes(letter)) {
      // Revela la letra en la palabra oculta
      const arr = [...masked];
      for (let i = 0; i < word.length; i++)
        if (word[i] === letter) arr[i] = letter.toUpperCase();
      setMasked(arr);
      // Si ya no quedan guiones bajos, el usuario ganó
      if (!arr.includes('_')) handleWin();
    } else {
      // Si la letra no está, suma un error
      const nw = wrong + 1;
      setWrong(nw);
      // Si se alcanzó el máximo de errores, el usuario perdió
      if (nw >= maxTries) handleLose();
    }
    // Aquí podrías registrar cada intento
    // logEvent('press', { letter, result: word.includes(letter) });
  }

  // Maneja el caso de victoria
  function handleWin() {
    setScore(prev => prev + Math.max(10, 60 - wrong * 8));
    setRevealed(true);
    setTimeout(() => startNewGame(), 2000);
    // logEvent('win', { word, score });
  }

  // Maneja el caso de derrota
  function handleLose() {
    setRevealed(true);
    // Revela la palabra completa
    setMasked(word.split('').map(ch => /[a-z]/i.test(ch) ? ch.toUpperCase() : ch));
    setTimeout(() => startNewGame(), 2600);
    // logEvent('lose', { word });
  }

  // Revela la palabra manualmente (botón "Mostrar")
  function reveal() {
    setRevealed(true);
    setMasked(word.split('').map(ch => /[a-z]/i.test(ch) ? ch.toUpperCase() : ch));
    // logEvent('reveal', { word });
  }

  // Da una pista revelando una letra aleatoria no descubierta
  function hint() {
    if (revealed) return;
    const unrevealed = masked.map((m, i) => m === '_' ? i : -1).filter(i => i >= 0);
    if (!unrevealed.length) return;
    const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    press(word[idx]);
    // logEvent('hint', { letter: word[idx] });
  }

  // Permite jugar usando el teclado físico
  function handleKeyDown(e) {
    if (e.key && /^[a-zA-Z]$/.test(e.key)) press(e.key.toLowerCase());
    if (e.key === 'Enter') startNewGame();
  }

  // Inicializa la partida al montar el componente
  useEffect(() => {
    startNewGame();
    keyboardRef.current?.focus();
    // eslint-disable-next-line
  }, []);

  // Letras del teclado virtual
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Renderizado de la interfaz
  return (
    <>

    {token ? (<div className="app" onKeyDown={handleKeyDown} tabIndex={0} ref={keyboardRef}>
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
            <button className="btn ghost" onClick={startNewGame}>Nueva partida</button>
            <button className="btn" onClick={hint}>Pista</button>
          </div>
        </header>

        <main className="game">
          <section className="center">
            <div className="card main">
              <div className="tries">Intentos: <strong>{Math.max(0, maxTries - wrong)}</strong></div>
              <div className="secret">
                <div className="secret-inner">
                  {masked.map((ch, i) => (
                    <div key={i} className={`slot ${ch === '_' ? 'empty' : ''}`}>{ch}</div>
                  ))}
                </div>
              </div>
              <div className="keyboard">
                {letters.map(l => (
                  <button
                    key={l}
                    className={`key ${used.has(l) ? 'used' : ''}`}
                    onClick={() => press(l)}
                    aria-pressed={used.has(l)}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
              <div className="controls">
                <button className="btn primary" onClick={reveal}>Mostrar</button>
                <button className="btn ghost" onClick={handleLose}>Rendirme</button>
              </div>
            </div>
            <div className="status">
              <div>Score: <strong>{score}</strong></div>
            </div>
          </section>
        </main>
        <footer className="foot">Hecho con ❤️ • Demo Building Day</footer>
      </div>
    </div>) : <button onClick={handleLogin}>Login</button> }
    
    </>
  );
}