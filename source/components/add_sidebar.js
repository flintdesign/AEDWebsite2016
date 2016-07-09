import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import CountsBySubGeography from './counts_by_subgeography';
import CountsBySurveyCategory from './counts_by_survey_category';
import { pluralize, getNextGeography } from '../utils/convenience_funcs';

export default function ADDSidebar(props) {
  const { geographies, currentTitle, currentGeography, year, sidebarState } = props;
  const subGeography = getNextGeography(currentGeography);
  const data = type => geographies[`${type}_sums`][0];

  // TODO The API is broken on this at the country level
  const addData = geographies[`${pluralize(subGeography)}_sums`][0];


  return (
    <div>
      {!isEmpty(geographies) && currentTitle === 'summary_area' &&
        <div>
          <CountsBySurveyCategory
            summary_totals={geographies.summary_totals}
            areas={geographies.areas}
            sidebarState={sidebarState}
            totals={addData}
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
