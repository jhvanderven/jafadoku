import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { setHoverValue } from "../redux/controlsSlice"
import {setColor} from "../utils/coloring"

const AnswerCell = ({ width, order, answer, given, index, error }) => {
  const hoverValue = useSelector(state => state.controls.hoverValue)
  const hovering = useSelector(state => state.controls.hovering)
  const coloring = useSelector(state => state.controls.coloring)
  const dispatch = useDispatch()

  const answerWidth = width - order
  const squareStyle = {
    width: answerWidth + "px",
    height: answerWidth + "px",
    borderStyle: "solid",
    borderWidth: "1px",
    align: "center",
    verticalAlign: "middle",
    fontSize: answerWidth - 10 + "px",
    fontWeight: 500
  }

  const {color, backgroundColor, borderColor} = setColor(hovering, false, coloring, answer===hoverValue, answer, true, answer===undefined||error)
  squareStyle.color = color
  squareStyle.backgroundColor = backgroundColor
  squareStyle.borderColor = borderColor

  if (given === answer) {
    squareStyle.borderStyle = "dashed"
    squareStyle.fontWeight = 100
  }

  if (answer === undefined){
    answer = '?'
  }

  const hover = () => {
    if (hovering) {
      dispatch(setHoverValue(answer))
    }
  }

  return (
    <div style={squareStyle} onMouseOver={hover}>
      {answer}
    </div>
  )
}

export default AnswerCell
