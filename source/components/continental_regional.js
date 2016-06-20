import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';

export default function ContinentalRegional(props) {
  const { regions } = props;
  const regionMarkup = regions && regions.map((r, i) => (
    <tr key={i}>
      <td className="regional-totals__region-name">
        {r.region}
        {'  '}
        <span>{formatNumber(r.RANGE_AREA)} km<sup>2</sup></span>
      </td>
      <td className="regional-totals__estimate">
        {formatNumber(r.ESTIMATE)}
      </td>
    </tr>
  ));

  return (
    <div>
      <h4 className="heading__small">Counts by Region</h4>
      <table className="regional-totals">
        <tbody>
          {regionMarkup}
        </tbody>
      </table>
    </div>
  );
}

ContinentalRegional.propTypes = {
  regions: PropTypes.array
};
