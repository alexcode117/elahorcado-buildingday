# 🎮 Hive + React + PokeAPI Word Game

A fun **educational project** built with **Hive Blockchain**, **React (JavaScript)**, and the **PokeAPI**.  
The game challenges users to **guess Pokémon names letter by letter** (similar to Hangman).  

---

## 🚀 Features

- 🎲 **Random Pokémon name** fetched from [PokeAPI](https://pokeapi.co/)  
- 🔡 **Guess letters** until the word is complete  
- ❤️ Track remaining attempts and game progress  
- 🧩 Clean and simple UI in React  
- 🔗 **Hive Blockchain integration**:
  - Hive Keychain login
  - Post game results to Hive via `custom_json`  
  - (Optional) Leaderboard stored on Hive  

---

## 📚 Learning Objectives

This project is designed for **students of the Hive Building Day workshops**. By completing it, students will:

1. Understand the basics of **React state & props**  
2. Practice **API requests** with fetch/axios  
3. Use **Hive Keychain** to authenticate and broadcast blockchain transactions  
4. See how **custom_json** can be used to log data/events  
5. Work collaboratively on a fun, gamified project  

---

## 🛠️ Tech Stack

- **React** (frontend framework)  
- **JavaScript (ES6)**  
- **PokeAPI** (Pokémon data source)  
- **Hive Blockchain** (auth & data)  
- **Hive Keychain** (browser extension for Hive auth)  

---

## 📦 Installation & Setup

1. **Clone this repo**
   ```bash
   git clone https://github.com/yourusername/hive-pokemon-wordgame.git
   cd hive-pokemon-wordgame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   - Create a `.env` file with:
     ```
     REACT_APP_HIVE_API=https://api.hive.blog
     ```
   - (Optional) Add any custom settings, like Hive-Engine RPC or leaderboard ID.

4. **Start the dev server**
   ```bash
   npm start
   ```
   The app runs at [http://localhost:3000](http://localhost:3000).

---

## 🎮 How to Play

1. **Login with Hive Keychain**  
2. A random Pokémon name is fetched from PokeAPI  
3. Guess the Pokémon letter by letter  
4. If you guess correctly → you win 🎉  
5. Results can be **posted to Hive** (optional)  

---

## 🔗 Hive Integration (Optional)

- **Authentication** → via Hive Keychain `requestHandshake` + `requestSignBuffer`  
- **Posting results** → broadcast `custom_json` with the score and guessed Pokémon  
- **Leaderboard** → read stored scores from Hive transactions with matching `id`  

---

## 📂 Project Structure

```
src/
├── components/
│   ├── GameBoard.js      # main game logic
│   ├── Keyboard.js       # on-screen letter selection
│   ├── HiveAuth.js       # login with Hive Keychain
│   └── Leaderboard.js    # (optional) leaderboard component
├── api/
│   └── pokeapi.js        # wrapper to fetch Pokémon
├── utils/
│   └── hive.js           # Hive RPC + custom_json helper
└── App.js                # root component
```

---

## ✅ Next Steps for Students

- [ ] Add lives/attempts counter  
- [ ] Style the game with CSS/Tailwind  
- [ ] Add more Hive blockchain features (store attempts, record streaks)  
- [ ] Build a **leaderboard** from blockchain data  

---

## 🤝 Contributing

Students are welcome to fork this repo, work in teams, and share improvements.  
Feel free to open issues & pull requests!  

---

## 📜 License

MIT License © 2025 YourName