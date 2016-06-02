import React, { PropTypes } from 'react';
// import { Link } from 'react-router';
import Search from './search';

export default function Nav(props) {
  const symbol = props.showSidebar ? { __html: '&rarr;&nbsp;|' } : { __html: '&larr;' };
  const toggleClassName = props.showSidebar ? 'sidebar__toggle open' : 'sidebar__toggle closed';
  return (
    <nav className="site-nav">
      <div className="search__container">
        <Search />
      </div>
      <div
        className={toggleClassName}
        onClick={props.onHandleClick}
        dangerouslySetInnerHTML={symbol}
      />
    </nav>
  );
}

Nav.propTypes = {
  onHandleClick: PropTypes.func.isRequired,
  showSidebar: PropTypes.bool.isRequired
};
