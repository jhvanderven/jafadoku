import { createSlice } from "@reduxjs/toolkit"

const controlsSlice = createSlice({
  name: "jafadokuControls",

  initialState: {
    hovering: false,
    hoverValue: 0,
    coloring: false,
    eliminate: true,
  },

  reducers: {
    toggleHovering: state => {
      state.hovering = !state.hovering
      if(!state.hovering){
        state.hoverValue = 0
      }
    },
    setHoverValue: (state, action) => {
      state.hoverValue = action.payload
    },
    toggleColoring: state => {
      state.coloring = !state.coloring
    },
    toggleEliminate: state => {
      state.eliminate= !state.eliminate
    }
  }
})

export const { toggleHovering, setHoverValue, toggleColoring, toggleEliminate} = controlsSlice.actions

export default controlsSlice.reducer
