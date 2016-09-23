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
          path={`${basePathForLinks}/${slugify(zone.name)}`}
          label={`${zone.name}`}
        />
      </td>
      <td className="td-left">{zone.cause_of_change}</td>
        <td className="td-left">{zone.survey_type}</td>
        <td className="td-center">{zone.survey_reliability}</td>
        <td className="td-center">{zone.survey_year}</td>
        <td>{formatNumber(zone.population_estimate)}</td>
        <td>
          {zone.percent_cl &&
            <span>{zone.percent_cl.trim()}</span>
          }
        </td>
        <td className="td-left">{zone.source}</td>
        <td className="td-center">{zone.pfs}</td>
        <td className="td-center">{formatNumber(zone.area)}</td>
        <td className="td-center">{zone.lon}</td>
        <td className="td-center">{zone.lat}</td>
    </tr>
  );
  zone.strata.forEach((stratum) => {
    inputZoneTableList.push(
      <tr key={`${zone.id}-${stratum.strcode}`}>
        <td className="subgeography-totals__subgeography-name" style={ { paddingLeft: '50px' } }>
          {stratum.stratum}
        </td>
        <td className="td-left">{stratum.rc}</td>
        <td className="td-left">{stratum.est_type}</td>
        <td className="td-center">{stratum.category}</td>
        <td className="td-center">{stratum.ayear}</td>
        <td>{formatNumber(stratum.estimate)}</td>
        <td>{stratum.lcl95}</td>
        <td className="td-left">{stratum.short_cit}</td>
        <td></td>
        <td className="td-center">{formatNumber(stratum.area_rep)}</td>
        <td className="td-center">{zone.lon}</td>
        <td className="td-center">{zone.lat}</td>
      </tr>
    );
  });

  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        <div>
          <h3 className="heading__small">Elephant Estimates</h3>
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
                <td>Reason for Change</td>
                <td>{zone.cause_of_change}</td>
              </tr>
              <tr>
                <td>Survey Type</td>
                <td>{zone.survey_type}</td>
              </tr>
              <tr>
                <td>Survey Reliab.</td>
                <td>{zone.survey_reliability}</td>
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
              <tr>
                <td>Lat.</td>
                <td>{zone.lat}</td>
              </tr>
              <tr>
                <td>Lon.</td>
                <td>{zone.lon}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <CountsByStrata
            title={'Stratum Totals'}
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
              <th></th>
              <th className="th-parent th-left">Reason for Change</th>
              <th colSpan="3" className="th-parent th-center">Survey Details</th>
              <th colSpan="2" className="th-parent th-center">Number of Elephants</th>
              <th colSpan="2" className="th-parent"></th>
              <th colSpan="1" className="th-parent th-center">Area</th>
              <th colSpan="2" className="th-parent th-center">Map Location</th>
            </tr>
            <tr>
              <th className="subgeography-totals__subgeography-name">
                Input Zone &amp; Stratum Totals
              </th>
              <th className="th-left"></th>
              <th className="th-left">Type</th>
              <th className="th-center">Reliab.</th>
              <th className="th-center">Year</th>
              <th>Estimate</th>
              <th>&plusmn;95&#37; CL</th>
              <th className="th-left">Source</th>
              <th className="th-center">PFS</th>
              <th className="th-center">(km<sup>2</sup>)</th>
              <th className="th-center">Lon.</th>
              <th className="th-center">Lat.</th>
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
