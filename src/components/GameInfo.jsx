export default function GameInfo(props) {
    return (
      <div className="game-info">
        <p>Sink all ships by clicking on grid</p>
        <div className="ship-info">
          {props.ships.map((ship, index) => (
            <div className="ship-item">
              {ship.points.map((cell) =>(
                <div
                  className={
                    "ship-block " +
                      (cell.isRevealed ? "revealed " : "")
                  }
                  />
              ))
                
                }
            </div>
          ))}
        </div>
      </div>
    );
  }