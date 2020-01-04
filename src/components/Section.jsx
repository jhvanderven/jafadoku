import React from "react";
import Cell from "./Cell";

const Section = ({ order, width, section, board, parent }) => {
  const sectionWidth = width / order - order * 2;

  const squareStyle = {
    display: "flex",
    flexWrap: "wrap",
    width: sectionWidth + "px",
    height: sectionWidth + "px",
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: "2px",
    margin: "1px"
  };

  let jsx = [];
  /*
  board is an array of order * order * order elements
  section is the index of order * order
  in this section the valid indices are:
  for a 9x9 sudoku 
  section 0: section 1: section 5:
   0  1  2    3  4  5   33 34 35 
   9 10 11   12 13 14   42 43 44
  18 19 20   21 22 23   51 52 53
  */
  const n = order * order
  for (var i = 0; i < n; i++) {
    const idx = (Math.floor(section/order) * order + Math.floor(i/order)) * n + (section % order) * order + (i % order)
    // console.log(i, section, idx, board[idx])
    jsx.push(
      <Cell
        key={parent + "c" + i}
        width={sectionWidth}
        order={order}
        data={board[idx]} // given = given value, possibles = array of possibles
        parent={parent + "c" + i}
        index={idx}
      />
    );
  }

  return <div style={squareStyle}>{jsx}</div>;
};

export default Section;
