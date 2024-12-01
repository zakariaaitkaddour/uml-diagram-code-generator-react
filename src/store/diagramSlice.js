import { createSlice } from '@reduxjs/toolkit';

const diagramSlice = createSlice({
  name: 'diagram',
  initialState: {
    classes: [],
  },
  reducers: {
    addClass(state, action) {
      state.classes.push(action.payload);
    },
    addAttribute(state, action) {
      const { classId, attribute } = action.payload;
      const classObj = state.classes.find(c => c.id === classId);
      if (classObj) {
        classObj.attributes.push(attribute);
      }
    },
  },
});

export const { addClass, addAttribute } = diagramSlice.actions;
export default diagramSlice.reducer;
