import React, { PropTypes } from 'react';
import { formatNumber, formatFloat } from '../utils/format_utils.js';

export default function TotalCounts(props) {
  const {
    currentGeography,
    year,
    total,
    confidence,
    guess_min,
    guess_max,
    range_covered,
    range_assessed,
    range_area,
    iqi,
    pfs
  } = props;
  return (
    <div>
      <h3 className="heading__small">Total {year} Elephant Counts</h3>
      <table className="sidebar__stats-table bold-all">
        <tbody>
          <tr>
            <td>Estimates from Surveys</td>
            <td></td>
          </tr>
          <tr>
            <td className="indented font-normal">Estimate</td>
            <td>{formatNumber(total)}</td>
          </tr>
          <tr>
            <td className="indented font-normal">&plusmn;95% CL</td>
            <td>{formatNumber(confidence)}</td>
          </tr>
          <tr>
            <td>Guesses</td>
            <td>{formatNumber(guess_min)} – {formatNumber(guess_max)}</td>
          </tr>
          <tr>
            <td>Range Area (km<sup>2</sup>)</td>
            <td>{formatNumber(range_area)}</td>
          </tr>
          <tr>
            <td>% of {currentGeography} Range</td>
            <td>{formatFloat(range_covered)}%</td>
          </tr>
          <tr>
            <td>% of Range Assessed</td>
            <td>{formatFloat(range_assessed)}%</td>
          </tr>
          <tr>
            <td>IQI</td>
            <td>{formatFloat(iqi)}</td>
          </tr>
          <tr>
            <td>PFS</td>
            <td>{formatNumber(pfs)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

TotalCounts.propTypes = {
  currentGeography: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  total: PropTypes.string.isRequired,
  confidence: PropTypes.string.isRequired,
  guess_min: PropTypes.string.isRequired,
  guess_max: PropTypes.string.isRequired,
  range_covered: PropTypes.string.isRequired,
  range_assessed: PropTypes.string.isRequired,
  range_area: PropTypes.string.isRequired,
  iqi: PropTypes.string.isRequired,
  pfs: PropTypes.string.isRequired
};
