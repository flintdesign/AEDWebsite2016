import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import ADDSidebar from './add_sidebar';
import DPPSSidebar from './dpps_sidebar';
import CountTypeToggle from './count_type_toggle';
import { fetchGeography } from '../api';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCurrentTitle = this.getCurrentTitle.bind(this);
    this.fetchAPIData = this.fetchAPIData.bind(this);
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

  render() {
    const { showSidebar, location, regions, loading } = this.props;

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
                  Summary totals & Area of range covered
                </Link>
              </li>
              <li onClick={this.handleClick}>
                <Link
                  className={this.getCurrentTitle('regional')}
                  data-title={'regional'}
                  to={{ query: { ...location.query, viz_type: 'continental_regional' } }}
                >
                  Continental & regional totals
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

          {!loading &&
            (typeof this.props.countType === 'undefined' || this.props.countType === 'ADD') &&
            <ADDSidebar
              regions={regions}
              currentTitle={this.state.currentTitle}
            />
          }

          {!loading && this.props.countType === 'DPPS' &&
            <DPPSSidebar
              regions={regions}
              currentTitle={this.state.currentTitle}
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
  regions: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  year: PropTypes.number.isRequired
};

export default Sidebar;
