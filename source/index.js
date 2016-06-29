import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './app/app.container';
import MapContainer from './components/map_container';
import Resources from './components/resources';
import About from './components/about';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './store/reducer';
import thunk from 'redux-thunk';

require('./css/main.styl');

const store = createStore(rootReducer, applyMiddleware(thunk));

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={'/'} component={App}>
        <IndexRoute component={MapContainer} />
        <Route path={'/about'} component={About} />
        <Route path={'/resources'} component={Resources} />
        <Route path={'/:year'} component={MapContainer} />
        <Route path={'/:year/:region'} component={MapContainer} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('react-root'));
