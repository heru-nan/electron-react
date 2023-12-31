const uuidv4 = require("uuid").v4;
const { getFromBoards } = require("./getFromBoards.js");

const connection = (user) => {
  console.log("Conectado al servidor: ", user);
  const board = getFromBoards(user);
  if (board)
    return {
      err: "User already connected",
    };

  global.players.push(user);
  global.boards.push({
    user: user,
    board: Array.from(Array(5), () => new Array(5).fill(0)),
    hits: 0,
  });

  console.log("Actual connections: ", global.boards);

  return {};
};

const select = (user, bot = false) => {
  try {
    console.log("Seleccionando para ", user);
    let boardCount = global.boards.length;

    if (bot && boardCount % 2 !== 0) {
      const botUser = `bot_${user}`;
      global.players.push(botUser);
      global.boards.push({
        user: botUser,
        board: [
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
          [1, 0, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 0, 1, 0],
        ],
        hits: 0,
        botAttack: [...global.botAttack],
      });

      boardCount++;
    }

    if (boardCount % 2 === 0) {
      const lastBoard = global.boards[boardCount - 2];
      const newBoard = global.boards[boardCount - 1];
      if (!lastBoard.id) {
        lastBoard.id = uuidv4();
        newBoard.id = lastBoard.id;
        lastBoard.turn = true;
        newBoard.turn = false;
        if (bot) newBoard.builded = true;
        else lastBoard.builded = false;
        newBoard.builded = false;
      }

      return { play: [newBoard, lastBoard] };
    }
  } catch (error) {
    console.log("seleccionando", error);
    return { err: error };
  }
  return {};
};

const build = (user, ships) => {
  try {
    const sizes = { p: 1, b: 2, s: 3 };

    console.log("Construyendo para: ", user);
    let board = getFromBoards(user); // pass by reference

    if (board.builded) return { err: "Already builded" };
    // console.log("b", global.boards);
    // console.log("ships", Object.entries(ships));

    for (const [key, ship] of Object.entries(ships)) {
      // console.log("xx", key, ship);
      const size = sizes[key];
      const direction = ship[2];
      if (ship[0] < 0 || ship[0] > 4 || ship[1] < 0 || ship[1] > 4)
        return { err: "Posicion invalida" };

      if (direction === 1) {
        // check if ship position is valid
        if (ship[1] + size > 5) return { err: "Posicion invalida" };

        for (let i = 0; i < size; i++) {
          board.board[ship[0]][ship[1] + i] = 1;
        }
      } else {
        if (ship[0] + size > 5) return { err: "Posicion invalida" };

        for (let i = 0; i < size; i++) {
          board.board[ship[0] + i][ship[1]] = 1;
        }
      }
    }

    board.builded = true;

    console.log(getFromBoards(user));
    return {};
  } catch (error) {
    console.log(error);
    return { err: "User without board" };
  }
};

// 2 means hit and 3 means miss
const attack = (user, position) => {
  try {
    // create function to check if position is valid
    if (
      position[0] < 0 ||
      position[0] > 4 ||
      position[1] < 0 ||
      position[1] > 4
    )
      return { err: "Posicion invalida" };

    const boards = getFromBoards(user, "game");
    const userBoardObj = boards.find((b) => b.user === user);

    if (!userBoardObj.turn) return { err: "No es tu turno" };

    let status = 0;
    if (boards.length < 2) return { err: "No existe el tablero del oponente" };
    console.log("EN ATACK", boards);
    // find the board of the opponent using user field
    const boardObj = boards.find((b) => b.user !== user);
    if (boardObj.board[position[0]][position[1]] === 1) {
      boardObj.board[position[0]][position[1]] = 2;
      status = 1;
      boardObj.hits++;
    } else {
      boardObj.board[position[0]][position[1]] = 3;
    }

    return {
      status,
      position,
      win: boardObj.hits === 6,
      userObj: userBoardObj,
      botObj: boardObj,
    };
  } catch (error) {
    console.log(error);
    return { err: "WTF" };
  }
};
const lose = () => {
  console.log("Perdiste");
  return {};
};
const disconnect = (user) => {
  try {
    const board = getFromBoards(user);

    // delete board from global.boards
    global.boards = global.boards.filter((b) => {
      if (b.id && board.id && board.id === b.id) return false;
      if (b.user === user) return false;
      return true;
    });

    console.log("Desconectado", global.boards);
    return {};
  } catch (error) {
    console.log(error);
    return { err: "User is not defined" };
  }
};

module.exports = { connection, attack, lose, build, disconnect, select };
