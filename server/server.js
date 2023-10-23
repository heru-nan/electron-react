const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const { getFromBoards } = require("./getFromBoards.js");
// import all actions
const {
  connection,
  attack,
  lose,
  build,
  disconnect,
  select,
} = require("./actions.js");

const PORT = 12345; // Puerto en el que el servidor escuchará

global.players = [];
global.boards = [];
global.botAttack = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],

  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],

  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],

  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],

  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
];

server.on("error", (err) => {
  console.error("Error en el servidor:", err);
  server.close();
});

server.on("message", (msg, remoteInfo) => {
  try {
    const data = JSON.parse(msg.toString()) || {
      action: "default",
    };
    const user = `${remoteInfo.address}:${remoteInfo.port}`;

    const defaultResponse = () => {
      server.send(
        JSON.stringify(response),
        remoteInfo.port,
        remoteInfo.address,
        (error) => {
          if (error) {
            console.error("Error al enviar la respuesta al cliente:", error);
          }
        }
      );
    };

    console.log("Mensaje recibido del cliente:", user);

    let response = {
      action: data.action,
      status: 0,
      position: [0, 0],
    };

    let result = {};

    switch (data.action) {
      case "c":
        result = connection(user);
        if (result.err) response.err = result.err;
        defaultResponse();
        break;
      case "s":
        result = select(user, data.bot === 1);
        const { play, err } = result;
        console.log("play", play);
        if (err || !play) {
          response.err = err;
          defaultResponse();
        } else
          for (let playerBoard of play) {
            if (playerBoard.user.includes("bot_")) continue;
            const splitUser = playerBoard.user.split(":");
            const ip = splitUser[0];
            const port = splitUser[1];
            server.send(
              JSON.stringify({ action: "s", status: 1 }),
              port,
              ip,
              (error) => {
                if (error) {
                  console.error(
                    "Error al enviar la respuesta al cliente:",
                    error
                  );
                }
              }
            );
            if (playerBoard.turn) {
              const nport = port;
              const nip = ip;
              setTimeout(() => {
                server.send(
                  JSON.stringify({ action: "t", status: 1 }),
                  nport,
                  nip,
                  (error) => {
                    if (error) console.log(error);
                  }
                );
              }, 500);
            }
          }
        break;
      case "a":
        result = attack(user, data.position);
        const boards = getFromBoards(user, "game");
        // console.log("result atack: ", result);
        if (result.err) {
          response.err = result.err;
          break;
        }
        // response.position = result.position;
        // response.status = result.status;
        else {
          boards.forEach((playerBoard) => {
            if (playerBoard.user.includes("bot_")) return;

            const userSplit = playerBoard.user.split(":");
            const ip = userSplit[0];
            const port = userSplit[1];

            playerBoard.turn = !playerBoard.turn;

            server.send(
              JSON.stringify({
                ...response,
                position: result.position,
                status: result.status,
              }),
              port,
              ip,
              (error) => {
                if (error) {
                  console.error(
                    "Error al enviar la respuesta al cliente:",
                    error
                  );
                }
              }
            );

            if (playerBoard.turn) {
              server.send(
                JSON.stringify({ action: "t", status: 1 }),
                port,
                ip,
                (error) => {
                  if (error) console.log(error);
                }
              );
            }

            if (result.win && !playerBoard.turn) {
              server.send(
                JSON.stringify({ action: "w", status: 1 }),
                port,
                ip,
                (error) => {
                  if (error) console.log(error);
                }
              );
            }

            if (result.win && playerBoard.turn) {
              server.send(
                JSON.stringify({ action: "l", status: 1 }),
                port,
                ip,
                (error) => {
                  if (error) console.log(error);
                }
              );
            }
          });
        }

        if (boards.find((board) => board.user?.includes("bot_"))) {
          // setTimeout(() => {
          const playerBoard = result.userObj;
          const botBoard = result.botObj;
          let status = 0;
          const attackPosition = botBoard.botAttack?.pop();
          if (playerBoard.board[attackPosition[0]][attackPosition[1]] === 1) {
            playerBoard.board[attackPosition[0]][attackPosition[1]] = 2;
            playerBoard.hits++;
            status = 1;
          } else {
            playerBoard.board[attackPosition[0]][attackPosition[1]] = 3;
          }

          const userSplit = playerBoard.user.split(":");
          const ip = userSplit[0];
          const port = userSplit[1];

          if (playerBoard.hits === 6) {
            server.send(
              JSON.stringify({ action: "l", status: 1 }),
              port,
              ip,
              (error) => {
                if (error) console.log(error);
              }
            );
          }

          server.send(
            JSON.stringify({
              action: "a",
              status,
              position: attackPosition,
            }),
            port,
            ip,
            (error) => {
              if (error) console.log(error);
            }
          );

          playerBoard.turn = true;
          botBoard.turn = false;

          server.send(
            JSON.stringify({ action: "t", status: 1 }),
            port,
            ip,
            (error) => {
              if (error) console.log(error);
            }
          );

          // }, 500);
        }
        break;
      case "l":
        result = "x";
        lose();
        break;
      case "b":
        result = build(user, data.ships);
        if (result.err) response.err = result.err;
        else response.status = 1;
        defaultResponse();
        break;
      case "d":
        result = disconnect(user);
        if (result.err) response.err = result.err;
        else response.status = 1;
        defaultResponse();
        break;

      default:
        console.log("ACCION DESCONOCIDA");
        defaultResponse();
        break;
    }
  } catch (error) {
    console.error("Error al procesar el mensaje del cliente:", error);
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`Servidor UDP escuchando en ${address.address}:${address.port}`);
});

server.bind(PORT);
