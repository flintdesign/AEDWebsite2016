import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { formatNumber } from '../../../utils/format_utils.js';
import { slugify } from '../../../utils/convenience_funcs.js';
// import { SIDEBAR_FULL } from '../../../constants';

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
  const { strata, params } = props;
  const basePathForLinks = `/${params.year}/${params.region}/${params.country}`;
  console.log(strata);
  return (
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
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

CountsByInputZones.propTypes = {
  geographies: PropTypes.object,
  strata: PropTypes.array,
  sidebarState: PropTypes.number.isRequired,
  params: PropTypes.object,
};
