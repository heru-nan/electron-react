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
        if (err || !play) {
          response.err = err;
          defaultResponse();
        } else
          for (let userStr of play) {
            if (userStr.includes("bot_")) continue;
            const splitUser = userStr.split(":");
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
          }
        break;
      case "a":
        result = attack(user, data.position);
        response.position = result.position;
        response.status = result.status;
        if (result.err) response.err = result.err;
        else {
          getFromBoards(user, "game").forEach((userObj) => {
            const userSplit = userObj.user.split(":");
            const ip = userSplit[0];
            const port = userSplit[1];

            let newStatus = response.status;
            if (user !== userObj.user) newStatus = -1;

            server.send(
              JSON.stringify({ ...response, status: newStatus }),
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
