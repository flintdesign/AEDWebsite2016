import React, { PropTypes } from 'react';
import { formatNumber } from '../../../utils/format_utils.js';
import ToggleTable from './toggle_table.js';

export default function CauseOfChangeDPPS(props) {
  const { tablesTitle, surveys } = props;

  const tables = surveys.map((survey, i) => {
    const titleMarkup = (<span>{survey.CauseofChange}</span>);
    const countTypes = ['Definite', 'Probable', 'Possible', 'Specul'];

    const childMarkup = countTypes.map((type, j) => (<tr key={j}>
      <td>{type}</td>
      <td>{formatNumber(survey[type.toLowerCase()])}</td>
    </tr>));

    return (
      <ToggleTable
        key={i}
        titleMarkup={titleMarkup}
        rowMarkup={childMarkup}
      />
    );
  });

  return (
    <div className="sidebar__count-summary">
      <h3 className="heading__small">
        {tablesTitle}
        <a
          href={'/glossary#reason-for-change'}
          className="sidebar__glossary-link"
          target="_blank"
        />
      </h3>
      {tables}
    </div>
  );
}

CauseOfChangeDPPS.propTypes = {
  tablesTitle: PropTypes.string.isRequired,
  surveys: PropTypes.array.isRequired
};
