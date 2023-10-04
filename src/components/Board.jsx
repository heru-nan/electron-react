function Cell(props) {
    return (
      <div
        className={
          `cell ${props.cell === 1 ? "selected" : props.cell === 2 ? "ship" : ""}`
        }
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