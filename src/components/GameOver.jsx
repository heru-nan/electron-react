export default function GameOver(props) {
    let win = props.win;
  
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h1>Game Over</h1>
          {win ? <p>
            Todos tus barcos fueron destruidos <strong>F</strong>{" "}
            .
          </p>: <p>
            Destruiste todos los barcos, para presentar tus respeto<strong>F s</strong>{" "}
            .
          </p>}
          <button onClick={props.onPlayAgain}> Play Again </button>
        </div>
      </div>
    );
  }
  
  