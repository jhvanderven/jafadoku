import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import range from "lodash/range"
import Section from "./Section"
import { setBoard, cleaning, uniqueRows, uniqueColumns, uniqueSections, toggleAutoCleaning } from "../redux/boardSlice"
import { toggleHovering, toggleColoring, toggleEliminate } from "../redux/controlsSlice"
import { ActionCreators } from 'redux-undo';
import UndoRedo from "./UndoRedo"

const emptyBoard = Array.apply(null, Array(81)).map(Number.prototype.valueOf, 0)

const setup = (board, order) => {
  console.log("setting up")
  const n = order * order
  let newBoard = []

  for (let i = 0; i < n * n; i++) {
    // console.log(board[i])
    if (board[i] !== 0) {
      newBoard.push({ error: false, given: board[i], possibles: [board[i]] })
    } else {
      newBoard.push({ error: false, given: 0, possibles: range(1, 1 + n) })
    }
  }

  return newBoard
}

const Puzzle = ({ order, width, setupBoard }) => {
  // this is local state for the component, used only once
  const [first, setFirst] = useState(true)
  const [userCreatingBoard, setUserCreatingBoard] = useState(false)

  // this is redux managed state
  const board = useSelector(state => state.board.present.board)
  const autoCleaning = useSelector(state => state.board.present.autoCleaning)
  const eliminate = useSelector(state => state.controls.eliminate)
  const dispatch = useDispatch()

  const n = order * order

  if (first) {
    let aBoard = setup(setupBoard, order)
    setFirst(false)
    dispatch(setBoard(aBoard))
  }

  const reduceCellsClick = () => {
    dispatch(cleaning())
  }

  const uniqueRowsClick = () => {
    dispatch(uniqueRows())
  }

  const uniqueColumnsClick = () => {
    dispatch(uniqueColumns())
  }

  const uniqueSectionsClick = () => {
    dispatch(uniqueSections())
  }

  // const onlyInACertainRowClick = () => {
  // }

  // const onlyInACertainColumnClick = () => {
  // }

  const doToggleHovering = () => {
    dispatch(toggleHovering())
  }

  const doToggleColoring = () => {
    dispatch(toggleColoring())
  }

  const toggleAutoClean = () => {
    dispatch(toggleAutoCleaning())
  }

  const toggleEliminateClick = () => {
    dispatch(toggleEliminate())
  }

  const new3x3Click = () => {
    if (userCreatingBoard) {
      // done clicked
      // all board items with just one possible should get given true
      setUserCreatingBoard(false)
      let newBoard = []
      for (let i=0; i<81; i++){
        if (board[i].possibles.length === 1){
          newBoard.push({error: false, given:board[i].possibles[0], possibles: board[i].possibles})
        }else{
          newBoard.push({error: false, given:0, possibles: board[i].possibles})
        }
      }
      dispatch(setBoard(newBoard))
      // TODO: remove the undo history
      dispatch(ActionCreators.clearHistory())
    } else {
      let board = setup(emptyBoard, 3)
      setUserCreatingBoard(true)
      // make sure a click creates a number and not removes a possible
      if (eliminate) {
        dispatch(toggleEliminate())
      }
      dispatch(setBoard(board))
    }
  }

  let jsx = []
  if (board.length === 0) {
    return <div>loading...</div>
  }

  for (var j = 0; j < n; j++) {
    jsx.push(<Section key={"s" + j} order={order} width={width} section={j} board={board} parent={"s" + j} index={j} />)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        margin: "10px"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", fontSize: "14px", marginTop: "11px" }}>
        <button onClick={new3x3Click}>{userCreatingBoard ? "Done" : "New 3x3"}</button>
        <button onClick={reduceCellsClick}>Clean</button>
        <button onClick={uniqueRowsClick}>Unique rows</button>
        <button onClick={uniqueColumnsClick}>Unique columns</button>
        <button onClick={uniqueSectionsClick}>Unique sections</button>
        {/* <button onClick={onlyInACertainRowClick}>Only in this row of this section</button>
        <button onClick={onlyInACertainColumnClick}>Only in this column of this section</button> */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input id="hoverCheckBox" type="checkbox" onClick={doToggleHovering}></input>
          <label htmlFor="hoverCheckBox" style={{ color: "white" }}>
            Hovering
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input id="colorCheckBox" type="checkbox" onClick={doToggleColoring}></input>
          <label htmlFor="colorCheckBox" style={{ color: "white" }}>
            Coloring
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input onChange={toggleAutoClean} checked={autoCleaning} id="autoCleanCheckBox" type="checkbox" />
          <label htmlFor="autoCleanCheckBox" style={{ color: "white" }}>
            Auto clean
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input onChange={toggleEliminateClick} checked={eliminate} id="clickSetsCheckBox" type="checkbox" />
          <label htmlFor="clickSetsCheckBox" style={{ color: "white" }}>
            Eliminate
          </label>
        </div>
      </div>
      <div
        style={{
          width: width + "px",
          height: width + "px",
          display: "flex",
          flexWrap: "wrap",
          margin: "10px",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        {jsx}
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          <UndoRedo />
        </div>
      </div>
    </div>
  )
}

export default Puzzle
