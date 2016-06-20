import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';

export default function ContinentalRollup(props) {
  const { data } = props;
  const unassessedRange = ((100 - data.PERCENT_OF_RANGE_ASSESSED) / 100) * data.ASSESSED_RANGE;
  const unassessedPercent = 100 - data.PERCENT_OF_RANGE_ASSESSED;
  return (
    <table className="sidebar__stats-table bold-all">
      <tbody>
        <tr>
          <td>Estimates from Survey</td>
          <td></td>
        </tr>
        <tr className="heading__small">2013 Elephant Numbers</tr>
        <tr>
          <td className="indented font-normal">Estimates from Surveys</td>
          <td>{formatNumber(data.ESTIMATE)}</td>
        </tr>
        <tr>
          <td>Guesses</td>
          <td>{formatNumber(data.GUESS_MIN)} – {formatNumber(data.GUESS_MAX)}</td>
        </tr>
        <tr className="heading__small">Area of Range Covered</tr>
        <tr>
          <td>Assessed</td>
          <td>
            {formatNumber(data.ASSESSED_RANGE)}km<sup>2</sup>
            {' '}
            <span>
              ({formatNumber(data.PERCENT_OF_RANGE_ASSESSED)}%)
            </span>
          </td>
        </tr>
        <tr>
          <td>Unassessed</td>
          <td>
            {formatNumber(unassessedRange)}km<sup>2</sup>
            {' '}
            <span>
              ({formatNumber(unassessedPercent)}%)
            </span>
          </td>
        </tr>
        <tr>
          <td>Total Range</td>
          <td>{formatNumber(data.RANGE_AREA)}km<sup>2</sup></td>
        </tr>
      </tbody>
    </table>
  );
}

ContinentalRollup.propTypes = {
  data: PropTypes.object.isRequired
};
