import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
//import AerialCounts from './aerial_counts';
import ContinentalRegional from './continental_regional';
import CountTypeToggle from './count_type_toggle';
import { FETCH_REGION_DATA, RECEIVE_REGION_DATA } from '../actions/app_actions';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const dispatch = this.props.dispatch;
    dispatch({ type: FETCH_REGION_DATA });
    fetch('http://staging.elephantdatabase.org/api/continent/2/2013/add')
      .then(r => r.json())
      .then(d => dispatch({
        type: RECEIVE_REGION_DATA,
        data: d
      }));
  }

  render() {
    const { showSidebar, location, regions, loading } = this.props;

    const loadingAnim = loading && (<h1>Loading</h1>);

    const continentalRegional = regions && (
      <ContinentalRegional
        data={regions}
      />
    );

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
                <Link to={{ query: { viz_type: 'summary_area' } }}>
                  Summary totals & Area of range covered
                </Link>
              </li>
              <li onClick={this.handleClick}>
                <Link to={{ query: { viz_type: 'continental_regional' } }}>
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
          <table className="sidebar__stats-table">
            <thead>
              <tr>
                <td>Total 2013 elephant counts</td>
                <td>Compare</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Definite</td>
                <td>401,732</td>
              </tr>
              <tr>
                <td>Probable</td>
                <td>71,736</td>
              </tr>
              <tr>
                <td>Possible</td>
                <td>96,685</td>
              </tr>
              <tr>
                <td>Speculative</td>
                <td>62,429</td>
              </tr>
            </tbody>
          </table>

          <h4 className="heading__small">Counts by Data Category</h4>

          {loadingAnim}
          {continentalRegional}

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
  loading: PropTypes.bool.isRequired
};

export default Sidebar;
