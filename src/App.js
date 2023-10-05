import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import GameOver from "./components/GameOver";

import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import GameUtil from "./logic/GameUtil";

//           

export default function Game() {
  const [board, setBoard] = useState(
    Array.from(Array(5), () => new Array(5).fill(0))
  );
  const [enemyBoard, setEnemyBoard] = useState(
    Array.from(Array(5), () => new Array(5).fill(0))
  );
  const [ships, setShips] = useState({
    s: null,
    b: null,
    p: null,
  });
  const [building, setBuilding] = useState(true);
  const [shipOrientation, setShipOrientation] = useState(1);
  const [currentShip, setCurrentShip] = useState(null);

  useEffect(() => {
    if (ships.s?.length && ships.b?.length && ships.p?.length) {
      setBuilding(false);
    }
  }, [ships]);

  const handleCellClick = useCallback(
    (cell, position) => {
      if (building && currentShip) {
        if (currentShip === "p") {
          board[position[0]][position[1]] = 3;
          setShips({ ...ships, p: [...position, shipOrientation] });
        } else if (shipOrientation === 1) {
          if (currentShip === "b") {
            board[position[0]][position[1]] = 3;
            board[position[0]][position[1] + 1] = 3;
            setShips({ ...ships, b: [...position, shipOrientation] });
          }
          if (currentShip === "s") {
            board[position[0]][position[1]] = 3;
            board[position[0]][position[1] + 1] = 3;
            board[position[0]][position[1] + 2] = 3;
            setShips({ ...ships, s: [...position, shipOrientation] });
          }
        } else {
          if (currentShip === "b") {
            board[position[0]][position[1]] = 3;
            board[position[0] + 1][position[1]] = 3;
            setShips({ ...ships, b: [...position, shipOrientation] });
          }
          if (currentShip === "s") {
            board[position[0]][position[1]] = 3;
            board[position[0] + 1][position[1]] = 3;
            board[position[0] + 2][position[1]] = 3;
            setShips({ ...ships, s: [...position, shipOrientation] });
          }
        }
        setBoard([...board]);
      }
    },
    [board, building, currentShip, shipOrientation]
  );

  const onBuild = () => {
    const json = {
      action: "b",
      ships,
    };
    window.api.call(json);
  }

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

        <Board
          title="Enemy Board"
          board={enemyBoard}
          onCellClick={(cell, position) =>
            handleCellClick(cell, position, enemyBoard)
          }
        />
      </div>
      <button disabled={building} onClick={() => onBuild()}>
        Construir
      </button>
      <div className="game-board">
        <button disabled={!building} onClick={() => setCurrentShip("s")}>
          Build S(3)
        </button>
        <button disabled={!building} onClick={() => setCurrentShip("b")}>
          Build B(2)
        </button>
        <button disabled={!building} onClick={() => setCurrentShip("p")}>
          Build P(1)
        </button>
        <button
          disabled={!building}
          onClick={() => setShipOrientation(shipOrientation === 1 ? 0 : 1)}
        >
          Orientacion: {shipOrientation === 1 ? "Horizontal" : "Vertical"}
        </button>
      </div>

      {/* <GameInfo ships={ships} />
      {gameOver && (
        <GameOver game={state} onPlayAgain={() => handlePlayAgain()} />
      )} */}
    </div>
  );
}
