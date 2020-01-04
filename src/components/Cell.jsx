import React from "react";
import Possible from "./Possible";
import AnswerCell from './Answer'

const Cell = ({ width, order, index, data, parent }) => {
  const cellWidth = width / order - order;
  const squareStyle = {
    width: cellWidth + "px",
    height: cellWidth + "px",
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: "1px",
    display: "flex",
    flexWrap: "wrap"
  };

  let jsx = [];
  if (data.possibles.length>1) {
    for (var i = 0; i < order * order; i++) {
      const possible = (data.possibles.indexOf(i+1)>=0)
      jsx.push(
        <Possible
          key={parent + "p" + i}
          width={cellWidth}
          order={order}
          possible={possible}
          value={i+1}
          index={index}
        />
      );
    }
  } else {
    jsx.push(
      <AnswerCell 
        key={parent+"a"} 
        width={cellWidth} 
        order={order} 
        answer={data.possibles[0]} 
        given={data.given}
        index={index}
        error={data.error}
      />);
  }
  return <div style={squareStyle}>{jsx}</div>;
};

export default Cell;
