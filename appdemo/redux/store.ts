// redux/store.ts
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

// Sử dụng legacy_createStore vì createStore hiện tại đã được đánh dấu là deprecated
// để khuyến khích dùng Redux Toolkit (configureStore)
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Thêm thunk để xử lý các action bất đồng bộ (async actions)
);

export default store;
