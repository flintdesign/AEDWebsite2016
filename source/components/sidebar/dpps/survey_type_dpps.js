import React, { PropTypes } from 'react';
import { formatNumber } from '../../../utils/format_utils.js';
import ToggleTable from './toggle_table.js';
import { SIDEBAR_FULL } from '../../../constants';

export default function SurveyTypeDPPS(props) {
  const {
    tablesTitle,
    surveys,
    sidebarState,
    summaryTotals,
    surveySums,
    summarySums
  } = props;
  const toggleTables = surveys.map((survey, i) => {
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
  let markup = null;
  if (sidebarState < SIDEBAR_FULL) {
    markup = (
      <div className="sidebar__count-summary sidebar__count-summary--causes-of-change">
        <h3 className="heading__small">
          {tablesTitle}
          <a
            href={'/glossary#survey-categories'}
            className="sidebar__glossary-link"
            target="_blank"
          />
        </h3>
        {toggleTables}
      </div>
    );
  } else {
    markup = (
      <div>
        {summaryTotals.length > 0 &&
          <div>
            <table className="subgeography-totals table-fullwidth">
              <thead>
                <tr>
                  <th className="subgeography-totals__subgeography-name">
                    Summary Totals by Data Category
                  </th>
                  <th>Definite</th>
                  <th>Probable</th>
                  <th>Possible</th>
                  <th>Speculative</th>
                </tr>
              </thead>
              <tbody>
                {summaryTotals.map((category, i) => (
                  <tr key={`summary-${i}`}>
                    <td className="subgeography-totals__subgeography-name">
                      {category.SURVEYTYPE}
                    </td>
                    <td>{formatNumber(category.DEFINITE)}</td>
                    <td>{formatNumber(category.PROBABLE)}</td>
                    <td>{formatNumber(category.POSSIBLE)}</td>
                    <td>{formatNumber(category.SPECUL)}</td>
                  </tr>
                ))}
                <tr className="subgeography-totals__totals">
                  <td>Totals</td>
                  <td>{formatNumber(summarySums.DEFINITE)}</td>
                  <td>{formatNumber(summarySums.PROBABLE)}</td>
                  <td>{formatNumber(summarySums.POSSIBLE)}</td>
                  <td>{formatNumber(summarySums.SPECUL)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        <div>
          {surveys.length > 0 &&
            <table className="subgeography-totals table-fullwidth">
              <thead>
                <tr>
                  <th className="subgeography-totals__subgeography-name">
                    {tablesTitle} in km<sup>2</sup>
                  </th>
                  <th>Known Range</th>
                  <th>Possible Range</th>
                  <th>Total Range</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey, i) => (
                  <tr key={`area-summary-${i}`}>
                    <td className="subgeography-totals__subgeography-name">
                      {survey.surveytype}
                    </td>
                    <td>{formatNumber(survey.known)}</td>
                    <td>{formatNumber(survey.possible)}</td>
                    <td>{formatNumber(survey.total)}</td>
                  </tr>
                ))}
                {surveySums.length > 0 &&
                  <tr className="subgeography-totals__totals">
                    <td>Totals</td>
                    <td>{formatNumber(surveySums[0].known)}</td>
                    <td>{formatNumber(surveySums[0].possible)}</td>
                    <td>{formatNumber(surveySums[0].total)}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    );
  }
  return markup;
}

SurveyTypeDPPS.propTypes = {
  tablesTitle: PropTypes.string.isRequired,
  surveys: PropTypes.array.isRequired,
  sidebarState: PropTypes.number.isRequired,
  summaryTotals: PropTypes.array,
  surveySums: PropTypes.array,
  summarySums: PropTypes.object
};
