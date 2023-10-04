import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import GameOver from "./components/GameOver";

import "./App.css";
import React, { useEffect, useState } from "react";
import GameUtil from "./logic/GameUtil";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <button
//         onClick={() => {
//           window.api.doSomething("Hello from the renderer process!");
//         }}
//         >
//           Learn React
//         </button>
//       </header>
//     </div>
//   );
// }

export default function Game() {
  const gameUtil = new GameUtil(5);
  const [board, setBoard] = useState(gameUtil.GenerateBoard());
  const [enemyBoard, setEnemyBoard] = useState(gameUtil.GenerateBoard());
  const [ships, setShips] = useState([]);
  const [building, setBuilding] = useState(true);

  useEffect(() => {
    setBuilding(!ships?.length !== 3);
  }, []);

  const handleCellClick = (cell, position) => {
    console.log(cell, position);
    if (building) {
      console.log(board)
      board[position[0]][position[1]] = 1;
    }
  };
  return (
    <div className="game">
      <div className="heading">
        <h1>Battleship</h1>
      </div>
      <div className="game-board">
        <Board
          title="Your Board"
          board={board}
          onCellClick={(cell, position) => handleCellClick(cell, position)}
          ships={ships}
          building={building}
        />
        <Board
          title="Enemy Board"
          board={enemyBoard}
          onCellClick={(cell, position) =>
            handleCellClick(cell, position, enemyBoard)
          }
        />
      </div>
      {/* <GameInfo ships={ships} />
      {gameOver && (
        <GameOver game={state} onPlayAgain={() => handlePlayAgain()} />
      )} */}
    </div>
  );
}
