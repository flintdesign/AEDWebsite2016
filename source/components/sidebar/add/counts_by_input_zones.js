import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ParentADD from './parent_add';
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
  const { strata, params, totals, currentYear, sidebarState } = props;
  const basePathForLinks = `/${params.year}/${params.region}/${params.country}`;
  console.log(strata);
  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        <ParentADD
          data={totals}
          year={currentYear}
        />
        <div>
          <h4 className="heading__small">
            Counts by Stratum
          </h4>
          <table className="subgeography-totals">
            <tbody>{strata.map((g, i) => (
              <tr key={i}>
                <td className="subgeography-totals__subgeography-name">
                  <SidebarMapLink
                    path={`${basePathForLinks}/${slugify(g.stratum)}-${g.strcode}`}
                    label={g.stratum}
                  />
                  {'  '}
                  <span>{formatNumber(g.area_calc)} km<sup>2</sup></span>
                </td>
                <td className="subgeography-totals__estimate">
                  {formatNumber(g.estimate)}
                  &nbsp;&plusmn;&nbsp;
                  {formatNumber(g.lcl95)}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  } else {
    markup = (
      <div>
        <h4 className="heading__small">
          Counts by Stratum
        </h4>
        <table className="subgeography-totals">
          <tbody>{strata.map((g, i) => (
            <tr key={i}>
              <td className="subgeography-totals__subgeography-name">
                <SidebarMapLink
                  path={`${basePathForLinks}/${slugify(g.stratum)}-${g.strcode}`}
                  label={g.stratum}
                />
                {'  '}
                <span>{formatNumber(g.area_calc)} km<sup>2</sup></span>
              </td>
              <td className="subgeography-totals__estimate">
                {formatNumber(g.estimate)}
                &nbsp;&plusmn;&nbsp;
                {formatNumber(g.lcl95)}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  return markup;
}

CountsByInputZones.propTypes = {
  geographies: PropTypes.object,
  strata: PropTypes.array,
  sidebarState: PropTypes.number.isRequired,
  params: PropTypes.object,
  currentYear: PropTypes.string,
  totals: PropTypes.object.isRequired,
};
