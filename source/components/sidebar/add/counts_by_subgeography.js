import React, { PropTypes } from 'react';
import { formatNumber, formatFloat } from '../../../utils/format_utils.js';
import { Link } from 'react-router';
import { capitalize, slugify } from '../../../utils/convenience_funcs.js';
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

export default function CountsBySubGeography(props) {
  const { geographies, subGeography, sidebarState, totals, parentId, currentYear } = props;
  let basePathForLinks = `/${currentYear}/${parentId}`;
  if (parentId === 'africa') {
    basePathForLinks = `/${currentYear}`;
  }
  let markup = null;
  if (geographies) {
    if (sidebarState < SIDEBAR_FULL) {
      // Half-width sidebar
      markup = (
        <div>
          <div>
            <h4 className="heading__small">
              {capitalize(subGeography === 'region' ? 'regional' : subGeography)}
              &nbsp;Totals and Data Quality
            </h4>
            <table className="subgeography-totals">
              <tbody>{geographies.map((g, i) => (
                <tr key={i}>
                  <td className="subgeography-totals__subgeography-name">
                    <SidebarMapLink
                      path={`${basePathForLinks}/${slugify(g[subGeography])}`}
                      label={g[subGeography]}
                    />
                    {'  '}
                    <span>{formatNumber(g.RANGE_AREA)} km<sup>2</sup></span>
                  </td>
                  <td className="subgeography-totals__estimate">
                    {formatNumber(g.ESTIMATE)}
                    &nbsp;&plusmn;&nbsp;
                    {formatNumber(g.CONFIDENCE)}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      );
    } else {
      // Full-screen sidebar
      markup = (
        <div>
          <table className="subgeography-totals table-fullwidth">
            <thead>
              <tr>
                <th></th>
                <th colSpan="2" className="th-parent">Estimates from surveys</th>
                <th colSpan="2" className="th-parent">Guesses</th>
                <th colSpan="1" className="th-parent th-right">Range Area</th>
                <th colSpan="1" className="th-parent th-right">% Known &amp;<br />
                Possible Range</th>
                <th colSpan="1" className="th-parent th-right">% of Range<br />Assessed</th>
                <th rowSpan="1" className="th-parent th-right">IQI</th>
                <th rowSpan="1" className="th-parent th-right">PFS</th>
              </tr>
              <tr>
                <th className="subgeography-totals__subgeography-name">
                  {capitalize(subGeography === 'region' ? 'regional' : subGeography)}
                  &nbsp;Totals and Data Quality
                </th>
                <th>Estimate</th>
                <th>&plusmn;95&#37; CL</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {geographies.map((g, i) => (
                <tr key={i}>
                  <td className="subgeography-totals__subgeography-name">
                    <SidebarMapLink
                      path={`${basePathForLinks}/${slugify(g[subGeography])}`}
                      label={g[subGeography]}
                    />
                  </td>
                  <td>{formatNumber(g.ESTIMATE)}</td>
                  <td>{formatNumber(g.CONFIDENCE)}</td>
                  <td>{formatNumber(g.GUESS_MIN)}</td>
                  <td>{formatNumber(g.GUESS_MAX)}</td>
                  <td>{formatNumber(g.RANGE_AREA)}</td>
                  <td>{formatNumber(g.PERCENT_OF_RANGE_COVERED)}</td>
                  <td>{formatNumber(g.PERCENT_OF_RANGE_ASSESSED)}</td>
                  <td>{formatFloat(g.IQI)}</td>
                  <td>{formatFloat(g.PFS)}</td>
                </tr>
              ))}
              <tr className="subgeography-totals__totals" key="totals">
                <td className="subgeography-totals__subgeography-name">Totals</td>
                <td>{formatNumber(totals.ESTIMATE)}</td>
                <td>{formatNumber(totals.CONFIDENCE)}</td>
                <td>{formatNumber(totals.GUESS_MIN)}</td>
                <td>{formatNumber(totals.GUESS_MAX)}</td>
                <td>{formatNumber(totals.RANGE_AREA)}</td>
                <td>{formatNumber(totals.PERCENT_OF_RANGE_COVERED)}</td>
                <td>{formatNumber(totals.PERCENT_OF_RANGE_ASSESSED)}</td>
                <td>{formatFloat(totals.IQI)}</td>
                <td>{formatFloat(totals.PFS)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  return markup;
}

CountsBySubGeography.propTypes = {
  geographies: PropTypes.array,
  parentId: PropTypes.string,
  currentYear: PropTypes.string,
  subGeography: PropTypes.string.isRequired,
  sidebarState: PropTypes.number.isRequired,
  totals: PropTypes.object.isRequired,
};
