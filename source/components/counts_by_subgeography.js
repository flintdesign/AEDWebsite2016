import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';
import { capitalize } from '../utils/convenience_funcs.js';
import { SIDEBAR_FULL } from '../constants';

export default function CountsBySubGeography(props) {
  const { geographies, subGeography, sidebarState } = props;

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
                <th>Country</th>
                <th>Estimate</th>
                <th>+- 95% CL</th>
                <th>FROM</th>
                <th>TO</th>
                <th>Range Area</th>
                <th>% of Regional Range</th>
                <th>% of Range Assessed</th>
                <th>IQI</th>
                <th>PFS</th>
              </tr>
            </thead>
            <tbody>{geographies.map((g, i) => (
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
            ))}</tbody>
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
};
