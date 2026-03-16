// redux/store.ts
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Thêm thunk để xử lý các action bất đồng bộ (async actions)
);

export default store;
