import { Faculty, Student, ProjectRequest } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface User {
  userId: string;
  name: string;
  email: string;
  type: "Admin" | "Faculty" | "Student" | "SuperAdmin" | "Developer";
  isHOD: boolean;
  labels?: string[]; // Add labels property for role-based access
  facultyData?: Partial<Faculty> | null;
  studentData?: Partial<Student> | null;
  projectRequestStatus?:
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "NoRequest"
  | "Waiting"
  | "TeamPending"
  | "TeammateRejected";
}

export interface authState {
  status: boolean;
  deviceId: string;
  user: User | null;
  projectRequest: ProjectRequest | null;
}

export const initialState: authState = {
  status: false,
  deviceId: "",
  user: null,
  projectRequest: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
      state.projectRequest = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProjectRequestStatus: (state, action) => {
      if (state.user) {
        state.user.projectRequestStatus = action.payload;
      }
    },
    setDeviceId: (state, action) => {
      if (state.deviceId === "" || state.deviceId === undefined) {
        state.deviceId = action.payload;
      }
    },
    setProjectRequest: (state, action) => {
      state.projectRequest = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setUser,
  setProjectRequestStatus,
  setDeviceId,
  setProjectRequest,
} = authSlice.actions;

export default authSlice.reducer;