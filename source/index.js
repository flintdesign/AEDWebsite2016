import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './app/app.container';
import MapContainer from './components/map_container';
import Resources from './components/resources';
import About from './components/about';
import configureStore from './store/configureStore';

const store = configureStore();

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={'/'} component={App}>
        <IndexRoute component={MapContainer} />
        <Route path={'/about'} component={About} />
        <Route path={'/resources'} component={Resources} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('react-root'));
