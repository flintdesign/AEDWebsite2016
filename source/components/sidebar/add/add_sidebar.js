import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import CountsBySubGeography from './counts_by_subgeography';
import CountsBySurveyCategory from './counts_by_survey_category';
import { pluralize, getNextGeography } from '../../../utils/convenience_funcs';

export default function ADDSidebar(props) {
  const { geographies, currentTitle, currentGeography, year, sidebarState } = props;
  const subGeography = getNextGeography(currentGeography);
  const data = type => geographies[`${type}_sums`][0];

  // TODO The API is broken on this at the country level
  let addData;
  let addChangeData;
  if (currentGeography === 'country') {
    addData = {
      PERCENT_OF_RANGE_ASSESSED: geographies.areas[0].percent_range_assessed,
      ASSESSED_RANGE: geographies.assessed_range,
      ESTIMATE: geographies.summary_sums[0].ESTIMATE,
      GUESS_MIN: geographies.summary_sums[0].GUESS_MIN,
      GUESS_MAX: geographies.summary_sums[0].GUESS_MAX,
      RANGE_AREA: geographies.areas[0].range_area
    };
  } else {
    addData = geographies[`${pluralize(subGeography)}_sums`][0];
  }

  addChangeData = {
    PERCENT_OF_RANGE_ASSESSED: geographies.areas_by_reason[0].percent_range_assessed,
    ASSESSED_RANGE: geographies.assessed_range,
    ESTIMATE: geographies.causes_of_change_sums[0].ESTIMATE,
    GUESS_MIN: geographies.causes_of_change_sums[0].GUESS_MIN,
    GUESS_MAX: geographies.causes_of_change_sums[0].GUESS_MAX,
    RANGE_AREA: geographies.areas_by_reason[0].range_area
  };

  return (
    <div>
      {!isEmpty(geographies) && currentTitle === 'summary_area' &&
        <div>
          <CountsBySurveyCategory
            summary_totals={geographies.summary_totals}
            areas={geographies.areas}
            causes_of_change={geographies.causes_of_change}
            areas_of_change={geographies.areas_by_reason}
            sidebarState={sidebarState}
            totals={addData}
            change_totals={addChangeData}
            year={year}
          />
        </div>
      }

      {!isEmpty(geographies) && currentTitle === 'totals' &&
        <div>
          <CountsBySubGeography
            geographies={geographies[pluralize(subGeography)]}
            subGeography={subGeography}
            sidebarState={sidebarState}
            totals={{ ...data('summary'), ...data(pluralize(subGeography)) }}
          />
        </div>
      }
    </div>
  );
}

ADDSidebar.propTypes = {
  geographies: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired,
  currentGeography: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  sidebarState: PropTypes.number.isRequired,
};
