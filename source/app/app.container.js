import React, { PropTypes } from 'react';
import Nav from '../components/nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';

export default function App(props) {
  return (
    <div className="container main__container">
      <main>
        <Nav />
        {props.children}
      </main>
      <Sidebar />
      <TotalCount />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object.isRequired
};
