import React from 'react';
import { Link } from 'react-router';
import Search from './search';

export default function Nav() {
  return (
    <nav>
      <div className="links__left">
        <Link className="nav__link" to={'/'}>Elephant<br />Database</Link>
        {' '}
        <div className="search__container">
          <Search />
        </div>
      </div>
      <div className="links__right">
        <Link className="nav__link" to={'/about'}>About</Link>
        {' '}
        <Link className="nav__link" to={'/resources'}>Resources</Link>
        <span>Toggle Sidebar</span>
      </div>
    </nav>
  );
}
