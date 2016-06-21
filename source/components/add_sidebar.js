import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ContinentalRollup from './continental_rollup';
import ContinentalRegional from './continental_regional';
import TotalCounts from './total_counts';
import CountsBySurveyCategory from './counts_by_survey_category';

export default function ADDSidebar(props) {
  const { regions, currentTitle } = props;
  const data = type => regions[`${type}_sums`][0];

  return (
    <div>
      {!isEmpty(regions) && currentTitle === 'summary' &&
        <div>
          <ContinentalRollup
            data={regions.regions_sums[0]}
          />
          <CountsBySurveyCategory
            summary_totals={regions.summary_totals}
            areas={regions.areas}
          />
        </div>
      }

      {!isEmpty(regions) && currentTitle === 'regional' &&
        <div>
          <TotalCounts
            total={data('summary').ESTIMATE}
            confidence={data('summary').CONFIDENCE}
            guess_min={data('summary').GUESS_MIN}
            guess_max={data('summary').GUESS_MAX}
            range_covered={data('regions').PERCENT_OF_RANGE_COVERED}
            range_assessed={data('regions').PERCENT_OF_RANGE_ASSESSED}
            range_area={data('regions').RANGE_AREA}
            iqi={data('regions').IQI}
            pfs={data('regions').PFS}
          />
          <ContinentalRegional
            regions={regions.regions}
          />
        </div>
      }
    </div>
  );
}

ADDSidebar.propTypes = {
  regions: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired
};
