const getFromBoards = (user) => {
  return global.boards.find((board) => board.user === user);
};

const connection = (user) => {
  console.log("Conectado al servidor: ", user);
  global.players.push(user);
  global.boards.push({
    user: user,
    board: Array.from(Array(5), () => new Array(5).fill(0)),
  });
};

const build = (user, ships) => {
  try {
    const sizes = { p: 1, b: 2, s: 3 };

    console.log("Construyendo para: ", user);
    let board = getFromBoards(user); // pass by reference
    // console.log("b", global.boards);
    // console.log("ships", Object.entries(ships));

    for (const [key, ship] of Object.entries(ships)) {
      // console.log("xx", key, ship);
      const size = sizes[key];
      const direction = ship[2];
      if (direction === 1) {
        for (let i = 0; i < size; i++) {
          board.board[ship[0]][ship[1] + i] = 1;
        }
      } else {
        for (let i = 0; i < size; i++) {
          board.board[ship[0] + i][ship[1]] = 1;
        }
      }
    }

    console.log(getFromBoards(user));
  } catch (error) {
    console.log(error);
    return "User without board";
  }
};

const attack = () => {
  console.log("Atacando");
};
const lose = () => {
  console.log("Perdiste");
};
const disconnect = () => {
  console.log("Desconectado");
};
const select = () => {
  console.log("Seleccionado");
};

module.exports = { connection, attack, lose, build, disconnect, select };
