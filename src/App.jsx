import { useState } from 'react'
import './App.css'

function App() {
  const [username] = useState('Usuario')
  const [lives] = useState(6)
  const [round] = useState(1)
  const word = 'PALABRA'
  const revealed = [true, false, false, true, false, false, true];
  const [play, setPlay] = useState(false);

  return (
    <>

    <h1>Building Day: Hangman's game</h1>

      {play && <>
        <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center' }}>
          <h2>Username: {username}</h2>
          <h2>Lives: {lives}</h2>
          <h2>Round: {round}</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', }}>
            {word.split('').map((letter, idx) => (
              <span
                key={idx}
                style={{
                  borderBottom: '2px solid #333',
                  width: '30px',
                  textAlign: 'center',
                  fontSize: '2rem'
                }}
              >
                {revealed[idx] ? letter : ''}
              </span>
            ))}
          </div>
        </div>

      </> }

      <button onClick={() => setPlay(prev => !prev)}>{play ? 'End game' : "Play"}</button>

      
      

    </>
  )
}

export default App
