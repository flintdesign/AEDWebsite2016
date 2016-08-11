import React, { PropTypes } from 'react';
import { formatNumber, formatFloat } from '../../../utils/format_utils.js';

export default function ParentDPPS(props) {
  const {
    currentGeography,
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
    <div>
      <h3 className="heading__small">{currentGeography} Elephant Numbers</h3>
      <table className="sidebar__stats-table bold-all">
        <tbody>
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
          {rangeArea &&
            <tr>
              <td>Range Area (km<sup>2</sup>)</td>
              <td>{formatNumber(rangeArea)}</td>
            </tr>
          }
          {rangePercentage &&
            <tr>
              <td>% of {currentGeography} Range</td>
              <td>{formatNumber(rangePercentage)}</td>
            </tr>
          }
          {rangeAssessed &&
            <tr>
              <td>% of Range Assessed</td>
              <td>{formatNumber(rangeAssessed)}</td>
            </tr>
          }
          {iqi &&
            <tr>
              <td>IQI</td>
              <td>{formatFloat(iqi)}</td>
            </tr>
          }
          {pfs &&
            <tr>
              <td>PFS</td>
              <td>{formatFloat(pfs)}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

ParentDPPS.propTypes = {
  currentGeography: PropTypes.string.isRequired,
  definite: PropTypes.string.isRequired,
  probable: PropTypes.string.isRequired,
  possible: PropTypes.string.isRequired,
  speculative: PropTypes.string.isRequired,
  rangeArea: PropTypes.string,
  rangePercentage: PropTypes.string,
  rangeAssessed: PropTypes.string,
  iqi: PropTypes.string,
  pfs: PropTypes.string,
};
