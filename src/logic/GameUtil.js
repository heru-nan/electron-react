export default class GameUtil {
    constructor(size) {
      this.size = size;
      console.clear();
    }
  
    board = null;
    ships = [];
    totalShipBlocks = 0;
    invalidAttempts = 0;
  
    GenerateBoard() {
      this.SetEmptyBoard();
      this.SetShipsLength();
      this.SetAllShips();
      console.log(this.ships, "ships");
      console.log(this.invalidAttempts, "InvalidAttempts");
      console.log(this.totalShipBlocks, "TotalShipBlocks");
      return this.board;
    }
  
    SetEmptyBoard() {
  
      let emptyBoard = [];
      
      for (let x = 0; x < this.size; x++) {
        emptyBoard.push([]);
        for (let y = 0; y < this.size; y++) {
          emptyBoard[x].push({
            isSelected: false,
            isShip: false,
            coordinates: {
              x: x,
              y: y
            }
          });
        }
      }
  
      this.board = emptyBoard;
    }
  
    SetShipsLength() {
      const minShips = 3;
      const maxShips = parseInt(this.size / 2) + 1;
      const numberOfShips = this.GetRandomNumber(minShips, maxShips);
  
      const minShipsLength = 2;
      const maxShipsLength = parseInt(this.size / 2);
  
      for (let i = 0; i < numberOfShips; i++) {
        let shipLength = this.GetRandomNumber(minShipsLength, maxShipsLength);
        this.ships.push({ length: shipLength });
        this.totalShipBlocks += shipLength;
      }
    }
  
    SetAllShips() {
      for (let i = 0; i < this.ships.length; i++) {
        this.BuildShip(this.ships[i]);
      }
    }
  
    BuildShip(ship) {
      let boardCopy = GameUtil.CopyArrayOfObjects(this.board);
      let direction = this.GetDirection();
  
      let shipCoordinates = [];
  
      let startPoint = {
        x: this.GetRandomNumber(0, this.size - 1),
        y: this.GetRandomNumber(0, this.size - 1),
        isRevealed: false
      };
  
      /*console.log(
        `From: ${startPoint.x}_${
          startPoint.y
        } Direction: ${direction} 'ShipLength: ${ship.length} `
      );*/
      
      let currentPoint;
  
      for (let i = 1; i <= ship.length; i++) {
        
        let nextPoint =
          i === 1 ? startPoint : this.getNextPoint(currentPoint, direction);
  
        if (!this.IsValidPoint(boardCopy, nextPoint)) {
          this.invalidAttempts += 1;
          this.BuildShip(ship);
          return;
        }
  
        this.SetIsShip(boardCopy, nextPoint);
        currentPoint = nextPoint;
        shipCoordinates.push(currentPoint);
      }
  
      this.board = boardCopy;
      
      ship["points"] = shipCoordinates;
    }
  
    static CopyArrayOfObjects(arrayObj) {
      console.log(arrayObj);
      return JSON.parse(JSON.stringify(arrayObj));
    }
  
    IsValidPoint(board, point) {
      //inside the board
      if (!board[point.x] || !board[point.x][point.y]) {
        return false;
      }
  
      //collision check
      if (board[point.x][point.y].isShip && this.board[point.x][point.y].isShip) {
        return false;
      }
  
      return true;
    }
  
    getNextPoint(currentPoint, direction) {
      let nextPoint = {};
      switch (direction) {
        case "left":
          nextPoint.x = currentPoint.x;
          nextPoint.y = currentPoint.y - 1;
          break;
        case "right":
          nextPoint.x = currentPoint.x;
          nextPoint.y = currentPoint.y + 1;
          break;
        case "up":
          nextPoint.x = currentPoint.x - 1;
          nextPoint.y = currentPoint.y;
          break;
        case "down":
          nextPoint.x = currentPoint.x + 1;
          nextPoint.y = currentPoint.y;
          break;
        default:
          throw new Error("invalid position");
      }
      
      nextPoint.isRevealed = false;
      return nextPoint;
    }
  
    SetIsShip(board, point) {
      let selectedSquare = Object.assign({}, board[point.x][point.y]);
      selectedSquare.isShip = true;
      board[point.x][point.y] = selectedSquare;
    }
  
    GetDirection() {
      let direction = ["left", "right", "up", "down"];
      let directionIndex = this.GetRandomNumber(0, 3);
      return direction[directionIndex];
    }
  
    GetRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }