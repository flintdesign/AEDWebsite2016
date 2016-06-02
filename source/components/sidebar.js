import React, { PropTypes } from 'react';
import AerialCounts from './aerial_counts';

export default function Sidebar(props) {
  const { showSidebar } = props;
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
            <li className="current">Summary totals</li>
            <li>Area of range covered</li>
            <li>Continental & regional totals</li>
          </ul>
        </nav>
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

        <AerialCounts
          title="Aerial or Ground Counts"
        />

        <AerialCounts
          title="Direct Sample and Reliable Dung Counts"
        />

        <AerialCounts
          title="Other Dung Counts"
        />
        <AerialCounts
          title="Informed Guesses"
        />

      </section>
    </aside>
  );
}

Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired
};
