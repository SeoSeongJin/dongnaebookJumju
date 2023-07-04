import reducers from '../reducers';
import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import mySaga from '../../sagas';
// import logger from 'redux-logger';
// import thunk from 'redux-thunk';

const sagaMiddleware = createSagaMiddleware();

export default function initStore() {
  const store = createStore(reducers, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(mySaga);
  return store;
}
