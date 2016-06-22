import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';
import { capitalize } from '../utils/convenience_funcs.js';

export default function CountsBySubGeography(props) {
  const { geographies, subGeography } = props;
  const markup = geographies && geographies.map((g, i) => (
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
  ));

  return (
    <div>
      <h4 className="heading__small">
        Counts by {capitalize(subGeography)}
      </h4>
      <table className="subgeography-totals">
        <tbody>
          {markup}
        </tbody>
      </table>
    </div>
  );
}

CountsBySubGeography.propTypes = {
  geographies: PropTypes.array,
  subGeography: PropTypes.string.isRequired
};
