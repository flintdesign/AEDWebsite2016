import React, { PropTypes } from 'react';
import { formatNumber, formatFloat } from '../../../utils/format_utils.js';
import { SIDEBAR_FULL } from '../../../constants';

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
    sidebarState
  } = props;
  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        <h3 className="heading__small">Summary Totals</h3>
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
                <td>{formatFloat(pfs, 0)}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  } else {
    markup = (
      <div>
        <table className="subgeography-totals table-fullwidth">
          <thead>
            <tr>
              <th className="subgeography-totals__subgeography-name">
                Summary Totals
              </th>
              <th className="th-parent">Definite</th>
              <th className="th-parent">Probable</th>
              <th className="th-parent">Possible</th>
              <th className="th-parent">Speculative</th>
              <th className="th-parent">Range Area (km<sup>2</sup>)</th>
              <th className="th-parent">% of {currentGeography} Range</th>
              <th className="th-parent">% of Range Assessed</th>
              <th className="th-parent">IQI</th>
              <th className="th-parent">PFS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="subgeography-totals__totals">
              <td className="subgeography-totals__totals">Totals</td>
              <td>{formatNumber(definite)}</td>
              <td>{formatNumber(probable)}</td>
              <td>{formatNumber(possible)}</td>
              <td>{formatNumber(speculative)}</td>
              <td>{formatNumber(rangeArea)}</td>
              <td>{formatNumber(rangePercentage)}</td>
              <td>{formatNumber(rangeAssessed)}</td>
              <td>{formatFloat(iqi)}</td>
              <td>{formatFloat(pfs, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  return markup;
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
  sidebarState: PropTypes.number.isRequired
};
