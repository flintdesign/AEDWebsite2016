import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ADDSidebar from './add_sidebar';
import DPPSSidebar from './dpps_sidebar';
import StratumSidebar from './stratum_sidebar';
import CountTypeToggle from './count_type_toggle';
import compact from 'lodash.compact';
import find from 'lodash.find';
import isArray from 'lodash.isarray';
import {
  pluralize,
  getNextGeography,
  getEntityName,
  titleize,
  getParentRegionFromURL
} from '../utils/convenience_funcs';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSpanClick = this.handleSpanClick.bind(this);
    this.getCurrentTitle = this.getCurrentTitle.bind(this);
    this.subGeographyHasCorrectKeys = this.subGeographyHasCorrectKeys.bind(this);
    this.shouldRenderSidebar = this.shouldRenderSidebar.bind(this);
    this.onAStratum = this.onAStratum.bind(this);
    this.state = {
      currentTitle: 'summary_area'
    };
  }

  onAStratum() {
    return compact(this.props.location.pathname.split('/')).length === 4;
  }

  getCurrentTitle(title) {
    let currentClass = 'sidebar__viz-toggle';
    if (this.state.currentTitle === title) currentClass += ' active';
    return currentClass;
  }

  getStratumFromHref() {
    const parts = this.props.location.pathname.split('/');
    const stratumName = parts[parts.length - 1];
    return find(this.props.geographies.strata, s => s.stratum === titleize(stratumName));
  }

  handleSpanClick(e) {
    this.setState({ currentTitle: e.target.dataset.title });
  }

  subGeographyHasCorrectKeys(vizType) {
    const { geographies, currentGeography } = this.props;
    const subGeography = getNextGeography(currentGeography);
    return (
      (vizType === 'add' && isArray(geographies[`${pluralize(subGeography)}_sums`]))
      ||
      (vizType === 'dpps' && isArray(geographies[`${pluralize(subGeography)}_sum`]))
    );
  }

  shouldRenderSidebar(sidebar) {
    const { countType, loading } = this.props;
    if (loading) return false;
    if (sidebar === 'add') {
      return (typeof countType === 'undefined' || countType === 'ADD') &&
        this.subGeographyHasCorrectKeys('add');
    }
    return countType === 'DPPS' && this.subGeographyHasCorrectKeys('dpps');
  }

  render() {
    const {
      sidebarState,
      location,
      geographies,
      loading,
      year,
      currentGeography,
      currentGeographyId,
      error
    } = this.props;

    const years = ['2013', '2006', '2002', '1998', '1995'];
    const yearLinks = years.map(y => {
      const toVal = compact(window.location.pathname.split('/'));
      const linkVal = toVal.length ? `${y}/${toVal.splice(1).join('/')}` : y;
      const className = (y === this.props.year) ||
        (!this.props.year && y === '2013') ? 'current' : null;
      return (
        <li
          key={y} className={className}
        >
          <Link to={`/${linkVal}`}>{y}</Link>
        </li>
      );
    });

    let sidebarInnerClassName = `sidebar__inner ${currentGeography}__${currentGeographyId}`;
    sidebarInnerClassName += ` region__${getParentRegionFromURL(location)}`;
    const sidebarClasses = ['closed', 'open', 'full'];

    const self = this;

    return (
      <aside className={sidebarClasses[sidebarState]}>
        <section className={sidebarInnerClassName}>
          <div className="sidebar__year-nav__container">
            <ul className="sidebar__year-nav">
              {yearLinks}
            </ul>
          </div>
          <h1 className="sidebar__entity-name">{getEntityName(this.props.location)}</h1>
          {geographies && !geographies.strata &&
            <div>
              <nav className="sidebar__viz-type">
                <ul>
                  <li onClick={self.handleSpanClick}>
                    <span
                      className={this.getCurrentTitle('summary_area')}
                      data-title={'summary_area'}
                    >
                      Summary totals &amp; Area of range covered
                    </span>
                  </li>
                  <li onClick={self.handleSpanClick}>
                    <span
                      className={this.getCurrentTitle('totals')}
                      data-title={'totals'}
                    >
                      Continental &amp; regional totals
                    </span>
                  </li>
                </ul>
              </nav>
              <CountTypeToggle
                location={location}
              />
            </div>
          }
        </section>

        <section className="sidebar__inner">
          {loading &&
            <h1>Loading <span className="loading-spinner"></span></h1>
          }

          {!loading && error &&
            <div>
              <h1>There was an error loading data.</h1>
              <p>
                We're sorry, there's no data for this combination of year and geographic location.
                Please try another area or date.
              </p>
            </div>
          }

          {geographies && this.shouldRenderSidebar('add') &&
            <ADDSidebar
              geographies={geographies}
              currentTitle={this.state.currentTitle}
              currentGeography={currentGeography}
              sidebarState={sidebarState}
              year={year}
            />
          }

          {geographies && this.shouldRenderSidebar('dpps') &&
            <DPPSSidebar
              geographies={geographies}
              currentTitle={this.state.currentTitle}
              currentGeography={currentGeography}
              sidebarState={sidebarState}
            />
          }

          {this.onAStratum() && this.getStratumFromHref() &&
            <StratumSidebar
              stratum={this.getStratumFromHref()}
            />
          }
        </section>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  error: PropTypes.string,
  sidebarState: PropTypes.number.isRequired,
  location: PropTypes.object,
  params: PropTypes.object,
  countType: PropTypes.string,
  geographies: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  year: PropTypes.string.isRequired,
  currentGeography: PropTypes.string,
  currentGeographyId: PropTypes.string,
};

export default Sidebar;
