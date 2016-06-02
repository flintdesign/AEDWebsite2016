import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Search from './search';

export default function Nav(props) {
  const secondaryLinkClass = `${props.showSecondaryLinks ? 'shown__ib' : 'hidden'} nav__link`;
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
        <Link className={secondaryLinkClass} to={'/about'}>About</Link>
        {' '}
        <Link className={secondaryLinkClass} to={'/resources'}>Resources</Link>
        <span onClick={props.onHandleClick}>S</span>
      </div>
    </nav>
  );
}

Nav.propTypes = {
  onHandleClick: PropTypes.func.isRequired,
  showSecondaryLinks: PropTypes.bool.isRequired
};
