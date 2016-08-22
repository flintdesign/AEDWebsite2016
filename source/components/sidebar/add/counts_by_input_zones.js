import React, { PropTypes } from 'react';
import { formatNumber } from '../../../utils/format_utils.js';
// import { capitalize } from '../../../utils/convenience_funcs.js';
// import { SIDEBAR_FULL } from '../../../constants';

export default function CountsByInputZones(props) {
  const { strata } = props;
  return (
    <div>
      <h4 className="heading__small">
        Counts by Stratum
      </h4>
      <table className="subgeography-totals">
        <tbody>{strata.map((g, i) => (
          <tr key={i}>
            <td className="subgeography-totals__subgeography-name">
              {g.stratum}
              {'  '}
              <span>{formatNumber(g.area_calc)} km<sup>2</sup></span>
            </td>
            <td className="subgeography-totals__estimate">
              {formatNumber(g.estimate)}
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

CountsByInputZones.propTypes = {
  strata: PropTypes.array,
  sidebarState: PropTypes.number.isRequired,
};
