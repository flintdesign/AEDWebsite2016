import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router';
import App from './app/app.container';
import MapContainer from './components/map_container';
import Resources from './components/resources';
import About from './components/about';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './store/reducer';
import thunk from 'redux-thunk';

require('./css/main.styl');

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={'/'} component={App}>
        // Yep, this is annoying. Stop React Router Link
        // from adding a trailing slash.
        <Redirect from="/*/" to="/*" />
        <IndexRedirect to="/2013" />
        <Route path={'/about'} component={About} />
        <Route path={'/resources'} component={Resources} />
        <Route path={'/:year(/:region)(/:country)(/:stratum)'} component={MapContainer} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('react-root'));
