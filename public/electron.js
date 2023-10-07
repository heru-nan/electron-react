const { app, BrowserWindow, ipcMain } = require("electron"); // electron
const isDev = require("electron-is-dev"); // To check if electron is in development mode
const path = require("path");

let mainWindow;

// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600, // width of window
    height: 600, // height of window
    webPreferences: {
      // The preload file where we will perform our app communication
      preload: isDev
        ? path.join(app.getAppPath(), "./public/preload.js") // Loading it from the public folder for dev
        : path.join(app.getAppPath(), "./build/preload.js"), // Loading it from the build folder for production
      contextIsolation: true, // Isolating context so our app is not exposed to random javascript executions making it safer.
    },
  });

  // Loading a webpage inside the electron window we just created
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Loading localhost if dev mode
      : `file://${path.join(__dirname, "../build/index.html")}` // Loading build file if in production
  );

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  // mainWindow.setIcon(path.join(__dirname, "images/appicon.ico"));

  // In development mode, if the window has loaded, then load the dev tools.
  if (isDev) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
  "userData",
  isDev
    ? path.join(app.getAppPath(), "userdata/") // In development it creates the userdata folder where package.json is
    : path.join(process.resourcesPath, "userdata/") // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
  await createWindow(); // Create the mainWindow

  const clientMessage = {
    action: "c", // Por ejemplo, "c" para conexión
    bot: 0,
    ships: {
      p: [1, 2, 0],
      b: [3, 4, 1],
      s: [5, 6, 0],
    },
    position: [7, 8],
  };

  // setInterval(() => {
  //   mainWindow.webContents.send("receive", clientMessage);
  // }, 2000)

  console.log("a");
  // If you want to add React Dev Tools
  if (isDev) {
    // // eslint-disable-next-line no-undef
    // await session.defaultSession
    //   .loadExtension(
    //     path.join(__dirname, `../userdata/extensions/react-dev-tools`) // This folder should have the chrome extension for React Dev Tools. Get it online or from your Chrome extensions folder.
    //   )
    //   .then((name) => console.log("Dev Tools Loaded"))
    //   .catch((err) => console.log(err));
  }
});

// Exiting the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Activating the app
app.on("activate", () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on("uncaughtException", (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const dgram = require("dgram");
const client = dgram.createSocket("udp4");

let SERVER_PORT = 0;
let SERVER_ADDRESS = "0"; //

ipcMain.handle("call", (event, args) => {
  const messageString = JSON.stringify(args);

  if (args.action === "c") {
    SERVER_PORT = args.port;
    SERVER_ADDRESS = args.ip;
    console.log("Conectando al servidor:", SERVER_ADDRESS, SERVER_PORT);
  }

  client.send(messageString, SERVER_PORT, SERVER_ADDRESS, (error) => {
    if (error) {
      console.error("Error al enviar el mensaje al servidor:", error);
      client.close();
    } else {
      console.log("Mensaje enviado al servidor:", messageString);
    }
  });
});

// Recibir mensajes del servidor
client.on("message", (message, remote) => {
  console.log(`Mensaje recibido del servidor ${remote.address}:${remote.port}`);
  const messageObject = JSON.parse(message);
  mainWindow.webContents.send("receive", messageObject);
});
