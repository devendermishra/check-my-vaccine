import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import reducer, { loadInitialState } from './helpers/reducers';
import { Provider } from 'react-redux';
import { loadLanguage } from './helpers/multilang';
import translationFile from './translate.json'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ApplicationState } from './helpers/types';


const store = createStore(reducer, loadInitialState());
store.subscribe(() => {
  localStorage.setItem('fav_sites', JSON.stringify((store.getState() as ApplicationState).favoriteSite))
});
loadLanguage(translationFile)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
