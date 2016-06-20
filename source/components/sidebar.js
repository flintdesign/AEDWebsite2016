import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
//import AerialCounts from './aerial_counts';
import ContinentalRollup from './continental_rollup';
import ContinentalRegional from './continental_regional';
import CountsBySurveyCategory from './counts_by_survey_category';
import CountTypeToggle from './count_type_toggle';
import { FETCH_REGION_DATA, RECEIVE_REGION_DATA } from '../actions/app_actions';
import isEmpty from 'lodash.isempty';
import fetch from 'isomorphic-fetch';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCurrentTitle = this.getCurrentTitle.bind(this);
    this.state = {
      currentTitle: 'summary_area'
    };
  }

  getCurrentTitle(title) {
    return this.state.currentTitle === title ? 'active' : null;
  }

  handleClick(e) {
    this.setState({
      currentTitle: e.target.dataset.title
    });
    const dispatch = this.props.dispatch;
    dispatch({ type: FETCH_REGION_DATA });
    fetch(`http://staging.elephantdatabase.org/api/continent/2/${this.props.year}/add`)
      .then(r => r.json())
      .then(d => dispatch({
        type: RECEIVE_REGION_DATA,
        data: d
      }));
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
                  to={{ query: { viz_type: 'summary_area' } }}
                >
                  Summary totals & Area of range covered
                </Link>
              </li>
              <li onClick={this.handleClick}>
                <Link
                  className={this.getCurrentTitle('regional')}
                  data-title={'regional'}
                  to={{ query: { viz_type: 'continental_regional' } }}
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

          {!isEmpty(regions) && this.state.currentTitle === 'summary' &&
            <div>
              <ContinentalRollup
                data={regions.regions_sums[0]}
              />
              <CountsBySurveyCategory
                summary_totals={regions.summary_totals}
                areas={regions.areas}
              />
            </div>
          }

          {!isEmpty(regions) && this.state.currentTitle === 'regional' &&
            <ContinentalRegional
              regions={regions.regions}
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
  regions: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  year: PropTypes.number.isRequired
};

export default Sidebar;
