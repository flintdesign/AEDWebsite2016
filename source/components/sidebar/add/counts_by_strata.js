import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { formatNumber } from '../../../utils/format_utils.js';
// import { slugify } from '../../../utils/convenience_funcs.js';
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

export default function CountsByStrata(props) {
  const {
    strata,
    // params,
    sidebarState,
    title
  } = props;
  // const basePathForLinks = `/${params.year}/${params.region}/${params.country}`;
  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div>
        <h4 className="heading__small">
          {title || 'Counts by Stratum'}
        </h4>
        <table className="subgeography-totals">
          <tbody>{strata.map((g, i) => (
            <tr key={i}>
              <td className="subgeography-totals__subgeography-name">
                {g.stratum}
                {'  '}
                <span>
                  {g.est_type},&nbsp;
                  {formatNumber(g.area_rep)} km<sup>2</sup>
                </span>
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
  } else {
    markup = (
      <div>
        <h4 className="heading__small">
          {title || 'Counts by Stratum'}
        </h4>
        <table className="subgeography-totals">
          <tbody>{strata.map((g, i) => (
            <tr key={i}>
              <td className="subgeography-totals__subgeography-name">
                {g.stratum}
                {'  '}
                <span>{formatNumber(g.area_rep)} km<sup>2</sup></span>
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

CountsByStrata.propTypes = {
  strata: PropTypes.array,
  sidebarState: PropTypes.number.isRequired,
  params: PropTypes.object,
  title: PropTypes.string
};
