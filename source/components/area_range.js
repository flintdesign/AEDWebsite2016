import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';

export default function AreaRange(props) {
  const { rangeSurveyed, totalRange } = props;
  const assessedInKM = formatNumber((rangeSurveyed / 100) * totalRange);
  const assessedPercent = rangeSurveyed;
  const unassessedPercent = 100 - rangeSurveyed;
  const unassessedInKM = formatNumber((unassessedPercent / 100) * totalRange);

  return (
    <div>
      <h4 className="heading__small">Area of Range Covered</h4>
      <table className="sidebar__stats-table bold-all">
        <tbody>
          <tr>
            <td>Assessed</td>
            <td>
              {assessedInKM} km<sup>2</sup>
              {' '}
              <span>({assessedPercent}%)</span>
            </td>
          </tr>
          <tr>
            <td>Unassessed</td>
            <td>
              {unassessedInKM} km<sup>2</sup>
              {' '}
              <span>({unassessedPercent}%)</span>
            </td>
          </tr>
          <tr>
            <td>Total Range</td>
            <td>{formatNumber(totalRange)} km<sup>2</sup></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

AreaRange.propTypes = {
  rangeSurveyed: PropTypes.string.isRequired,
  totalRange: PropTypes.string.isRequired
};
