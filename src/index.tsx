import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import { createStore, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from './redux/reducer/reducer'
import {watchOutFunctions} from './redux/saga/index'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import Spinner from '@mui/material/CircularProgress';

const sagaMiddleWare=createSagaMiddleware();
const store=createStore(reducer,applyMiddleware(sagaMiddleWare))
sagaMiddleWare.run(watchOutFunctions)

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

ReactDOM.render(
  <React.StrictMode>
     <Provider store={store}>
       <Suspense fallback={<Spinner style={{ marginLeft: '50%', marginTop: '20%'  }} />}>
        <BrowserRouter>
            <LazyApp />
        </BrowserRouter>
       </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
