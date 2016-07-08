import React, { PropTypes } from 'react';
import {
  SIDEBAR_CLOSED,
  SIDEBAR_FULL,
} from '../constants';
import Search from './search';

export default function Nav(props) {
  const { sidebarState, expandSidebar, contractSidebar } = props;

  const expandClass = sidebarState === SIDEBAR_CLOSED ? 'closed' : 'open';
  const expand = sidebarState < SIDEBAR_FULL && (
    <div
      className={`sidebar__toggle sidebar__toggle--expand ${expandClass}`}
      onClick={expandSidebar}
      dangerouslySetInnerHTML={{ __html: '&larr;' }}
    />
  );

  const contract = sidebarState > SIDEBAR_CLOSED && (
    <div
      className="sidebar__toggle sidebar__toggle--contract open"
      onClick={contractSidebar}
      dangerouslySetInnerHTML={{ __html: '&rarr;&nbsp;|' }}
    />
  );

  return (
    <nav className="site-nav">
      <Search />
      {expand}
      {contract}
    </nav>
  );
}

Nav.propTypes = {
  expandSidebar: PropTypes.func.isRequired,
  contractSidebar: PropTypes.func.isRequired,
  sidebarState: PropTypes.number.isRequired,
};
