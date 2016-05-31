import React, { PropTypes } from 'react';
import Nav from '../components/nav';

export default function App(props) {
  return (
    <div className="container main__container">
      <main>
        <Nav />
        {props.children}
      </main>
      <aside>
        <h1>Sidebar</h1>
      </aside>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object.isRequired
};
