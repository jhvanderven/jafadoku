import { createSlice } from "@reduxjs/toolkit"
import undoable from 'redux-undo'
import range from "lodash/range"

// in the reducers immer is helping to mutate immutable objects
// call these functions in another context (Puzzle.jsx for instance)
// and you get all kinds of warnings about the inability to mutate stuff
// see https://redux-toolkit.js.org/api/createReducer

const performClean = board => {
  let change = true
  let order = board.length ** 0.25
  while (change) {
    ;[board, change] = reduceCells(board, order)
  }
}

const validateBoard = board => {
  let order = board.length ** 0.25
  const n = order * order
  let change = false

  const validateRows = () => {
    for (let row = 0; row < n; row++) {
      let counts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
      for (let col = 0; col < n; col++) {
        const possibles = board[row * n + col].possibles
        for (let i = 1; i <= n; i++) {
          // count how often i appears in the possibles
          if (possibles.length === 1 && possibles[0]===i) {
            counts[i - 1]++
          }
        }
      }
      for (let i = 0; i < n; i++) {
        if (counts[i] > 1) {
          // which cell contains the (i+1)
          for (let col = 0; col < n; col++) {
            const possibles = board[row * n + col].possibles
            if (possibles.length===1 && possibles[0]===i+1) {
              board[row * n + col].error = true
              change = true
            }
          }
        }
      }
    }
    return [board, change]
  }

  const validateColumns = () => {
    for (let col = 0; col < n; col++) {
      let counts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
      for (let row = 0; row < n; row++) {
        const possibles = board[row * n + col].possibles
        for (let i = 1; i <= n; i++) {
          // count how often i appears in the possibles
          if (possibles.length===1 && possibles[0]===i) {
            counts[i - 1]++
          }
        }
      }
      for (let i = 0; i < n; i++) {
        if (counts[i] > 1) {
          // which cell contains the (i+1)
          for (let row = 0; row < n; row++) {
            const possibles = board[row * n + col].possibles
            if (possibles.length===1 & possibles[0]===i+1) {
              board[row * n + col].error=true
              change=true
            }
          }
        }
      }
    }
    return [board, change]
  }

  const validateSections = () => {
    for (let section = 0; section < n; section++) {
      let counts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
      for (let cell = 0; cell < n; cell++) {
        const idx = (Math.floor(section / order) * order + Math.floor(cell / order)) * n + (section % order) * order + (cell % order)
        const possibles = board[idx].possibles
        for (let i = 1; i <= n; i++) {
          // count how often i appears in the possibles
          if (possibles.length===1&&possibles[0] === i) {
            counts[i - 1]++
          }
        }
      }
      for (let i = 0; i < n; i++) {
        if (counts[i] > 1) {
          // which cells contains the (i+1)
          for (let cell = 0; cell < n; cell++) {
            const idx = (Math.floor(section / order) * order + Math.floor(cell / order)) * n + (section % order) * order + (cell % order)
            const possibles = board[idx].possibles
            if (possibles.length===1 && possibles[0]===i+1) {
              board[idx].error=true
              change = true
            }
          }
        }
      }
    }
    return [board, change]
  }
  
  validateRows()
  validateColumns()
  validateSections()
}

const doUniqueRows = board => {
  let order = board.length ** 0.25
  const n = order * order
  let change = false
  for (let row = 0; row < n; row++) {
    let counts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
    for (let col = 0; col < n; col++) {
      const possibles = board[row * n + col].possibles
      for (let i = 1; i <= n; i++) {
        // count how often i appears in the possibles
        if (possibles.indexOf(i) >= 0) {
          counts[i - 1]++
        }
      }
    }
    // are there single counts?
    for (let i = 0; i < n; i++) {
      if (counts[i] === 1) {
        // which cell contains the (i+1)
        for (let col = 0; col < n; col++) {
          const possibles = board[row * n + col].possibles
          if (possibles.indexOf(i + 1) >= 0 && possibles.length > 1) {
            board[row * n + col].possibles = [i + 1]
            change = true
          }
        }
      }
    }
  }
  return [board, change]
}

const doUniqueColumns = board => {
  let order = board.length ** 0.25
  const n = order * order
  let change = false
  for (let col = 0; col < n; col++) {
    let counts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
    for (let row = 0; row < n; row++) {
      const possibles = board[row * n + col].possibles
      for (let i = 1; i <= n; i++) {
        // count how often i appears in the possibles
        if (possibles.indexOf(i) >= 0) {
          counts[i - 1]++
        }
      }
    }
    // are there single counts?
    for (let i = 0; i < n; i++) {
      if (counts[i] === 1) {
        // which cell contains the (i+1)
        for (let row = 0; row < n; row++) {
          const possibles = board[row * n + col].possibles
          if (possibles.indexOf(i + 1) >= 0 && possibles.length > 1) {
            board[row * n + col].possibles = [i + 1]
          }
          change = true
        }
      }
    }
  }
  return [board, change]
}

const doUniqueSections = board => {
  let order = board.length ** 0.25
  const n = order * order
  let change = false
  for (let section = 0; section < n; section++) {
    let counts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
    for (let cell = 0; cell < n; cell++) {
      const idx = (Math.floor(section / order) * order + Math.floor(cell / order)) * n + (section % order) * order + (cell % order)
      const possibles = board[idx].possibles
      for (let i = 1; i <= n; i++) {
        // count how often i appears in the possibles
        if (possibles.indexOf(i) >= 0) {
          counts[i - 1]++
        }
      }
    }
    // are there single counts?
    for (let i = 0; i < n; i++) {
      if (counts[i] === 1) {
        // which cell contains the (i+1)
        for (let cell = 0; cell < n; cell++) {
          const idx = (Math.floor(section / order) * order + Math.floor(cell / order)) * n + (section % order) * order + (cell % order)
          const possibles = board[idx].possibles
          if (possibles.indexOf(i + 1) >= 0 && possibles.length > 1) {
            board[idx].possibles = [i + 1]
            change = true
          }
        }
      }
    }
  }
  return [board, change]
}

const reduceCells = (board, order) => {
  console.log("reducing immutable board")
  const n = order * order

  const test = (boardCell, value) => {
    return boardCell.possibles.length === 1 && boardCell.possibles[0] === value
  }

  const reduceSameRow = (i, possibles) => {
    const row = Math.floor(i / n)
    let reduced = false
    for (var ro = row * n; ro < (row + 1) * n; ro++) {
      if (ro !== i) {
        for (var m = 1; m <= n; m++) {
          if (test(board[ro], m)) {
            // indexOf is necessary
            if (possibles.indexOf(m) >= 0) {
              possibles.splice(possibles.indexOf(m), 1)
              // console.log("remove", m, "from row ", row, ro, i, newPossibles)
              reduced = true
            }
          }
        }
      }
    }
    return [possibles, reduced]
  }

  const reduceSameColumn = (i, possibles) => {
    const col = i % n
    let reduced = false
    for (var co = col; co < n * n - n + col + 1; co = co + n) {
      if (co !== i) {
        for (var k = 1; k <= n; k++) {
          if (test(board[co], k)) {
            // indexOf is necessary
            if (possibles.indexOf(k) >= 0) {
              possibles.splice(possibles.indexOf(k), 1)
              // console.log('remove', k, 'from column ', col, co, i)
              reduced = true
            }
          }
        }
      }
    }
    return [possibles, reduced]
  }

  const reduceSameSection = (i, possibles) => {
    const section = Math.floor(Math.floor(i / n) / order) * order + Math.floor((i % n) / order)
    let reduced = false
    for (var p = 0; p < n; p++) {
      const idx = (Math.floor(section / order) * order + Math.floor(p / order)) * n + (section % order) * order + (p % order)
      if (idx !== i) {
        for (var l = 1; l <= n; l++) {
          if (test(board[idx], l)) {
            // indexOf is necessary
            if (possibles.indexOf(l) >= 0) {
              possibles.splice(possibles.indexOf(l), 1)
              // console.log('remove', l, 'from section ', section)
              reduced = true
            }
          }
        }
      }
    }
    return [possibles, reduced]
  }

  let change = false
  for (var i = 0; i < n * n; i++) {
    let reducedRow, reducedCol, reducedSection
    if (board[i].possibles.length > 1) {
      let possibles = board[i].possibles
      ;[possibles, reducedRow] = reduceSameRow(i, possibles)
      ;[possibles, reducedCol] = reduceSameColumn(i, possibles)
      ;[possibles, reducedSection] = reduceSameSection(i, possibles)
      change = change || reducedRow || reducedCol || reducedSection
    }
  }
  return [board, change]
}

const boardSlice = createSlice({
  name: "jafadoku",

  initialState: {
    board: [],
    autoCleaning: true
  },

  reducers: {
    setBoard: (state, action) => {
      state.board = action.payload
      validateBoard(state.board)
    },
    toggleAutoCleaning: state => {
      state.autoCleaning = !state.autoCleaning
    },
    setCellValue: (state, action) => {
      state.board[action.payload.index].possibles = [action.payload.value]
      validateBoard(state.board)
      if (state.autoCleaning) {
        performClean(state.board)
      }
    },
    toggleCellValue: (state, action) => {
      let possibles = state.board[action.payload.index].possibles
      if (possibles.indexOf(action.payload.value) >= 0) {
        possibles.splice(possibles.indexOf(action.payload.value), 1)
      } else {
        possibles.push(action.payload.value)
      }
      if (possibles.length===1){
        validateBoard(state.board)
      }
      if (state.autoCleaning) {
        performClean(state.board)
      }
    },
    cleaning: state => {
      performClean(state.board)
    },
    uniqueRows: state => {
      doUniqueRows(state.board)
      if (state.autoCleaning) {
        performClean(state.board)
      }
    },
    uniqueColumns: state => {
      doUniqueColumns(state.board)
      if (state.autoCleaning) {
        performClean(state.board)
      }
    },
    uniqueSections: state => {
      doUniqueSections(state.board)
      if (state.autoCleaning) {
        performClean(state.board)
      }
    },
    validate:state=>{
      validateBoard(state.board)
    }
  }
})

export const { toggleAutoCleaning, setBoard, toggleCellValue, setCellValue, resetCell, cleaning, uniqueRows, uniqueColumns, uniqueSections } = boardSlice.actions

const undoableBoard = undoable(boardSlice.reducer)

export default undoableBoard

// const onlyInACertainRowOfASection = (board, order) => {
//   const n = order * order
//   let aBoard = board.slice()
//   let change = false
//   for (let row = 0; row < n; row++) {
//     let rowCounts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
//     for (let col = 0; col < n; col++) {
//       const possibles = board[row * n + col]
//       for (let i = 1; i <= n; i++) {
//         // count how often i appears in the possibles
//         if (possibles.indexOf(i) >= 0) {
//           rowCounts[i - 1]++
//         }
//       }
//     }
//     // are all hits in the same section?
//     // then we can remove this thing from the other rows of the same section
//     // sections and rows need to match
//     let startSection = Math.floor(row / order)
//     for (let section = startSection; section < startSection + order; section++) {
//       let sectionCounts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
//       for (let cell = 0; cell < n; cell++) {
//         const idx = (Math.floor(section / order) * order + Math.floor(cell / order)) * n + (section % order) * order + (cell % order)
//         // is idx part of row?
//         if (idx >= row * n && idx < (row + 1) * n) {
//           const possibles = board[idx]
//           for (let i = 1; i <= n; i++) {
//             if (possibles.indexOf(i) >= 0) {
//               sectionCounts[i - 1]++
//             }
//           }
//         }
//       }
//       for (let i = 0; i < n; i++) {
//         if (sectionCounts[i] > 1 && sectionCounts[i] === rowCounts[i]) {
//           // i only present on this row in this section...
//           // so we can remove i from the other rows in this section
//           // which rows belong the same section as 'row'?
//           let startRow = Math.floor(row / order)
//           console.log(i + 1, "only appears in row", row, "of section", section)
//           for (let otherRow = startRow; otherRow < startRow + order; otherRow++) {
//             console.log("otherRow", otherRow)
//             if (row !== otherRow) {
//               for (let col = 0; col < order; col++) {
//                 const possibles = board[otherRow * n + col + section * order]
//                 console.log(i + 1, otherRow * n + col + section * order, possibles)
//                 if (possibles.indexOf(i + 1) >= 0) {
//                   console.log("removing", i + 1, "from row", otherRow, col, possibles)
//                   possibles.splice(possibles.indexOf(i + 1), 1)
//                   aBoard[otherRow * n + col + section * order] = possibles
//                   change = true
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
//   return [aBoard, change]
// }

// const onlyInACertainColumnOfASection = (board, order) => {
//   const n = order * order
//   let aBoard = board.slice()
//   let change = false
//   for (let col = 0; col < n; col++) {
//     let colCounts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
//     for (let row = 0; row < n; row++) {
//       const possibles = board[row * n + col]
//       for (let i = 1; i <= n; i++) {
//         // count how often i appears in the possibles
//         if (possibles.indexOf(i) >= 0) {
//           colCounts[i - 1]++
//         }
//       }
//     }
//     // are all hits in the same section?,
//     // then we can remove this thing from the other columns of the same section
//     // sections and columns need to match
//     let startSection = col % n
//     for (let section = startSection; section < n; section += order) {
//       let sectionCounts = Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)
//       for (let cell = 0; cell < n; cell++) {
//         const idx = (Math.floor(section / order) * order + Math.floor(cell / order)) * n + (section % order) * order + (cell % order)
//         // is idx part the col?
//         if (idx % n === col) {
//           //?
//           const possibles = board[idx]
//           for (let i = 1; i <= n; i++) {
//             if (possibles.indexOf(i) >= 0) {
//               sectionCounts[i - 1]++
//             }
//           }
//         }
//       }
//       for (let i = 0; i < n; i++) {
//         if (sectionCounts[i] > 1 && sectionCounts[i] === colCounts[i]) {
//           // i only present on this col in this section...
//           // so we can remove i from the other cols in this section
//           // which cols belong the same section as 'col'?
//           // let startRow = Math.floor(row / order)
//           console.log(i + 1, "only appears in col", col, "of section", section)
//           // for (let otherRow = startRow; otherRow < startRow + order; otherRow++) {
//           //   console.log('otherRow', otherRow)
//           //   if (row !== otherRow) {
//           //     for (let col = 0; col < order; col++) {
//           //       const possibles = board[otherRow * n + col + section * order]
//           //       console.log(i+1, otherRow * n + col + section * order, possibles)
//           //       if (possibles.indexOf(i+1) >= 0) {
//           //         console.log("removing", i+1, "from row", otherRow, col, possibles)
//           //         possibles.splice(possibles.indexOf(i+1), 1)
//           //         aBoard[otherRow * n + col + section * order] = possibles
//           //         change = true
//           //       }
//           //     }
//           //   }
//           // }
//         }
//       }
//     }
//   }
//   return [aBoard, change]
// }

// const getAllSubsets = theArray => theArray.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]])

// console.log(getAllSubsets([1, 2, 3]))
