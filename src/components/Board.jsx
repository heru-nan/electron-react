function Cell(props) {
    return (
      <div
        className={
          "cell " +
          (props.cell.isSelected ? "selected " : "") +
          (props.cell.isShip ? "ship " : "")
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
                  props.onCellClick(cell)
                }
                cell={cell}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }