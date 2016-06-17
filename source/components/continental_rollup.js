import React, { PropTypes } from 'react';
import { formatNumber, formatFloat } from '../utils/format_utils.js';

export default function ContinentalRollup(props) {
  const { data } = props;
  return (
    <table className="sidebar__stats-table bold-all">
      <tbody>
        <tr>
          <td>Estimates from Surveys</td>
          <td></td>
        </tr>
        <tr>
          <td className="indented font-normal">Estimate</td>
          <td>{formatNumber(data.ESTIMATE)}</td>
        </tr>
        <tr>
          <td className="indented font-normal">&plusmn;95% CL</td>
          <td>???</td>
        </tr>
        <tr>
          <td>Guesses (From-To)</td>
          <td>{formatNumber(data.GUESS_MIN)} – {formatNumber(data.GUESS_MAX)}</td>
        </tr>
        <tr>
          <td>Range Area (km<sup>2</sup>)</td>
          <td>{formatNumber(data.ASSESSED_RANGE)}</td>
        </tr>
        <tr>
          <td>% of Continental Range</td>
          <td>{formatNumber(data.PERCENT_OF_RANGE_COVERED)}</td>
        </tr>
        <tr>
          <td>% of Range Assessed</td>
          <td>{formatNumber(data.PERCENT_OF_RANGE_ASSESSED)}</td>
        </tr>
        <tr>
          <td>IQI</td>
          <td>{formatFloat(data.IQI)}</td>
        </tr>
        <tr>
          <td>PFS</td>
          <td>{formatFloat(data.PFS)}</td>
        </tr>
      </tbody>
    </table>
  );
}

ContinentalRollup.propTypes = {
  data: PropTypes.object.isRequired
};
