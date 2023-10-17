export default function GameOver(props) {
    let win = props.win;
  
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h1 style={{background: win ? "#B9D9EB": "salmon"}} >{win ? "Victoria": "Derrota"}</h1>
          {!win ? <p>
            Todos tus barcos fueron destruidos <strong>F</strong>
          </p>: <p>
            Destruiste todos los barcos, presenta tus respetos:<strong>{' '}F</strong>
          </p>}
          <button onClick={props.onPlayAgain}> Play Again </button>
        </div>
      </div>
    );
  }
  
  