import { createSlice } from "@reduxjs/toolkit";

export interface settingsState {
  ProjectMode: "Major" | "Minor";
  ProjectLimit: number;
  studentAccessLocked: boolean;
  facultyAccessLocked: boolean;
}

export const initialState: settingsState = {
  ProjectMode: "Minor",
  ProjectLimit: 5,
  studentAccessLocked: false,
  facultyAccessLocked: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setProjectMode(state, action) {
      state.ProjectMode = action.payload;
    },
    setProjectLimit(state, action) {
      state.ProjectLimit = action.payload;
    },
    setSettings(state, action) {
      state.ProjectMode = action.payload.ProjectMode;
      state.ProjectLimit = action.payload.ProjectLimit;
      state.studentAccessLocked = action.payload.studentAccessLocked;
      state.facultyAccessLocked = action.payload.facultyAccessLocked;
    },
  },
});

export const { setProjectMode, setProjectLimit, setSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;