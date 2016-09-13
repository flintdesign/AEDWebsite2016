import React, { PropTypes } from 'react';
import CountsByStrata from './add/counts_by_strata';
import { formatNumber } from '../../utils/format_utils';
import { slugify } from '../../utils/convenience_funcs';
import find from 'lodash.find';

export default function StratumSidebar(props) {
  const { stratum, geographies, params, sidebarState } = props;
  let otherStrata;
  if (geographies && geographies.input_zones) {
    const zoneSlug = slugify(stratum.inpzone.trim());
    const zone = find(geographies.input_zones, z => slugify(z.name.trim()) === zoneSlug);
    otherStrata = zone.strata.filter(s => s.stratum !== stratum.stratum);
  }
  return (
    <div>
      <div>
        <h3 className="heading__small">Total Stratum Elephant Counts</h3>
        <table className="sidebar__stats-table bold-all">
          <tbody>
            <tr>
              <td><strong>Number of Elephants</strong></td>
              <td></td>
            </tr>
            <tr>
              <td className="indented font-normal">Estimate</td>
              <td>
                {formatNumber(stratum.estimate)}
                &nbsp;&plusmn;&nbsp;
                {formatNumber(stratum.lcl95)}
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
      {otherStrata.length > 0 &&
        <div>
          <CountsByStrata
            title={'Other Strata in Same Input Zone'}
            strata={otherStrata}
            sidebarState={sidebarState}
            params={params}
          />
        </div>
      }
    </div>
  );
}

StratumSidebar.propTypes = {
  stratum: PropTypes.object.isRequired,
  geographies: PropTypes.object,
  params: PropTypes.object,
  sidebarState: PropTypes.number.isRequired
};
