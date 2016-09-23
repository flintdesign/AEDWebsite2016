import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ParentADD from './parent_add';
import InputZoneToggleTable from '../input_zone_toggle_table';
import { formatNumber } from '../../../utils/format_utils.js';
import { slugify } from '../../../utils/convenience_funcs.js';
import { SIDEBAR_FULL } from '../../../constants';
import { sortBy } from 'lodash';

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
  const { inputZones, params, sidebarState, totals, currentYear, location } = props;
  const basePathForLinks = `/${params.year}/${params.region}/${params.country}`;
  const alphaInputZones = sortBy(inputZones, z => z.name);
  const inputZonesList = alphaInputZones.map((zone, i) => {
    let izHref = `${basePathForLinks}/${slugify(zone.name)}`;
    if (location.query.count_type === 'DPPS') {
      izHref += '?count_type=DPPS';
    }
    const titleMarkup = (
      <div className="subgeography__input-zone">
        <SidebarMapLink
          path={izHref}
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
          {stratum.stratum}
          {'  '}
          <span>{stratum.est_type},&nbsp;{formatNumber(stratum.area_rep)} km<sup>2</sup></span>
        </td>
        <td className="subgeography-totals__estimate">
          {formatNumber(stratum.estimate)}
          &nbsp;&plusmn;&nbsp;
          {formatNumber(stratum.lcl95)}
        </td>
      </tr>
    ));
    // let childMarkup;
    // if (zone.strata.length === 1 && zone.strata[0].stratum === zone.name) {
    //   childMarkup = [];
    // } else {
    //   childMarkup = zone.strata.map((stratum, si) => (
    //     <tr key={si}>
    //       <td className="subgeography-totals__subgeography-name">
    //         <SidebarMapLink
    //           path={`${basePathForLinks}/${slugify(stratum.stratum)}-${stratum.strcode}`}
    //           label={`${stratum.stratum}`}
    //         />
    //         {'  '}
    //         <span>{stratum.est_type},&nbsp;{formatNumber(stratum.area_rep)} km<sup>2</sup></span>
    //       </td>
    //       <td className="subgeography-totals__estimate">
    //         {formatNumber(stratum.estimate)}
    //         &nbsp;&plusmn;&nbsp;
    //         {formatNumber(stratum.lcl95)}
    //       </td>
    //     </tr>
    //   ));
    // }
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
  });
  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        {totals && currentYear &&
          <ParentADD
            data={totals}
            year={currentYear}
            sidebarState={sidebarState}
          />
        }
        <div className="sidebar__count-summary sidebar__count-summary--input-zones">
          <div>
            <h4 className="heading__small">
              Elephant Estimates
            </h4>
            {inputZonesList}
          </div>
        </div>
      </div>
    );
  } else {
    markup = (
      <div>
        {totals && currentYear &&
          <ParentADD
            data={totals}
            year={currentYear}
            sidebarState={sidebarState}
          />
        }
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
                Input Zones
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
  location: PropTypes.object,
  currentYear: PropTypes.string,
  totals: PropTypes.object,
};
