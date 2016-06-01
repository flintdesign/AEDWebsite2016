import React, { PropTypes } from 'react';
import Nav from '../components/nav';
import Sidebar from '../components/sidebar';
import TotalCount from '../components/total_count';

export default function App(props) {
  const isHome = props.location.pathname === '/';
  const sidebar = isHome ? <Sidebar /> : null;
  const totalCount = isHome ? <TotalCount /> : null;
  return (
    <div className="container main__container">
      <main>
        <Nav />
        {props.children}
      </main>
      {sidebar}
      {totalCount}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
