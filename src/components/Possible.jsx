import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { setCellValue, toggleCellValue } from "../redux/boardSlice"
import { setHoverValue } from "../redux/controlsSlice"
import {setColor} from "../utils/coloring"

const Possible = ({ width, order, index, value, possible }) => {
  const hoverValue = useSelector(state => state.controls.hoverValue)
  const hovering = useSelector(state => state.controls.hovering)
  const coloring = useSelector(state => state.controls.coloring)
  const eliminate = useSelector(state => state.controls.eliminate)
  const dispatch = useDispatch()

  const possibleWidth = width / order - order
  const squareStyle = {
    width: possibleWidth + "px",
    height: possibleWidth + "px",
    borderStyle: "solid",
    borderWidth: "1px",
    align: "center",
    verticalAlign: "middle",
    fontSize: possibleWidth - 5 + "px"
  }

  // if (hoverValue === 0) {
  //   squareStyle.backgroundColor = possible ? (coloring ? colors[value - 1] : "green") : "black"
  // } else {
  //   squareStyle.backgroundColor = possible ? (hoverValue === value ? "cyan" : coloring ? colors[value - 1] : "green") : "black"
  // }
  // squareStyle.color = possible ? (hoverValue === value? "black": "white") : "black"
  // squareStyle.borderColor = possible ? (hoverValue === value ? "cyan" : "white") : "darkgray"

  const {color, backgroundColor, borderColor} = setColor(hovering, possible, coloring, value===hoverValue, value)
  squareStyle.color = color
  squareStyle.backgroundColor = backgroundColor
  squareStyle.borderColor = borderColor
  const toggle = () => {
    if (eliminate){
      dispatch(toggleCellValue({index:index, value:value}))
    }else{
      dispatch(setCellValue({index:index, value:value}))
    }
  }

  const hover = () => {
    if (hovering) {
      dispatch(setHoverValue(value))
    }
  }

  return (
    <div style={squareStyle} onClick={toggle} onMouseOver={hover}>
      {value}
    </div>
  )
}

export default Possible
