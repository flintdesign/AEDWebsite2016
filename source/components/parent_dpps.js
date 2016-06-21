import React, { PropTypes } from 'react';
import { formatNumber, formatFloat } from '../utils/format_utils.js';

export default function ParentDPPS(props) {
  const {
    definite,
    probable,
    possible,
    speculative,
    rangeArea,
    rangePercentage,
    rangeAssessed,
    iqi,
    pfs,
  } = props;

  return (
    <table className="sidebar__stats-table bold-all">
      <tbody>
        <tr className="heading__small">Continental Elephant Numbers</tr>
        <tr>
          <td>Definite</td>
          <td>{formatNumber(definite)}</td>
        </tr>
        <tr>
          <td>Probable</td>
          <td>{formatNumber(probable)}</td>
        </tr>
        <tr>
          <td>Possible</td>
          <td>{formatNumber(possible)}</td>
        </tr>
        <tr>
          <td>Speculative</td>
          <td>{formatNumber(speculative)}</td>
        </tr>
        <tr>
          <td>Range Area (km<sup>2</sup>)</td>
          <td>{formatNumber(rangeArea)}</td>
        </tr>
        <tr>
          <td>% of Continental Range</td>
          <td>{formatNumber(rangePercentage)}</td>
        </tr>
        <tr>
          <td>% of Range Assessed</td>
          <td>{formatNumber(rangeAssessed)}</td>
        </tr>
        <tr>
          <td>IQI</td>
          <td>{formatFloat(iqi)}</td>
        </tr>
        <tr>
          <td>PFS</td>
          <td>{formatFloat(pfs)}</td>
        </tr>
      </tbody>
    </table>
  );
}

ParentDPPS.propTypes = {
  definite: PropTypes.string.isRequired,
  probable: PropTypes.string.isRequired,
  possible: PropTypes.string.isRequired,
  speculative: PropTypes.string.isRequired,
  rangeArea: PropTypes.string.isRequired,
  rangePercentage: PropTypes.string.isRequired,
  rangeAssessed: PropTypes.string.isRequired,
  iqi: PropTypes.string.isRequired,
  pfs: PropTypes.string.isRequired,
};
