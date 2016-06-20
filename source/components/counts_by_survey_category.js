import React, { PropTypes } from 'react';
import find from 'lodash.find';
import SurveyCategory from './survey_category';

export default function CountsBySurveyCategory(props) {
  const { data } = props;
  const surveyCategories = [];

  data.summary_totals.map(countType => {
    let glommed = {};
    const area = find(data.areas, a => a.category === countType.CATEGORY);
    glommed = Object.assign({}, countType, area);
    return surveyCategories.push(glommed);
  });

  const categories = surveyCategories.map(categoryData => (
    <SurveyCategory
      key={categoryData.SURVEYTYPE}
      data={categoryData}
    />)
  );

  return (
    <div>
      {categories}
    </div>
  );
}

CountsBySurveyCategory.propTypes = {
  data: PropTypes.object.isRequired
};
