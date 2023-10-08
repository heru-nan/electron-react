const getFromBoards = (user, type = "user") => {
  const board = global.boards.find((board) => board.user === user);
  if (board && board.id && type === "game") {
    return global.boards.filter((b) => b.id === board.id);
  } else return board;
};

module.exports = {
  getFromBoards,
};
