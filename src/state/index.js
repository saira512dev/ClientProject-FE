
import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'dark',
  user: JSON.parse(localStorage.getItem('user')),
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setUser: (state, data) => {
        localStorage.setItem("user",data == null ? null : JSON.stringify(data.payload ))
        state.user = data = null ? null : data.payload;
      },
  },
});

export const { setMode, setUser } = globalSlice.actions;

export default globalSlice.reducer;