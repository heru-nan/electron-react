import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import GameOver from "./components/GameOver";

import "./App.css";
import React, { useCallback, useEffect, useState } from "react";

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
  const [building, setBuilding] = useState(false);
  const [shipOrientation, setShipOrientation] = useState(1);
  const [currentShip, setCurrentShip] = useState(null);
  const [route, setRoute] = useState({ ip: "", port: "" });
  const [connection, setConnection] = useState(false);
  const [botStatus, setBotStatus] = useState(false);
  const [yourTurn, setYourTurn] = useState(false);

  const clean = () => {
    setShips({
      s: null,
      b: null,
      p: null,
    });
    setBoard(Array.from(Array(5), () => new Array(5).fill(0)));
    setEnemyBoard(Array.from(Array(5), () => new Array(5).fill(0)));
  };

  useEffect(() => {
    window.api.receive((_event, value) => {
      console.log("in react, ", value);
      const { action, ships, position, status, err } = value;

      if (!err) {
        switch (action) {
          case "c":
            setConnection(true);
            window.api.call({ action: "s", bot: botStatus ? 1 : 0 });
            clean();
            break;
          case "s":
            setBuilding(true);
            console.log("Listo para jugar");
            break;
          case "b":
            setBuilding(false);
            break;
          case "a":
            if (yourTurn && status === 1) {
              enemyBoard[position[0]][position[1]] = 2;
              setEnemyBoard([...enemyBoard]);
            } else if (yourTurn && status === 0) {
              enemyBoard[position[0]][position[1]] = 1;
              setEnemyBoard([...enemyBoard]);
            } else if (!yourTurn && status === 1) {
              board[position[0]][position[1]] = 2;
              setBoard([...board]);
            } else if (!yourTurn && status === 0) {
              board[position[0]][position[1]] = 1;
              setBoard([...board]);
            }

            setYourTurn(false);
            break;
          case "t":
            if (status === 1) {
              setYourTurn(true);
            }
            break;
          case "l":
            break;
          case "d":
            break;

          default:
            console.log("in react, ", value);
            break;
        }
      }
    });

    return () => {
      window.api.cleanReceive();
    };
  }, [board, enemyBoard, yourTurn]);

  const setShipInboard = (position) => {
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
  };

  const cleanActualShip = () => {
    let position = [];
    if (currentShip === "p" && ships.p) position = ships.p;
    else if (currentShip === "b" && ships.b) position = ships.b;
    else if (currentShip === "s" && ships.s) position = ships.s;
    else return;

    if (currentShip === "p" && ships.p) {
      board[position[0]][position[1]] = 0;
    } else if (shipOrientation === 1) {
      if (currentShip === "b") {
        board[position[0]][position[1]] = 0;
        board[position[0]][position[1] + 1] = 0;
      }
      if (currentShip === "s") {
        board[position[0]][position[1]] = 0;
        board[position[0]][position[1] + 1] = 0;
        board[position[0]][position[1] + 2] = 0;
      }
    } else {
      if (currentShip === "b") {
        board[position[0]][position[1]] = 0;
        board[position[0] + 1][position[1]] = 0;
      }
      if (currentShip === "s") {
        board[position[0]][position[1]] = 0;
        board[position[0] + 1][position[1]] = 0;
        board[position[0] + 2][position[1]] = 0;
      }
    }
    setBoard([...board]);
  };

  const handleCellClick = useCallback(
    (cell, position) => {
      if (building && currentShip) {
        cleanActualShip(position);
        setShipInboard(position);
      }
    },
    [board, building, currentShip, shipOrientation]
  );

  const handleCellClickAtack = useCallback(
    (cell, position) => {
      console.log("yp", yourTurn);
      if (yourTurn) {
        const json = {
          action: "a",
          position,
        };
        window.api.call(json);
      }
    },
    [yourTurn]
  );

  const onBuild = () => {
    const json = {
      action: "b",
      ships,
    };

    if (connection) window.api.call(json);
  };

  const onConnection = (e) => {
    e.preventDefault();
    if (route.ip && route.port) {
      window.api.call({
        action: "c",
        ip: route.ip,
        port: route.port,
      });
    }
  };

  return (
    <div className="game">
      <div className="heading">
        <h1>Battleship</h1>
      </div>
      <button
        style={{ position: "absolute", top: 0, right: 0, margin: "40px" }}
        onClick={clean}
      >
        Limpiar
      </button>
      <div className="game-board">
        <Board
          tittle="Your Board"
          board={board}
          onCellClick={(cell, position) => handleCellClick(cell, position)}
          ships={ships}
          building={building}
        />

        <Board
          tittle="Enemy Board"
          board={enemyBoard}
          onCellClick={(cell, position) => handleCellClickAtack(cell, position)}
        />
      </div>
      <div
        className="game-board"
        style={{
          visibility: building ? "visible" : "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr | 1fr 1fr 1fr",
          paddingLeft: "50px",
          paddingRight: "50px",
        }}
      >
        <button onClick={() => onBuild()}>Construir</button>
        <button
          disabled={!building}
          onClick={() => setShipOrientation(shipOrientation === 1 ? 0 : 1)}
        >
          Orientacion: {shipOrientation === 1 ? "Horizontal" : "Vertical"}
        </button>
        <button disabled={!building} onClick={() => setCurrentShip("s")}>
          Build S(3)
        </button>
        <button disabled={!building} onClick={() => setCurrentShip("b")}>
          Build B(2)
        </button>
        <button disabled={!building} onClick={() => setCurrentShip("p")}>
          Build P(1)
        </button>
      </div>

      <form class="connection" onClick={(e) => onConnection(e)}>
        <input
          style={{ width: "100px" }}
          val={route.ip}
          onChange={(e) => setRoute({ ...route, ip: e.target.value })}
        />
        <input
          style={{ width: "50px" }}
          val={route.port}
          onChange={(e) => setRoute({ ...route, port: e.target.value })}
        />
        <button type="submit">{connection ? "Conectado" : "Conectar"}</button>
      </form>
      {/* <GameInfo ships={ships} />
      {gameOver && (
        <GameOver game={state} onPlayAgain={() => handlePlayAgain()} />
      )} */}
      <button
        onClick={() => {
          setBotStatus(!botStatus);
        }}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        {botStatus ? "Desactivar Bot" : "Activar Bot"}
      </button>
      <p>{yourTurn ? "Es tu turno" : "Esperando..."}</p>
    </div>
  );
}
