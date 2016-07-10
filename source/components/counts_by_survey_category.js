import React, { PropTypes } from 'react';
import find from 'lodash.find';
import ParentADD from './parent_add';
import SurveyCategory from './survey_category';
import { SIDEBAR_FULL } from '../constants';
import { formatNumber } from '../utils/format_utils.js';

export default function CountsBySurveyCategory(props) {
  const { summary_totals, areas, sidebarState, totals, year } = props;
  const surveyCategories = [];

  summary_totals.forEach(countType => {
    const area = find(areas, a => a.category === countType.CATEGORY);
    const glommed = { ...countType, ...area };
    surveyCategories.push(glommed);
  });

  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    // Half-width sidebar
    markup = (
      <div>
        <ParentADD
          data={totals}
          year={year}
        />
        <div>
          <h3 className="heading__small">Counts by Survey Category</h3>
          {surveyCategories.map(categoryData => (
            <SurveyCategory
              key={categoryData.SURVEYTYPE}
              surveyType={categoryData.SURVEYTYPE}
              estimate={categoryData.ESTIMATE}
              guess_min={categoryData.GUESS_MIN}
              guess_max={categoryData.GUESS_MAX}
              range_assessed={categoryData.CATEGORY_RANGE_ASSESSED}
              range_area={categoryData.AREA}
            />)
          )}
        </div>
      </div>
    );
  } else {
    markup = (
      <div>
        <table className="subgeography-totals">
          <thead>
            <tr>
              <th></th>
              <th rowSpan="2" style={{ textAlign: 'center' }}>Estimate from surveys</th>
              <th colSpan="2" style={{ textAlign: 'center' }}>Guesses</th>
              <th rowSpan="2">Range Area</th>
              <th rowSpan="2">% of<br />Regional<br />Range</th>
            </tr>
            <tr>
              <th className="subgeography-totals__subgeography-name">Category</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {surveyCategories.map((categoryData, i) => (
              <tr key={i}>
                <td className="subgeography-totals__subgeography-name">
                  {categoryData.SURVEYTYPE}
                </td>
                <td>{formatNumber(categoryData.ESTIMATE)}</td>
                <td>{formatNumber(categoryData.GUESS_MIN)}</td>
                <td>{formatNumber(categoryData.GUESS_MAX)}</td>
                <td>{formatNumber(categoryData.AREA)}</td>
                <td>{formatNumber(categoryData.CATEGORY_RANGE_ASSESSED)}</td>
              </tr>
            ))}
            <tr className="subgeography-totals__totals" key="totals">
              <td className="subgeography-totals__subgeography-name">Totals</td>
                <td>{formatNumber(totals.ESTIMATE)}</td>
                <td>{formatNumber(totals.GUESS_MIN)}</td>
                <td>{formatNumber(totals.GUESS_MAX)}</td>
                <td>{formatNumber(totals.RANGE_AREA)}</td>
                <td>{formatNumber(totals.PERCENT_OF_RANGE_ASSESSED)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return markup;
}

CountsBySurveyCategory.propTypes = {
  summary_totals: PropTypes.array.isRequired,
  areas: PropTypes.array.isRequired,
  sidebarState: PropTypes.number.isRequired,
  totals: PropTypes.object.isRequired,
  year: PropTypes.number.isRequired,
};
