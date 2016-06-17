import React, { PropTypes } from 'react';
import { Link } from 'react-router';
//import AerialCounts from './aerial_counts';
import ContinentalRegional from './continental_regional';
import CountTypeToggle from './count_type_toggle';

export default function Sidebar(props) {
  const { showSidebar, location, regionData, vizTypeChange } = props;
  let continentalRegional;

  console.log('in sidebar');
  console.log(regionData.regionData);
  if (regionData) {
    continentalRegional = (
      <ContinentalRegional
        data={regionData.regionData}
      />
    );
  }

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
            <li onClick={vizTypeChange}>
              <Link to={{ query: { viz_type: 'summary_area' } }}>
                Summary totals & Area of range covered
              </Link>
            </li>
            <li onClick={vizTypeChange}>
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

        {continentalRegional}

      </section>
    </aside>
  );
}

Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  location: PropTypes.object,
  regionData: PropTypes.object,
  vizTypeChange: PropTypes.func.isRequired
};
