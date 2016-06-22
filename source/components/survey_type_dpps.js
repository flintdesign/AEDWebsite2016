import React, { PropTypes } from 'react';
import { formatNumber } from '../utils/format_utils.js';
import ToggleTable from './toggle_table.js';

export default function SurveyTypeDPPS(props) {
  const { tablesTitle, surveys } = props;

  const tables = surveys.map((survey, i) => {
    const titleMarkup = (<span>{survey.surveytype}</span>);
    const countTypes = ['Known', 'Possible', 'Total'];

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
    <div>
      <h3 className="heading__small">{tablesTitle}</h3>
      {tables}
    </div>
  );
}

SurveyTypeDPPS.propTypes = {
  tablesTitle: PropTypes.string.isRequired,
  surveys: PropTypes.array.isRequired
};
