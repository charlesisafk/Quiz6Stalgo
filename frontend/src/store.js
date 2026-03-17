import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './reducers/authReducers';
import { serviceReducer } from './reducers/serviceReducers';
import { subscriptionReducer } from './reducers/subscriptionReducers';
import { userReducer } from './reducers/userReducers';
import { chatReducer } from './reducers/chatReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  services: serviceReducer,
  subscriptions: subscriptionReducer,
  user: userReducer,
  chat: chatReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
