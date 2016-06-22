import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ADDSidebar from './add_sidebar';
import DPPSSidebar from './dpps_sidebar';
import CountTypeToggle from './count_type_toggle';
import { fetchGeography } from '../api';
import { pluralize, getNextGeography } from '../utils/convenience_funcs';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCurrentTitle = this.getCurrentTitle.bind(this);
    this.fetchAPIData = this.fetchAPIData.bind(this);
    this.subGeographyHasCorrectKeys = this.subGeographyHasCorrectKeys.bind(this);
    this.shouldRenderSidebar = this.shouldRenderSidebar.bind(this);
    this.state = {
      currentTitle: 'summary_area'
    };
  }

  getCurrentTitle(title) {
    return this.state.currentTitle === title ? 'active' : null;
  }

  fetchAPIData() {
    const { dispatch, year, countType } = this.props;
    fetchGeography(dispatch, 'continent', '2', year, countType);
  }

  handleClick(e) {
    this.setState({
      currentTitle: e.target.dataset.title
    });
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
    const { showSidebar, location, geographies, loading, year, currentGeography } = this.props;

    return (
      <aside className={showSidebar ? 'open' : 'closed'}>
        <section className="sidebar__inner">
          <div className="sidebar__year-nav__container">
            <ul className="sidebar__year-nav">
              <li className="current">2013</li>
              <li>2006</li>
              <li>2002</li>
              <li>1998</li>
              <li>1995</li>
            </ul>
          </div>
          <h1 className="sidebar__entity-name">Africa</h1>
          <nav className="sidebar__viz-type">
            <ul>
              <li onClick={this.handleClick}>
                <Link
                  className={this.getCurrentTitle('summary')}
                  data-title={'summary'}
                  to={{ query: { ...location.query, viz_type: 'summary_area' } }}
                >
                  Summary totals &amp; Area of range covered
                </Link>
              </li>
              <li onClick={this.handleClick}>
                <Link
                  className={this.getCurrentTitle('totals')}
                  data-title={'totals'}
                  to={{ query: { ...location.query, viz_type: 'continental_regional' } }}
                >
                  Continental &amp; regional totals
                </Link>
              </li>
            </ul>
          </nav>
          <CountTypeToggle
            location={location}
          />
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
              year={year}
            />
          }

          {this.shouldRenderSidebar('dpps') &&
            <DPPSSidebar
              geographies={geographies}
              currentTitle={this.state.currentTitle}
              currentGeography={currentGeography}
            />
          }
        </section>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  location: PropTypes.object,
  countType: PropTypes.string,
  geographies: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  year: PropTypes.number.isRequired,
  currentGeography: PropTypes.string.isRequired
};

export default Sidebar;
