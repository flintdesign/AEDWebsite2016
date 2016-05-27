import React, { PropTypes } from 'react';
import Nav from '../components/nav';

export default function App(props) {
  return (
    <div className="container">
      <Nav />
      {props.children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object.isRequired
};
