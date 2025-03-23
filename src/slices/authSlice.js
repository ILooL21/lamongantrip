import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: localStorage.getItem("Access-token") ? JSON.parse(localStorage.getItem("Access-token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isLogin = action.payload;
      localStorage.setItem("Access-token", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLogin = null;
      localStorage.removeItem("Access-token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
