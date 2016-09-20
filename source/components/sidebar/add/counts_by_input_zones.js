import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ParentADD from './parent_add';
import InputZoneToggleTable from '../input_zone_toggle_table';
import { formatNumber } from '../../../utils/format_utils.js';
import { slugify } from '../../../utils/convenience_funcs.js';
import { SIDEBAR_FULL } from '../../../constants';

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

export default function CountsByInputZones(props) {
  const { inputZones, params, sidebarState, totals, currentYear } = props;
  const basePathForLinks = `/${params.year}/${params.region}/${params.country}`;
  const inputZonesList = inputZones.map((zone, i) => {
    const titleMarkup = (
      <div className="subgeography__input-zone">
        <SidebarMapLink
          path={`${basePathForLinks}?input_zone=${slugify(zone.name)}`}
          label={`${zone.name}`}
        />
        <span className="subgeography-summary">
          {zone.survey_type},&nbsp;
          {formatNumber(zone.area)} km<sup>2</sup>
        </span>
        <div className="subgeography__input-zone__totals">
          {formatNumber(zone.population_estimate)}
          {zone.percent_cl &&
            <span>&nbsp;&plusmn;&nbsp;{zone.percent_cl}</span>
          }
        </div>
      </div>
    );

    const childMarkup = zone.strata.map((stratum, si) => (
      <tr key={si}>
        <td className="subgeography-totals__subgeography-name">
          <SidebarMapLink
            path={`${basePathForLinks}/${slugify(stratum.stratum)}-${stratum.strcode}`}
            label={`${stratum.stratum}`}
          />
          {'  '}
          <span>{stratum.est_type},&nbsp;{formatNumber(stratum.area_calc)} km<sup>2</sup></span>
        </td>
        <td className="subgeography-totals__estimate">
          {formatNumber(stratum.estimate)}
          &nbsp;&plusmn;&nbsp;
          {formatNumber(stratum.lcl95)}
        </td>
      </tr>
    ));

    return (
      <InputZoneToggleTable
        key={i}
        titleMarkup={titleMarkup}
        rowMarkup={childMarkup}
      />
    );
  });
  const inputZoneTableList = [];
  inputZones.forEach((zone) => {
    inputZoneTableList.push(
      <tr key={`${zone.id}`}>
        <td className="subgeography-totals__subgeography-name">
          <SidebarMapLink
            path={`${basePathForLinks}?input_zone=${slugify(zone.name)}`}
            label={`${zone.name}`}
          />
        </td>
        <td style={ { textAlign: 'left' } }>{zone.cause_of_change}</td>
        <td style={ { textAlign: 'left' } }>{zone.survey_type}</td>
        <td style={ { textAlign: 'center' } }>{zone.survey_reliability}</td>
        <td style={ { textAlign: 'center' } }>{zone.survey_year}</td>
        <td>{formatNumber(zone.population_estimate)}</td>
        <td>
          {zone.percent_cl &&
            <span>{zone.percent_cl.trim()}</span>
          }
        </td>
        <td style={ { textAlign: 'left' } }>{zone.source}</td>
        <td style={ { textAlign: 'center' } }>{zone.pfs}</td>
        <td style={ { textAlign: 'center' } }>{formatNumber(zone.area)}</td>
        <td style={ { textAlign: 'center' } }>{zone.lon}</td>
        <td style={ { textAlign: 'center' } }>{zone.lat}</td>
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
          <td style={ { textAlign: 'left' } }>{stratum.rc}</td>
          <td style={ { textAlign: 'left' } }>{stratum.est_type}</td>
          <td style={ { textAlign: 'center' } }>{stratum.category}</td>
          <td style={ { textAlign: 'center' } }>{stratum.ayear}</td>
          <td>{formatNumber(stratum.estimate)}</td>
          <td>{stratum.lcl95}</td>
          <td style={ { textAlign: 'left' } }>{stratum.short_cit}</td>
          <td></td>
          <td style={ { textAlign: 'center' } }>{formatNumber(stratum.area_rep)}</td>
          <td style={ { textAlign: 'center' } }>{zone.lon}</td>
          <td style={ { textAlign: 'center' } }>{zone.lat}</td>
        </tr>
      );
    });
  });
  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        <ParentADD
          data={totals}
          year={currentYear}
        />
        <div className="sidebar__count-summary sidebar__count-summary--input-zones">
          <div>
            <h4 className="heading__small">
              Counts by Input Zones
            </h4>
            {inputZonesList}
          </div>
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
                Counts by Input Zones
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
              <th className="th-center">Lat</th>
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

CountsByInputZones.propTypes = {
  geographies: PropTypes.object,
  inputZones: PropTypes.array,
  sidebarState: PropTypes.number.isRequired,
  params: PropTypes.object,
  currentYear: PropTypes.string,
  totals: PropTypes.object.isRequired,
};
