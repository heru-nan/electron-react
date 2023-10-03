const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PORT = 12345; // Puerto en el que el servidor escuchará

server.on("message", (msg, remoteInfo) => {
  try {
    const data = JSON.parse(msg.toString()) || {
      action: "default",
      position: [0, 0],
    };

    // Aquí puedes procesar la acción del cliente y realizar las acciones necesarias
    // según la acción recibida.

    // log  mensaje recibido
    console.log("Mensaje recibido del cliente:", data);

    // Por ejemplo, aquí solo estamos enviando una respuesta de confirmación.
    const response = {
      action: data.action,
      status: 1, // Simplemente confirmamos que recibimos el mensaje
      position: data.position,
    };

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
