import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { formatNumber } from '../../../utils/format_utils.js';
import { slugify } from '../../../utils/convenience_funcs.js';
import ToggleTable from './toggle_table.js';

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

export default function ChildDPPS(props) {
  const { geographies, tablesTitle, params } = props;
  let basePathForLinks = `/${params.year}`;
  if (params.region) {
    basePathForLinks = `/${params.year}/${params.region}`;
  }
  const tables = geographies && geographies.map((g, i) => {
    const countTypes = ['Definite', 'Probable', 'Possible', 'Speculative'];
    const childMarkup = countTypes.map(type => (<tr key={type}>
      <td className="subgeography-totals__subgeography-name">
        {type}
      </td>
      <td className="subgeography-totals__estimate">
        {formatNumber(type === 'Speculative' ? g.SPECUL : g[type.toUpperCase()])}
      </td>
    </tr>));
    const entityTitle = g.CNTRYNAME || g.REGION;
    const titleMarkup = (
      <span>
        <SidebarMapLink
          path={`${basePathForLinks}/${slugify(entityTitle)}?count_type=DPPS`}
          label={`${entityTitle}`}
        />
        &nbsp;
        <small>{formatNumber(g.RANGEAREA)} km<sup>2</sup></small>
      </span>
    );

    return (
      <ToggleTable
        key={i}
        titleMarkup={titleMarkup}
        rowMarkup={childMarkup}
      />
    );
  });

  return (
    <div>
      <h3 className="heading__small">{tablesTitle}</h3>
      {tables}
    </div>
  );
}

ChildDPPS.propTypes = {
  tablesTitle: PropTypes.string.isRequired,
  geographies: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired
};
