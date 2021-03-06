import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Redirect, IndexRedirect, browserHistory } from 'react-router';
import App from './app/app.container';
import MapContainer from './components/map_container';
import Intro from './components/pages/intro';
import Glossary from './components/pages/glossary';
import Overview from './components/pages/overview';
import AESR2016 from './components/pages/aesr2016';
import References from './components/pages/references';
import Errata2016 from './components/pages/errata_2016';
import ErrorPage from './components/pages/404';
import DARP from './components/pages/darp';
import AboutContainer from './components/pages/about_container';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './store/reducer';
import thunk from 'redux-thunk';

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
const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// store.dispatch = addLoggingToDispatch(store);

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={'/intro'} component={Intro} />
      <Route path={'/about'} component={AboutContainer} />
      <Route path={'/glossary'} component={Glossary} />
      <Route path={'/overview'} component={Overview} />
      <Route path={'/aesr-2016'} component={AESR2016} />
      <Route path={'/references'} component={References} />
      <Route path={'/errata-2016'} component={Errata2016} />
      <Route path={'/darp'} component={DARP} />
      <Route path={'/404'} component={ErrorPage} />
      <Route path={'/'} component={App}>
        // Yep, this is annoying. Stop React Router Link
        // from adding a trailing slash.
        <Redirect from="/*/" to="/*" />
        <IndexRedirect to="/2015" />
        <Route path={'/:year(/:region)(/:country)(/:input_zone)'} component={MapContainer} />
      </Route>
      <Route path="*" component={ErrorPage} />
    </Router>
  </Provider>
), document.getElementById('react-root'));
