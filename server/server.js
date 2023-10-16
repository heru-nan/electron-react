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
        result = connection(user, data.bot);
        if (result.err) response.err = result.err;
        defaultResponse();
        break;
      case "s":
        result = select(user);
        const { play, err } = result;
        console.log("play", play);
        if (err || !play) {
          response.err = err;
          defaultResponse();
        } else
          for (playerBoard of play) {
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
        if (result.err) {
          response.err = result.err;
        }
        // response.position = result.position;
        // response.status = result.status;
        else {
          getFromBoards(user, "game").forEach((playerBoard) => {
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
          });
        }
        break;
      case "l":
        result = "x";
        lose();
        break;
      case "b":
        result = build(user, data.ships);
        if (result.err) response.err = result.err;
        defaultResponse();
        break;
      case "d":
        disconnect();
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
