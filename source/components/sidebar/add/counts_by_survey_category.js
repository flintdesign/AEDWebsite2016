import React, { PropTypes } from 'react';
import find from 'lodash.find';
import SurveyCategory from './survey_category';
import { SIDEBAR_FULL } from '../../../constants';
import { formatNumber } from '../../../utils/format_utils.js';

export default function CountsBySurveyCategory(props) {
  const {
    summary_totals,
    areas,
    causes_of_change,
    areas_of_change,
    sidebarState,
    totals,
    changeTotals,
    location
  } = props;
  const surveyCategories = [];
  const causesOfChange = [];

  summary_totals.forEach(countType => {
    const area = find(areas, a => a.category === countType.CATEGORY);
    const glommed = { ...countType, ...area };
    surveyCategories.push(glommed);
  });

  causes_of_change.forEach(countType => {
    const area = find(areas_of_change, a => a.display === countType.CAUSE);
    const glommed = { ...countType, ...area };
    causesOfChange.push(glommed);
  });
  let markup = null;
  const glossaryLink = `/glossary?return_to=${location.pathname}&sidebar_state=${sidebarState}`;
  if (sidebarState < SIDEBAR_FULL) {
    // Half-width sidebar
    markup = (
      <div>
        {changeTotals && (
          <div className="sidebar__count-summary">
            <h3 className="heading__small">
               Interpretation of changes from previous<br />report
              <a
                href={`${glossaryLink}#reason-for-change`}
                className="sidebar__glossary-link"
                target="_blank"
              />
            </h3>
            {causesOfChange.map(changeData => (
              <SurveyCategory
                key={changeData.CAUSE}
                surveyType={changeData.CAUSE}
                estimate={changeData.ESTIMATE}
                confidence={changeData.CONFIDENCE}
                guess_min={changeData.GUESS_MIN}
                guess_max={changeData.GUESS_MAX}
                range_assessed={changeData.CATEGORY_RANGE_ASSESSED}
                range_area={changeData.AREA}
              />)
            )}
          </div>
        )}
        <div className="sidebar__count-summary sidebar__count-summary--causes-of-change">
          <h3 className="heading__small">
            Area of range by data category
            <a
              href={`${glossaryLink}#survey-categories`}
              className="sidebar__glossary-link"
              target="_blank"
            />
          </h3>
          {surveyCategories.map(categoryData => (
            <SurveyCategory
              key={categoryData.SURVEYTYPE}
              surveyType={categoryData.SURVEYTYPE}
              estimate={categoryData.ESTIMATE}
              confidence={categoryData.CONFIDENCE}
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
        {changeTotals && (
          <table className="subgeography-totals causes-of-change table-fullwidth">
            <thead>
              <tr>
                <th></th>
                <th colSpan="2" className="th-parent">Estimates from surveys</th>
                <th colSpan="2" className="th-parent">Guesses</th>
                <th colSpan="1" className="th-parent th-right">% Known &amp;<br />
                Possible Range</th>
                <th colSpan="1" className="th-parent th-right">Area
                <span>(KM<sup>2</sup>)</span></th>
              </tr>
              <tr>
                <th className="subgeography-totals__subgeography-name">
                   Interpretation of Changes from Previous Report
                  <a
                    href={`${glossaryLink}#reason-for-change`}
                    className="sidebar__glossary-link"
                    target="_blank"
                  />
                </th>
                <th rowSpan="2" style={{ textAlign: 'right' }}>Estimate</th>
                <th rowSpan="2" style={{ textAlign: 'right' }}>&plusmn;95&#37; CL</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {causesOfChange.map((categoryData, i) => (
                <tr key={i}>
                  <td className="subgeography-totals__subgeography-name">
                    {categoryData.CAUSE}
                  </td>
                  <td>{formatNumber(categoryData.ESTIMATE)}</td>
                  <td>{formatNumber(categoryData.CONFIDENCE)}</td>
                  <td>{formatNumber(categoryData.GUESS_MIN)}</td>
                  <td>{formatNumber(categoryData.GUESS_MAX)}</td>
                  <td>{formatNumber(categoryData.CATEGORY_RANGE_ASSESSED)}</td>
                  <td>{formatNumber(categoryData.AREA)}</td>
                </tr>
              ))}
              <tr className="subgeography-totals__totals" key="totals">
                <td className="subgeography-totals__subgeography-name">Totals</td>
                <td>{formatNumber(changeTotals.ESTIMATE)}</td>
                <td>{formatNumber(changeTotals.CONFIDENCE)}</td>
                <td>{formatNumber(changeTotals.GUESS_MIN)}</td>
                <td>{formatNumber(changeTotals.GUESS_MAX)}</td>
                <td>{formatNumber(changeTotals.PERCENT_OF_RANGE_ASSESSED)}</td>
                <td>{formatNumber(changeTotals.RANGE_AREA)}</td>
              </tr>
            </tbody>
          </table>
        )}
        <table className="subgeography-totals table-fullwidth">
          <thead>
            <tr>
              <th></th>
              <th colSpan="2" className="th-parent">Estimates from surveys</th>
              <th colSpan="2" className="th-parent">Guesses</th>
              <th colSpan="1" className="th-parent th-right">% Known &amp;<br /> Possible Range</th>
              <th colSpan="1" className="th-parent th-right">Area <span>(KM<sup>2</sup>)</span></th>
            </tr>
            <tr>
              <th className="subgeography-totals__subgeography-name">
                Area of Range by Data Category
                <a
                  href={`${glossaryLink}#survey-categories`}
                  className="sidebar__glossary-link"
                  target="_blank"
                />
              </th>
              <th rowSpan="2" style={{ textAlign: 'right' }}>Estimate</th>
              <th rowSpan="2" style={{ textAlign: 'right' }}>&plusmn;95&#37; CL</th>
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
                <td>{formatNumber(categoryData.CONFIDENCE)}</td>
                <td>{formatNumber(categoryData.GUESS_MIN)}</td>
                <td>{formatNumber(categoryData.GUESS_MAX)}</td>
                <td>{formatNumber(categoryData.CATEGORY_RANGE_ASSESSED)}</td>
                <td>{formatNumber(categoryData.AREA)}</td>
              </tr>
            ))}
            <tr className="subgeography-totals__totals" key="totals">
              <td className="subgeography-totals__subgeography-name">Totals</td>
              <td>{formatNumber(totals.ESTIMATE)}</td>
              <td>{formatNumber(totals.CONFIDENCE) || '-'}</td>
              <td>{formatNumber(totals.GUESS_MIN)}</td>
              <td>{formatNumber(totals.GUESS_MAX)}</td>
              <td>{formatNumber(totals.PERCENT_OF_RANGE_ASSESSED)}</td>
              <td>{formatNumber(totals.RANGE_AREA)}</td>
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
  causes_of_change: PropTypes.array.isRequired,
  areas_of_change: PropTypes.array.isRequired,
  sidebarState: PropTypes.number.isRequired,
  totals: PropTypes.object.isRequired,
  changeTotals: PropTypes.object,
  year: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired
};
