# Hive Poké Guess — Guess the Pokémon!

A simple and fun React + Vite app where you try to guess a Pokémon’s name fetched from the public [PokéAPI](https://pokeapi.co/). The app integrates with the Hive blockchain using `custom_json` operations to authenticate users (via Hive Keychain) and persist game-related data (e.g., login events, guesses, or scores) on-chain.

## Features

- Guess-the-Pokémon gameplay powered by PokéAPI.
- Hive blockchain integration using `custom_json`:
  - Login with Hive Keychain.
  - Store game events and/or scores immutably.
- Modern front-end stack: React 19 + Vite 7.
- Fast local development with HMR.

## Tech Stack

- React 19
- Vite 7
- Hive blockchain (`custom_json` operations)
- Hive Keychain (browser extension)
- PokéAPI

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Hive account
- [Hive Keychain](https://hive-keychain.com/) browser extension installed and unlocked

No API keys are required for PokéAPI.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite will print a local URL (typically http://localhost:5173). Open it in your browser.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

Key files and folders:

- `src/`
  - `main.jsx` — App bootstrap.
  - `App.jsx` — Main React component and layout.
  - `logic/logic.js` — Core game logic (guess validation, win/lose flow, etc.).
  - `pokeapi/pokeapi.js` — PokéAPI helpers for fetching Pokémon data.
  - `blockchain/blockchain.js` — Hive `custom_json` helpers (login and data storage).
  - `App.css`, `index.css` — Styling.
- `public/` — Static assets served as-is.
- `index.html` — HTML template.
- `vite.config.js` — Vite config.
- `package.json` — Scripts and dependencies.

## How Hive Integration Works

This app uses Hive’s `custom_json` operation (typically signed by the user’s posting authority via Hive Keychain) to authenticate and record game data.

Typical flow:

1. User clicks “Login with Hive”.
2. App requests a `custom_json` signature from Hive Keychain (e.g., id: `poke-guess-login`).
3. On success, the app treats the Hive account as authenticated.
4. For game events (e.g., correct guess, attempts, score), the app sends another `custom_json` (e.g., id: `poke-guess-event`) with structured JSON payload like:
   ```json
   {
     "event": "correct_guess",
     "pokemon": "pikachu",
     "attempts": 3,
     "timestamp": 1712345678
   }
   ```
5. The transaction is broadcast via Hive Keychain; your app can later read these logs (if implemented) using Hive APIs or indexers.

Security notes:

- Private keys never leave the user’s browser; Hive Keychain handles signing.
- Use posting authority for `custom_json` where possible (not active).
- Consider rate-limiting and clear user feedback when Hive is unavailable.

## How PokéAPI Is Used

- Fetch random or specific Pokémon data (name, sprite, etc.) from PokéAPI.
- Use the returned information to drive the guessing game.
- No API key required; respect PokéAPI rate limits.

## Available Scripts

From `package.json`:

- `npm run dev` — Start Vite dev server.
- `npm run build` — Build for production.
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Run ESLint.

## Configuration

- PokéAPI requires no configuration.
- Hive:
  - Ensure Hive Keychain is installed and unlocked.
  - Set your desired `custom_json` IDs within `src/blockchain/blockchain.js`.
  - Decide what payload you want to store (e.g., guesses, result, score, timestamp).

If you later add environment variables (e.g., feature flags), document them here.

## Roadmap

- Add UI to show recent on-chain game events per user.
- Add difficulty levels (e.g., hide sprite, provide hints).
- Add scoreboard derived from on-chain logs.
- Improve accessibility and mobile UX.

## Acknowledgements

- [PokéAPI](https://pokeapi.co/)
- [Hive](https://hive.io/) and [Hive Keychain](https://hive-keychain.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
