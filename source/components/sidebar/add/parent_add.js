import React, { PropTypes } from 'react';
import AreaRange from '../area_range';
import { formatNumber, formatFloat } from '../../../utils/format_utils.js';

export default function ParentADD(props) {
  const { data, year } = props;
  const unassessedRange = ((100 - data.PERCENT_OF_RANGE_ASSESSED) / 100) * data.ASSESSED_RANGE;
  const unassessedPercent = 100 - data.PERCENT_OF_RANGE_ASSESSED;
  return (
    <div>
      <h3 className="heading__small">{year} Elephant Numbers</h3>
      <table className="sidebar__stats-table bold-all">
        <tbody>
          <tr>
            <td>Estimates from Surveys</td>
            <td>
              {formatNumber(data.ESTIMATE)}
              <span>&plusmn;</span>
            </td>
          </tr>
          <tr>
            <td>&plusmn;&#37; CL</td>
            <td>{formatNumber(data.CONFIDENCE)}</td>
          </tr>
          <tr>
            <td>Guesses</td>
            <td>{formatNumber(data.GUESS_MIN)} – {formatNumber(data.GUESS_MAX)}</td>
          </tr>
        </tbody>
      </table>

      <AreaRange
        totalRange={formatNumber(data.RANGE_AREA)}
        assessedInKM={formatNumber(data.ASSESSED_RANGE)}
        assessedPercent={formatFloat(data.PERCENT_OF_RANGE_ASSESSED)}
        unassessedInKM={formatNumber(unassessedRange)}
        unassessedPercent={formatFloat(unassessedPercent)}
      />
    </div>
  );
}

ParentADD.propTypes = {
  data: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired
};
