
import { configureStore } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useGetAuthUserQuery } from "./api";

const initialState = {
  mode: 'dark',
  user: null,
  status: 'idle',
  error: null
};

export const fetchUser = createAsyncThunk('global/fetchUser', async () => {
  const res = await useGetAuthUserQuery();
  return res.currentData;
});

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setUser: (state, data) => {
        state.user = data.payload;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setMode, setUser } = globalSlice.actions;

export default globalSlice.reducer;