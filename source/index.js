import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router';
import App from './app/app.container';
import MapContainer from './components/map_container';
import Intro from './components/pages/intro';
import Glossary from './components/pages/glossary';
import AboutContainer from './components/pages/about_container';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './store/reducer';
import { loadState, saveState } from './store/localStorage';
import thunk from 'redux-thunk';
import { throttle } from 'lodash';

require('./css/main.styl');

// const addLoggingToDispatch = (store) => {
//   const rawDispatch = store.dispatch;

//   return (action) => {
//     console.group(action.type);
//     console.log('%c prev state', 'color: gray', store.getState());
//     console.log('%c action', 'color: blue', action);
//     const returnValue = rawDispatch(action);
//     console.log('%c next state', 'color: green', store.getState());
//     console.groupEnd(action.type);
//     return returnValue;
//   };
// };
const persistedState = loadState();
console.log('persistedState', persistedState);
const store = createStore(rootReducer, persistedState, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// store.dispatch = addLoggingToDispatch(store);

store.subscribe(throttle(() => {
  saveState({
    ui: store.getState().ui
  });
}, 1000));

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={'/intro'} component={Intro} />
      <Route path={'/about'} component={AboutContainer} />
      <Route path={'/glossary'} component={Glossary} />
      <Route path={'/'} component={App}>
        // Yep, this is annoying. Stop React Router Link
        // from adding a trailing slash.
        <Redirect from="/*/" to="/*" />
        <IndexRedirect to="/2013" />
        <Route path={'/:year(/:region)(/:country)(/:stratum)'} component={MapContainer} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('react-root'));
