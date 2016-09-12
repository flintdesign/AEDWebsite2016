import React, { PropTypes } from 'react';
import { formatNumber } from '../../utils/format_utils';

export default function InputZoneSidebar(props) {
  const { zone } = props;
  return (
    <div>
      <h3 className="heading__small">Total Input Zone Elephant Counts</h3>
      <table className="sidebar__stats-table bold-all">
        <tbody>
          <tr>
            <td><strong>Number of Elephants</strong></td>
            <td></td>
          </tr>
          <tr>
            <td className="indented font-normal">Estimate</td>
            <td>
              {formatNumber(zone.population_estimate)}
              &nbsp;&plusmn;&nbsp;
              {formatNumber(zone.percent_cl)}
            </td>
          </tr>
          <tr>
            <td className="indented font-normal">Year Conducted</td>
            <td>{zone.analysis_year}</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>{zone.source}</td>
          </tr>
          <tr>
            <td>Area (km<sup>2</sup>)</td>
            <td>{formatNumber(zone.area)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

InputZoneSidebar.propTypes = {
  zone: PropTypes.object.isRequired
};
