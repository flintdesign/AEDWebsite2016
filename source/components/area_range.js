import React, { PropTypes } from 'react';

export default function AreaRange(props) {
  const {
    totalRange,
    assessedInKM,
    assessedPercent,
    unassessedInKM,
    unassessedPercent
  } = props;

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
            <td>{totalRange} km<sup>2</sup></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

AreaRange.propTypes = {
  rangeSurveyed: PropTypes.string.isRequired,
  totalRange: PropTypes.string.isRequired,
  assessedInKM: PropTypes.string.isRequired,
  assessedPercent: PropTypes.string.isRequired,
  unassessedInKM: PropTypes.string.isRequired,
  unassessedPercent: PropTypes.string.isRequired
};
