import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router';
import App from './app/app.container';
import MapContainer from './components/map_container';
import Resources from './components/pages/resources';
import AboutContainer from './components/pages/about_container';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './store/reducer';
import thunk from 'redux-thunk';

require('./css/main.styl');

const addLoggingToDispatch = (store) => {
  const rawDispatch = store.dispatch;

  return (action) => {
    console.group(action.type);
    console.log('%c prev state', 'color: gray', store.getState());
    console.log('%c action', 'color: blue', action);
    const returnValue = rawDispatch(action);
    console.log('%c next state', 'color: green', store.getState());
    console.groupEnd(action.type);
    return returnValue;
  };
};

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

store.dispatch = addLoggingToDispatch(store);

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={'/about'} component={AboutContainer} />
      <Route path={'/resources'} component={Resources} />
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
