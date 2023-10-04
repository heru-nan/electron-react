function Cell(props) {
    return (
      <div
        key={props.colIndex}
        className={`cell ${props.cell === 1 ? "red" : props.cell === 2 ? "blue" : ""}`}
        onClick={props.onCellClick}
      />
    );
  }
  
export default function Board(props) {
    return (
      <div className="board">
        {props.board.map((row, rowIndex) => (
          <div className="row" key={row}>
            {row.map((cell, colIndex) => (
              <Cell
                key={rowIndex + "" + colIndex}
                onCellClick={() =>
                  props.onCellClick(cell, [rowIndex, colIndex])
                }
                cell={cell}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }