// redux/reducers.ts
import { combineReducers } from 'redux';
import { SET_USER, CLEAR_USER, ADD_TASK, DELETE_TASK } from './types';

const userInitialState = {
  data: null,
};

const userReducer = (state = userInitialState, action: any) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, data: action.payload };
    case CLEAR_USER:
      return { ...state, data: null };
    default:
      return state;
  }
};

const tasksInitialState: string[] = [];

const tasksReducer = (state = tasksInitialState, action: any) => {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload];
    case DELETE_TASK:
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  tasks: tasksReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
