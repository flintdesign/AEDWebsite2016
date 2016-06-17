import React, { PropTypes } from 'react';

export default function ContinentalRegional(props) {
  const { data } = props;
  const regions = data.regions && data.regions.map((r, i) => (
    <tr key={i}>
      <td className="regional-totals__region-name">
        {r.region}
        {'  '}
        <span>{parseInt(r.RANGE_AREA, 10).toLocaleString()} km<sup>2</sup></span>
      </td>
      <td className="regional-totals__estimate">
        {parseInt(r.ESTIMATE, 10).toLocaleString()}
      </td>
    </tr>
  ));

  return (
    <div>
      <h4 className="heading__small">Counts by Region</h4>
      <table className="regional-totals">
        <tbody>
          {regions}
        </tbody>
      </table>
    </div>
  );
}

ContinentalRegional.propTypes = {
  data: PropTypes.object
};
