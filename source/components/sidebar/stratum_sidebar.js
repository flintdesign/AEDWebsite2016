import React, { PropTypes } from 'react';
import { formatNumber } from '../../utils/format_utils';

export default function StratumSidebar(props) {
  const { stratum } = props;
  return (
    <div>
      <h3 className="heading__small">Total Stratum Elephant Counts</h3>
      <table className="sidebar__stats-table bold-all">
        <tbody>
          <tr>
            <td>Number of Elephants</td>
            <td></td>
          </tr>
          <tr>
            <td className="indented font-normal">Estimate</td>
            <td>
              {formatNumber(stratum.estimate)}
              <span>&nbsp;&plusmn;&nbsp;
              {formatNumber(stratum.lcl95)}</span>
            </td>
          </tr>
          <tr>
            <td className="indented font-normal">Year Conducted</td>
            <td>{stratum.year}</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>{stratum.short_cit}</td>
          </tr>
          <tr>
            <td>Area (km<sup>2</sup>)</td>
            <td>{formatNumber(stratum.area_calc)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

StratumSidebar.propTypes = {
  stratum: PropTypes.object.isRequired
};
