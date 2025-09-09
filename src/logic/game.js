import { saveGameToHive } from "../blockchain/blockchain";
import { getRamdonNamePokemon } from "../pokeapi/pokeapi";

export class Auth {
  constructor() {
    this.token = "";
  }
}

export class Player {
  constructor(name) {
    this.username = name;
    this.wrong = 0;
    this.score = 0;
  }
}

export class Game {
  constructor() {
    this.gameId = Date.now();
    this.players = [];
    this.word = "";
    this.masked = [];
    this.used = new Set();
    this.revealed = false;
    this.maxTriesByPlayer = 6;
    this.currentPlayer = null;
  }

  static async startGame(gameState) {
    const w = await getRamdonNamePokemon({ minLength: 5 });

    let res = "";
    do {
      res = prompt("Ingresa tu nombre de usuario Hive");
    } while (!res);

    const newPlayer = new Player(res);

    const newState = {
      ...gameState,
      word: w,
      masked: w.split("").map((ch) => (/[a-z]/i.test(ch) ? "_" : ch)),
      currentPlayer: newPlayer,
    };
    newState.players.push(newPlayer);

    return newState;
  }

  static async press(gameState, letter) {
    if (
      gameState.used.has(letter) ||
      gameState.revealed ||
      !gameState.currentPlayer
    ) {
      return gameState;
    }

    const newState = { ...gameState };
    const newUsed = new Set(newState.used);
    newUsed.add(letter);
    newState.used = newUsed;
    newState.currentPlayer = { ...newState.currentPlayer };

    if (newState.word.includes(letter.toLowerCase())) {
      const arr = [...newState.masked];
      for (let i = 0; i < newState.word.length; i++) {
        if (newState.word[i] === letter.toLowerCase()) {
          arr[i] = letter.toUpperCase();
        }
      }
      newState.masked = arr;

      if (!arr.includes("_")) {
        newState.currentPlayer.score += 10;
        newState.revealed = true;
      }
    } else {
      newState.currentPlayer.wrong += 1;
      if (newState.currentPlayer.wrong >= newState.maxTriesByPlayer) {
        newState.revealed = true;
      }
    }

    await saveGameToHive(gameState);
    return newState;
  }

  static async saveGame(gameState) {
    localStorage.setItem("game_" + gameState.gameId, JSON.stringify(gameState));
  }

  static async loadGame(gameId) {
    const game = localStorage.getItem("game_" + gameId);
    if (game) {
      const loadedGame = JSON.parse(game);
      loadedGame.used = new Set(loadedGame.used);
      return loadedGame;
    }
    return null;
  }

  static async loseGame(gameState) {
    const newState = { ...gameState, revealed: true };
    return newState;
  }

  static async winGame(gameState) {
    const newState = { ...gameState, revealed: true };
    newState.currentPlayer.score += 10;
    return newState;
  }
}
