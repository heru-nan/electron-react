import React from "react";

function Cell(props) {
  return (
    <div
      key={props.colIndex}
      className={`cell ${props.cell === 1 ? "selected" : props.cell === 2 ? "ship" : props.cell === 3 ? "buildShip" : ""}`}
      onClick={props.onCellClick}
    />
  );
}

const MemoizedCell = React.memo(Cell);

export default function Board({board, tittle,onCellClick}) {
  return (
    <div className="board">
      <h2>{tittle}</h2>
      {board.map((row, rowIndex) => (
        <div className="row">
          {row.map((cell, colIndex) => (
            <MemoizedCell
              key={rowIndex + "" + colIndex}
              onCellClick={() =>
                onCellClick(cell, [rowIndex, colIndex])
              }
              cell={cell}
            />
          ))}
        </div>
      ))}
    </div>
  );
}