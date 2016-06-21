import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';
import ToggleTable from './toggle_table.js';

export default function ChildDPPS(props) {
  const { geographies, tablesTitle } = props;

  const tables = geographies && geographies.map((g, i) => {
    const countTypes = ['Definite', 'Probable', 'Possible', 'Speculative'];
    const childMarkup = countTypes.map(type => (<tr key={type}>
      <td className="regional-totals__region-name">
        {type}
      </td>
      <td className="regional-totals__estimate">
        {formatNumber(type === 'Speculative' ? g.SPECUL : g[type.toUpperCase()])}
      </td>
    </tr>));

    const titleMarkup = (
      <div>{g.REGION}{' '}<small>{formatNumber(g.RANGEAREA)} km<sup>2</sup></small></div>
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
  geographies: PropTypes.array.isRequired
};
