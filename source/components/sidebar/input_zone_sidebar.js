import React, { PropTypes } from 'react';
import CountsByStrata from './add/counts_by_strata';
import { formatNumber } from '../../utils/format_utils';
import { SIDEBAR_FULL } from '../../constants';
import { Link } from 'react-router';
import { slugify } from '../../utils/convenience_funcs.js';

const SidebarMapLink = ({ label, path }) => (
  <Link
    to={path}
    className="sidebar__map-link"
  >
    {label}
  </Link>
);
SidebarMapLink.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};


export default function InputZoneSidebar(props) {
  const { zone, params, sidebarState } = props;
  const basePathForLinks = `/${params.year}/${params.region}/${params.country}`;
  const inputZoneTableList = [];
  inputZoneTableList.push(
    <tr key={`${zone.id}`}>
      <td className="subgeography-totals__subgeography-name">
        <SidebarMapLink
          path={`${basePathForLinks}?input_zone=${slugify(zone.name)}`}
          label={`${zone.name}`}
        />
      </td>
      <td>{zone.cause_of_change}</td>
      <td>{zone.survey_type}</td>
      <td>{zone.survey_reliability}</td>
      <td>{zone.survey_year}</td>
      <td>{zone.population_estimate}</td>
      <td>
        {zone.percent_cl &&
          <span>{zone.percent_cl.trim()}</span>
        }
      </td>
      <td>{zone.source}</td>
      <td>{zone.pfs}</td>
      <td>{formatNumber(zone.area)}</td>
      <td>{zone.lon}</td>
      <td>{zone.lat}</td>
    </tr>
  );
  zone.strata.forEach((stratum) => {
    inputZoneTableList.push(
      <tr key={`${zone.id}-${stratum.strcode}`}>
        <td className="subgeography-totals__subgeography-name" style={ { paddingLeft: '50px' } }>
          <SidebarMapLink
            path={`${basePathForLinks}/${slugify(stratum.stratum)}-${stratum.strcode}`}
            label={`${stratum.stratum}`}
          />
        </td>
        <td>{stratum.rc}</td>
        <td>{stratum.est_type}</td>
        <td>{stratum.category}</td>
        <td>{stratum.ayear}</td>
        <td>{formatNumber(stratum.estimate)}</td>
        <td>{stratum.lcl95}</td>
        <td>{stratum.short_cit}</td>
        <td></td>
        <td>{formatNumber(stratum.area_rep)}</td>
        <td>{zone.lon}</td>
        <td>{zone.lat}</td>
      </tr>
    );
  });

  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        <div>
          <h3 className="heading__small">Total Input Zone Elephant Counts</h3>
          <table className="sidebar__stats-table bold-all">
            <tbody>
              <tr>
                <td>Estimate from Surveys</td>
                <td>
                  {formatNumber(zone.population_estimate)}
                  {zone.percent_cl &&
                    <span>
                      &nbsp;&plusmn;&nbsp;
                      {formatNumber(zone.percent_cl)}
                    </span>
                  }
                </td>
              </tr>
              <tr>
                <td>Area (km<sup>2</sup>)</td>
                <td>{formatNumber(zone.area)}</td>
              </tr>
              <tr>
                <td>Year Conducted</td>
                <td>{zone.analysis_year}</td>
              </tr>
              <tr>
                <td>PFS</td>
                <td>{zone.pfs}</td>
              </tr>
              <tr>
                <td>Source</td>
                <td>{zone.source}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <CountsByStrata
            strata={zone.strata}
            sidebarState={sidebarState}
            params={params}
          />
        </div>
      </div>
    );
  } else {
    markup = (
      <div>
        <table className="subgeography-totals table-fullwidth">
          <thead>
            <tr>
              <th className="subgeography-totals__subgeography-name">
                Input Zone Counts
              </th>
              <th>Change</th>
              <th>Type</th>
              <th>Reliab.</th>
              <th>Year</th>
              <th>Estimate</th>
              <th>&plusmn;95&#37; CL</th>
              <th>Source</th>
              <th>PFS</th>
              <th>(km<sup>2</sup>)</th>
              <th>Lon.</th>
              <th>Lat</th>
            </tr>
          </thead>
          <tbody>
            {inputZoneTableList}
          </tbody>
        </table>
      </div>
    );
  }
  return markup;
}

InputZoneSidebar.propTypes = {
  zone: PropTypes.object.isRequired,
  sidebarState: PropTypes.number.isRequired,
  params: PropTypes.object
};
