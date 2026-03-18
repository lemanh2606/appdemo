import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Mảng chứa các task dưới dạng string
const initialState: string[] = [];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<string>) {
      state.push(action.payload);
    },
    deleteTask(state, action: PayloadAction<number>) {
      // payload là index cần xóa
      return state.filter((_, index) => index !== action.payload);
    },
  },
});

export const { addTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
