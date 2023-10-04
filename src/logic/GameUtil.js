export default class GameUtil {
  constructor(size) {
    this.size = size;
  }

  ships = [];
  totalShipBlocks = 0;
  invalidAttempts = 0;

  GenerateBoard() {
    this.board = Array.from(Array(5), () => new Array(5).fill(0));
    return this.board;
  }
}
