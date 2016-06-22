import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ContinentalRollup from './continental_rollup';
import CountsBySubGeography from './counts_by_subgeography';
import TotalCounts from './total_counts';
import CountsBySurveyCategory from './counts_by_survey_category';
import { pluralize, getNextGeography } from '../utils/convenience_funcs';

export default function ADDSidebar(props) {
  const { geographies, currentTitle, currentGeography } = props;
  const subGeography = getNextGeography(currentGeography);
  const data = type => geographies[`${type}_sums`][0];

  return (
    <div>
      {!isEmpty(geographies) && currentTitle === 'summary' &&
        <div>
          <ContinentalRollup
            data={geographies.regions_sums[0]}
          />
          <CountsBySurveyCategory
            summary_totals={geographies.summary_totals}
            areas={geographies.areas}
          />
        </div>
      }

      {!isEmpty(geographies) && currentTitle === 'totals' &&
        <div>
          <TotalCounts
            total={data('summary').ESTIMATE}
            confidence={data('summary').CONFIDENCE}
            guess_min={data('summary').GUESS_MIN}
            guess_max={data('summary').GUESS_MAX}
            range_covered={data(pluralize(subGeography)).PERCENT_OF_RANGE_COVERED}
            range_assessed={data(pluralize(subGeography)).PERCENT_OF_RANGE_ASSESSED}
            range_area={data(pluralize(subGeography)).RANGE_AREA}
            iqi={data(pluralize(subGeography)).IQI}
            pfs={data(pluralize(subGeography)).PFS}
          />

          <CountsBySubGeography
            geographies={geographies[pluralize(subGeography)]}
            subGeography={subGeography}
          />
        </div>
      }
    </div>
  );
}

ADDSidebar.propTypes = {
  geographies: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired,
  currentGeography: PropTypes.string.isRequired
};
