export default function GameOver(props) {
    let game = props.game;
  
    let accuracy = 100 * game.totalShipBlocks / game.totalShootCount;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h1>Game Over</h1>
          <p>
            You have sunk all ships with <strong>{parseInt(accuracy)}% </strong>{" "}
            accuracy
          </p>
          <button onClick={props.onPlayAgain}> Play Again </button>
        </div>
      </div>
    );
  }
  
  