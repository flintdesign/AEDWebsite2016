import React, { PropTypes } from 'react';
import {
  SIDEBAR_CLOSED,
  SIDEBAR_FULL,
  SIDEBAR_OPEN
} from '../../constants';
import Search from './search';
import ReactTooltip from 'react-tooltip';

export default function Nav(props) {
  const {
    sidebarState,
    expandSidebar,
    contractSidebar,
    loading,
    searchActive
  } = props;
  const searchStatus = searchActive === false ? 'closed' : 'open';
  const expandClass = sidebarState === SIDEBAR_CLOSED ? 'closed' : 'open';
  const expand = sidebarState < SIDEBAR_FULL && (
    <div>
      <div
        className={`sidebar__toggle sidebar__toggle--expand ${expandClass}`}
        onClick={expandSidebar}
        dangerouslySetInnerHTML={{ __html: '&larr;' }}
        data-tip
        data-for="openSidebar"
      />
      {sidebarState === SIDEBAR_CLOSED &&
        <ReactTooltip
          id="openSidebar"
          place="bottom"
          type="dark"
          effect="solid"
        >
          <span>Click arrow to open sidebar.</span>
        </ReactTooltip>
      }
      {sidebarState === SIDEBAR_OPEN &&
        <ReactTooltip
          id="openSidebar"
          place="left"
          type="dark"
          effect="solid"
        >
          <span>Click to see table.</span>
        </ReactTooltip>
      }
    </div>
  );

  const contract = sidebarState > SIDEBAR_CLOSED && (
    <div
      className="sidebar__toggle sidebar__toggle--contract open"
      onClick={contractSidebar}
      dangerouslySetInnerHTML={{ __html: '&rarr;&nbsp;|' }}
    />
  );

  return (
    <nav className={`site-nav sidebar-${expandClass} search-${searchStatus}`}>
      <Search year={props.params.year} showIntro={props.showIntro} sidebarState={sidebarState} />
      {!loading && expand}
      {!loading && contract}
    </nav>
  );
}

Nav.propTypes = {
  expandSidebar: PropTypes.func.isRequired,
  contractSidebar: PropTypes.func.isRequired,
  sidebarState: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  searchActive: PropTypes.bool.isRequired,
  showIntro: PropTypes.bool.isRequired
};
