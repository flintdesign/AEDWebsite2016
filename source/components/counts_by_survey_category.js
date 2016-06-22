import React, { PropTypes } from 'react';
import find from 'lodash.find';
import SurveyCategory from './survey_category';

export default function CountsBySurveyCategory(props) {
  const { summary_totals, areas } = props;
  const surveyCategories = [];

  summary_totals.map(countType => {
    const area = find(areas, a => a.category === countType.CATEGORY);
    const glommed = { ...countType, ...area };
    return surveyCategories.push(glommed);
  });

  const categories = surveyCategories.map(categoryData => (
    <SurveyCategory
      key={categoryData.SURVEYTYPE}
      surveyType={categoryData.SURVEYTYPE}
      estimate={categoryData.ESTIMATE}
      guess_min={categoryData.GUESS_MIN}
      guess_max={categoryData.GUESS_MAX}
      range_assessed={categoryData.CATEGORY_RANGE_ASSESSED}
      range_area={categoryData.AREA}
    />)
  );

  return (
    <div>
      <h3 className="heading__small">Counts by Survey Category</h3>
      {categories}
    </div>
  );
}

CountsBySurveyCategory.propTypes = {
  summary_totals: PropTypes.array.isRequired,
  areas: PropTypes.array.isRequired,
};
