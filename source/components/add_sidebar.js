import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ContinentalRollup from './continental_rollup';
import ContinentalRegional from './continental_regional';
import TotalCounts from './total_counts';
import CountsBySurveyCategory from './counts_by_survey_category';

export default function ADDSidebar(props) {
  const { regions, currentTitle } = props;

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
            total={regions.summary_sums[0].ESTIMATE}
            confidence={regions.summary_sums[0].CONFIDENCE}
            guess_min={regions.summary_sums[0].GUESS_MIN}
            guess_max={regions.summary_sums[0].GUESS_MAX}
            range_covered={regions.regions_sums[0].PERCENT_OF_RANGE_COVERED}
            range_assessed={regions.regions_sums[0].PERCENT_OF_RANGE_ASSESSED}
            range_area={regions.regions_sums[0].RANGE_AREA}
            iqi={regions.regions_sums[0].IQI}
            pfs={regions.regions_sums[0].PFS}
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
