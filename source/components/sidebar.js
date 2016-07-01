import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ADDSidebar from './add_sidebar';
import DPPSSidebar from './dpps_sidebar';
import StratumSidebar from './stratum_sidebar';
import CountTypeToggle from './count_type_toggle';
import { fetchGeography } from '../api';
import { pluralize, getNextGeography, getEntityName, titleize } from '../utils/convenience_funcs';
import compact from 'lodash.compact';
import find from 'lodash.find';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCurrentTitle = this.getCurrentTitle.bind(this);
    this.fetchAPIData = this.fetchAPIData.bind(this);
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
    return this.state.currentTitle === title ? 'active' : null;
  }

  getStratumFromHref() {
    const parts = this.props.location.pathname.split('/');
    const stratumName = parts[parts.length - 1];
    return find(this.props.geographies.strata, s => s.stratum === titleize(stratumName));
  }

  fetchAPIData() {
    const { dispatch, year, countType, currentGeography, currentGeographyId } = this.props;
    fetchGeography(dispatch, currentGeography, currentGeographyId, year, countType);
  }

  handleClick(e) {
    if (e.target.dataset.title) {
      this.setState({
        currentTitle: e.target.dataset.title
      });
    }
    this.fetchAPIData();
  }

  subGeographyHasCorrectKeys(vizType) {
    const { geographies, currentGeography } = this.props;
    const subGeography = getNextGeography(currentGeography);
    return (vizType === 'add' && geographies[`${pluralize(subGeography)}_sums`]) ||
    (vizType === 'dpps' && geographies[`${pluralize(subGeography)}_sum`]);
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
    } = this.props;

    const years = ['2013', '2006', '2002', '1998', '1995'];
    const yearLinks = years.map(y => {
      const toVal = compact(window.location.pathname.split('/'));
      const linkVal = toVal.length ? [y, toVal.splice(1)].join('/') : y;
      const className = (y === this.props.year) ||
        (!this.props.year && y === '2013') ? 'current' : null;
      return (
        <li
          key={y} className={className}
        >
          <Link onClick={this.handleClick} to={`/${linkVal}`}>{y}</Link>
        </li>
      );
    });

    const sidebarInnerClassName = `sidebar__inner ${currentGeography}-${currentGeographyId}`;
    const sidebarClasses = ['closed', 'open', 'full'];

    return (
      <aside className={sidebarClasses[sidebarState]}>
        <section className={sidebarInnerClassName}>
          <div className="sidebar__year-nav__container">
            <ul className="sidebar__year-nav">
              {yearLinks}
            </ul>
          </div>
          <h1 className="sidebar__entity-name">{getEntityName(this.props.location)}</h1>
          {!geographies.strata &&
            <div>
              <nav className="sidebar__viz-type">
                <ul>
                  <li onClick={this.handleClick}>
                    <Link
                      className={this.getCurrentTitle('summary')}
                      data-title={'summary'}
                      to={{
                        pathname: location.pathname,
                        query: { ...location.query, viz_type: 'summary_area' } }}
                    >
                      Summary totals &amp; Area of range covered
                    </Link>
                  </li>
                  <li onClick={this.handleClick}>
                    <Link
                      className={this.getCurrentTitle('totals')}
                      data-title={'totals'}
                      to={{ pathname: location.pathname,
                        query: { ...location.query, viz_type: 'continental_regional' } }}
                    >
                      Continental &amp; regional totals
                    </Link>
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

          {this.shouldRenderSidebar('add') &&
            <ADDSidebar
              geographies={geographies}
              currentTitle={this.state.currentTitle}
              currentGeography={currentGeography}
              sidebarState={sidebarState}
              year={year}
            />
          }

          {this.shouldRenderSidebar('dpps') &&
            <DPPSSidebar
              geographies={geographies}
              currentTitle={this.state.currentTitle}
              currentGeography={currentGeography}
              sidebarState={sidebarState}
            />
          }

          {this.onAStratum() &&
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
  sidebarState: PropTypes.number.isRequired,
  location: PropTypes.object,
  params: PropTypes.object,
  countType: PropTypes.string,
  geographies: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  year: PropTypes.string.isRequired,
  currentGeography: PropTypes.string.isRequired,
  currentGeographyId: PropTypes.string.isRequired,
};

export default Sidebar;
