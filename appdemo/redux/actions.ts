// redux/actions.ts
import { SET_USER, CLEAR_USER, ADD_TASK, DELETE_TASK } from './types';

export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const addTask = (task: string) => ({
  type: ADD_TASK,
  payload: task,
});

export const deleteTask = (id: number) => ({
  type: DELETE_TASK,
  payload: id,
});
