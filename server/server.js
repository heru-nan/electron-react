const dgram = require("dgram");
const server = dgram.createSocket("udp4");
// import all actions
const {  connection, attack, lose, build, disconnect, select } = require("./actions.js");

const PORT = 12345; // Puerto en el que el servidor escuchará

global.players = [];
global.boards = [];

server.on("message", (msg, remoteInfo) => {
  try {
    const data = JSON.parse(msg.toString()) || {
      action: "default",
    };

    console.log("Mensaje recibido del cliente:", data);

    let response = {
      action: data.action,
      status: 1, 
      position: [0, 0],
    };

    const user = `${remoteInfo.address}:${remoteInfo.port}`;

    switch (data.action) {
      case "c":
        connection(user);
        response.status = 1;
        break;
      case "a":
        attack();

        break;
      case "l":
        lose();  
        break;
      case "b":
        build(user, data.ships);
        break;
      case "d":
        disconnect();
        break;
      case "s":
        select();
        break;
      default:
        console.log("ACCION DESCONOCIDA")
        break;
    }


    // Enviamos la respuesta de vuelta al cliente
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
