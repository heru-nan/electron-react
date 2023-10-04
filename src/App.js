import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import GameOver from "./components/GameOver";

import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import GameUtil from "./logic/GameUtil";

//           window.api.doSomething("Hello from the renderer process!");

export default function Game() {
  const [board, setBoard] = useState(
    Array.from(Array(5), () => new Array(5).fill(0))
  );
  const [enemyBoard, setEnemyBoard] = useState(
    Array.from(Array(5), () => new Array(5).fill(0))
  );
  const [ships, setShips] = useState([]);
  const [building, setBuilding] = useState(true);

  const handleCellClick = useCallback(
    (cell, position) => {
      if (building) {
        board[position[0]][position[1]] = 3;
        setBoard([...board]);
      }
    },
    [board, building]
  );

  return (
    <div className="game">
      <div className="heading">
        <h1>Battleship</h1>
      </div>
      <div className="game-board">
        <Board
          tittle="Your Board"
          board={board}
          onCellClick={(cell, position) => handleCellClick(cell, position)}
          ships={ships}
          building={building}
        />
        {/* <Board
          title="Enemy Board"
          board={enemyBoard}
          onCellClick={(cell, position) =>
            handleCellClick(cell, position, enemyBoard)
          }
        /> */}
      </div>
      {/* <GameInfo ships={ships} />
      {gameOver && (
        <GameOver game={state} onPlayAgain={() => handlePlayAgain()} />
      )} */}
    </div>
  );
}
