import invert from 'invert-color';

const colors = [
  "#e6194B",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabebe",
  "#469990",
  "#e6beff",
  "#9A6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9",
  "#ffffff",
  "#000000"
]
// const blackText = ["white", "black", "black", "white", "white", "white", "white", "white", "black", "white"]

const setColor = (hovering, possible, coloring, hoverHit, value, isAnswer, isInvalid) => {
  if(value===undefined){
    return({color:'white', backgroundColor: 'red', borderColor:'white'})
  }
  if(isInvalid){
    return({color:'white', backgroundColor: 'red', borderColor:'white'})
  }
  if ((hovering && hoverHit && possible) || (hovering && hoverHit && isAnswer)) {
    return { color: "black", backgroundColor: "cyan", borderColor: "cyan" }
  }
  if (!possible && !isAnswer) {
    return { color: "black", backgroundColor: "black", borderColor: "#333333" }
  }
  if(possible && coloring){
    return {color:invert(colors[value-1], true), backgroundColor:colors[value-1], borderColor:"black"}
  }
  if (isAnswer) {
    if (coloring) {
      return {color: invert(colors[value-1], true), backgroundColor:colors[value-1], borderColor:"black"}
    } else {
      return { color: "white", backgroundColor: "green", borderColor: "white" }
    }
  }
  // let color, backgroundColor, borderColor
  // if (!hovering) {
  //   backgroundColor = possible ? (coloring ? colors[value - 1] : "green") : "black"
  // } else {
  //   backgroundColor = possible ? (hoverHit ? "cyan" : coloring ? colors[value - 1] : "green") : "black"
  // }
  // color = possible ? (hoverHit ? "black" : "white") : "black"
  // if (isAnswer) {
  //   color = hoverHit ? "black" : coloring ? blackText[value - 1] : "white"
  // }
  // borderColor = possible ? (hoverHit ? "cyan" : "white") : "darkgray"
  // if (givenHit) {
  //   backgroundColor = hoverHit ? "cyan" : coloring ? colors[value - 1] : "black"
  // }

  // return { color, backgroundColor, borderColor }
  return { color: "white", backgroundColor: "green", borderColor: "black" }
}

export { setColor }
