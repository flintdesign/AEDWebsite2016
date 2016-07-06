import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';
import { capitalize } from '../utils/convenience_funcs.js';
import { SIDEBAR_FULL } from '../constants';

export default function CountsBySubGeography(props) {
  const { geographies, subGeography, sidebarState, totals } = props;

  let markup = null;
  if (geographies) {
    if (sidebarState < SIDEBAR_FULL) {
      // Half-width sidebar
      markup = (
        <div>
          <h4 className="heading__small">
            Counts by {capitalize(subGeography)}
          </h4>
          <table className="subgeography-totals">
            <tbody>{geographies.map((g, i) => (
              <tr key={i}>
                <td className="subgeography-totals__subgeography-name">
                  {g[subGeography]}
                  {'  '}
                  <span>{formatNumber(g.RANGE_AREA)} km<sup>2</sup></span>
                </td>
                <td className="subgeography-totals__estimate">
                  {formatNumber(g.ESTIMATE)}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      );
    } else {
      // Full-screen sidebar
      markup = (
        <div>
          <table className="subgeography-totals">
            <thead>
              <tr>
                <th></th>
                <th colSpan="2" style={{ textAlign: 'center' }}>Estimates from surveys</th>
                <th colSpan="2" style={{ textAlign: 'center' }}>Guesses</th>
                <th rowSpan="2">Range Area</th>
                <th rowSpan="2">% of<br />Regional<br />Range</th>
                <th rowSpan="2" className="subgeography-totals__subgeography-name">
                  % of<br />Range<br />Assessed
                </th>
                <th rowSpan="2">IQI</th>
                <th rowSpan="2">PFS</th>
              </tr>
              <tr>
                <th className="subgeography-totals__subgeography-name">Country</th>
                <th>Estimate</th>
                <th>+- 95% CL</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {geographies.map((g, i) => (
                <tr key={i}>
                  <td className="subgeography-totals__subgeography-name">
                    {g[subGeography]}
                  </td>
                  <td>{formatNumber(g.ESTIMATE)}</td>
                  <td>{formatNumber(g.CONFIDENCE)}</td>
                  <td>{formatNumber(g.GUESS_MIN)}</td>
                  <td>{formatNumber(g.GUESS_MAX)}</td>
                  <td>{formatNumber(g.RANGE_AREA)}</td>
                  <td>{formatNumber(g.PERCENT_OF_RANGE_COVERED)}</td>
                  <td>{formatNumber(g.PERCENT_OF_RANGE_ASSESSED)}</td>
                  <td>{formatNumber(g.IQI)}</td>
                  <td>{formatNumber(g.PFS)}</td>
                </tr>
              ))}
              <tr className="subgeography-totals__totals" key="totals">
                <td className="subgeography-totals__subgeography-name">Totals</td>
                <td>{formatNumber(totals.ESTIMATE)}</td>
                <td>{formatNumber(totals.CONFIDENCE)}</td>
                <td>{formatNumber(totals.GUESS_MIN)}</td>
                <td>{formatNumber(totals.GUESS_MAX)}</td>
                <td>{formatNumber(totals.RANGE_AREA)}</td>
                <td>{formatNumber(totals.PERCENT_OF_RANGE_COVERED)}</td>
                <td>{formatNumber(totals.PERCENT_OF_RANGE_ASSESSED)}</td>
                <td>{formatNumber(totals.IQI)}</td>
                <td>{formatNumber(totals.PFS)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  return markup;
}

CountsBySubGeography.propTypes = {
  geographies: PropTypes.array,
  subGeography: PropTypes.string.isRequired,
  sidebarState: PropTypes.number.isRequired,
  totals: PropTypes.object.isRequired,
};
