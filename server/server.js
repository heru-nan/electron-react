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

    console.log("Mensaje recibido del cliente:", user);

    let response = {
      action: data.action,
      status: -1,
      position: [0, 0],
    };

    let result = {};

    switch (data.action) {
      case "c":
        result = connection(user);
        if (result.err) response.err = result.err;
        break;
      case "a":
        result = attack(user, data.position);
        response.position = result.position;
        response.status = result.status;
        if (result.err) response.err = result.err;
        break;
      case "l":
        result = "x";
        lose();
        break;
      case "b":
        result = build(user, data.ships);
        if (result.err) response.err = result.err;
        break;
      case "d":
        disconnect();
        break;
      case "s":
        select();
        break;
      default:
        console.log("ACCION DESCONOCIDA");
        break;
    }

    if (!result.err && data.action === "a") {
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
              console.error("Error al enviar la respuesta al cliente:", error);
            }
          }
        );
      });
    } else
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
  } catch (error) {
    console.error("Error al procesar el mensaje del cliente:", error);
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`Servidor UDP escuchando en ${address.address}:${address.port}`);
});

server.bind(PORT);
