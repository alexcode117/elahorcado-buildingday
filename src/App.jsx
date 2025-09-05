// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import './index.css';

const POKEMON_GEN1 = [
  "bulbasaur","ivysaur","venusaur","charmander","charmeleon","charizard","squirtle","wartortle","blastoise","caterpie","metapod","butterfree","weedle","kakuna","beedrill","pidgey","pidgeotto","pidgeot","rattata","raticate","spearow","fearow","ekans","arbok","pikachu","raichu","sandshrew","sandslash","nidoran-f","nidorina","nidoqueen","nidoran-m","nidorino","nidoking","clefairy","clefable","vulpix","ninetales","jigglypuff","wigglytuff","zubat","golbat","oddish","gloom","vileplume","paras","parasect","venonat","venomoth","diglett","dugtrio","meowth","persian","psyduck","golduck","mankey","primeape","growlithe","arcanine","poliwag","poliwhirl","poliwrath","abra","kadabra","alakazam","machop","machoke","machamp","bellsprout","weepinbell","victreebel","tentacool","tentacruel","geodude","graveler","golem","ponyta","rapidash","slowpoke","slowbro","magnemite","magneton","farfetchd","doduo","dodrio","seel","dewgong","grimer","muk","shellder","cloyster","gastly","haunter","gengar","onix","drowzee","hypno","krabby","kingler","voltorb","electrode","exeggcute","exeggutor","cubone","marowak","hitmonlee","hitmonchan","lickitung","koffing","weezing","rhyhorn","rhydon","chansey","tangela","kangaskhan","horsea","seadra","goldeen","seaking","staryu","starmie","mr-mime","scyther","jynx","electabuzz","magmar","pinsir","tauros","magikarp","gyarados","lapras","ditto","eevee","vaporeon","jolteon","flareon","porygon","omanyte","omastar","kabuto","kabutops","aerodactyl","snorlax","articuno","zapdos","moltres","dratini","dragonair","dragonite","mewtwo","mew"
];

function getSpriteUrl(id){
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export default function App(){
  const [wordIndex, setWordIndex] = useState(null);
  const [word, setWord] = useState('');
  const [masked, setMasked] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [maxTries, setMaxTries] = useState(6);
  const [used, setUsed] = useState(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sideIds, setSideIds] = useState([1,2,3,4]);
  const [revealedSprite, setRevealedSprite] = useState(null);
  const keyboardRef = useRef(null);

  useEffect(()=>{
    startNewGame();
    // keyboard focus for accessibility
    keyboardRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    // update side sprites occasionally for freshness
    if(wordIndex !== null){
      const ids = new Set();
      while(ids.size < 4){
        const r = Math.floor(Math.random()*POKEMON_GEN1.length);
        if(r !== wordIndex) ids.add(r);
      }
      setSideIds(Array.from(ids));
    }
  }, [wordIndex]);

  function pickWord(){
    const idx = Math.floor(Math.random()*POKEMON_GEN1.length);
    return {w: POKEMON_GEN1[idx], idx};
  }

  function startNewGame(){
    const {w, idx} = pickWord();
    setWordIndex(idx);
    setWord(w);
    setMasked(w.split('').map(ch => /[a-z]/i.test(ch) ? '_' : ch));
    setWrong(0);
    setUsed(new Set());
    setRevealedSprite(null);
    setMaxTries(6);
  }

  function press(letter){
    if(used.has(letter) || revealedSprite) return;
    const newUsed = new Set(used);
    newUsed.add(letter);
    setUsed(newUsed);

    if(word.includes(letter)){
      const arr = [...masked];
      for(let i=0;i<word.length;i++) if(word[i]===letter) arr[i] = letter.toUpperCase();
      setMasked(arr);
      if(!arr.includes('_')) handleWin();
    } else {
      const nw = wrong + 1;
      setWrong(nw);
      if(nw >= maxTries) handleLose();
    }
  }

  function handleWin(){
    setScore(prev => prev + Math.max(10, 60 - wrong*8));
    setStreak(prev => prev + 1);
    reveal(true);
    setTimeout(()=> startNewGame(), 2000);
  }

  function handleLose(){
    setStreak(0);
    reveal(false);
    setTimeout(()=> startNewGame(), 2600);
  }

  function reveal(success){
    setRevealedSprite(getSpriteUrl(wordIndex+1));
    setMasked(word.split('').map(ch => /[a-z]/i.test(ch) ? ch.toUpperCase() : ch));
  }

  function hint(){
    if(revealedSprite) return;
    const unrevealed = masked.map((m,i)=> m === '_' ? i : -1).filter(i=>i>=0);
    if(!unrevealed.length) return;
    const idx = unrevealed[Math.floor(Math.random()*unrevealed.length)];
    press(word[idx]);
  }

  function handleKeyDown(e){
    if(e.key && /^[a-zA-Z]$/.test(e.key)) press(e.key.toLowerCase());
    if(e.key === 'Enter') startNewGame();
  }

  // render helpers
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="app" onKeyDown={handleKeyDown} tabIndex={0} ref={keyboardRef}>
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
          <aside className="side">
            <img src={getSpriteUrl(sideIds[0]+1)} alt="" />
            <img src={getSpriteUrl(sideIds[1]+1)} alt="" />
          </aside>

          <section className="center">
            <div className="card main">
              <div className="tries">Intentos: <strong>{Math.max(0, maxTries - wrong)}</strong></div>

              <div className="secret">
                <div className="secret-inner">
                  {masked.map((ch,i)=> (
                    <div key={i} className={`slot ${ch==='_'? 'empty':''}`}>{ch}</div>
                  ))}
                </div>
              </div>

              <div className="preview">
                <img
                  src={revealedSprite || ''}
                  className={revealedSprite ? 'visible' : 'hidden'}
                  alt={revealedSprite ? word : 'sprite oculto'}
                />
              </div>

              <div className="keyboard">
                {letters.map(l=> (
                  <button
                    key={l}
                    className={`key ${used.has(l)? 'used':''}`}
                    onClick={()=> press(l)}
                    aria-pressed={used.has(l)}
                  >{l.toUpperCase()}</button>
                ))}
              </div>

              <div className="controls">
                <button className="btn primary" onClick={()=> reveal(true)}>Mostrar</button>
                <button className="btn ghost" onClick={()=> reveal(false)}>Rendirme</button>
              </div>
            </div>

            <div className="status">
              <div>Score: <strong>{score}</strong></div>
              <div>Racha: <strong>{streak}</strong></div>
            </div>
          </section>

          <aside className="side right">
            <img src={getSpriteUrl(sideIds[2]+1)} alt="" />
            <img src={getSpriteUrl(sideIds[3]+1)} alt="" />
          </aside>
        </main>

        <footer className="foot">Hecho con ❤️ • Demo con sprites públicos (PokeAPI). Respeta licencias en producción.</footer>
      </div>
    </div>
  );
}
