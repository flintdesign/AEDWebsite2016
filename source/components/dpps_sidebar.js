import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ParentDPPS from './parent_dpps';
import AreaRange from './area_range';
import SurveyTypeDPPS from './survey_type_dpps';
import ChildDPPS from './child_dpps';

export default function DPPSSidebar(props) {
  const { regions, currentTitle } = props;
  const data = regions.regions_sum && regions.regions_sum[0];
  return (
    <div>
      {!isEmpty(regions) && currentTitle === 'summary' && data &&
        <div>
          <ParentDPPS
            definite={data.DEFINITE}
            probable={data.PROBABLE}
            possible={data.POSSIBLE}
            speculative={data.SPECUL}
          />

          <AreaRange
            rangeSurveyed={data.SURVRANGPERC}
            totalRange={data.RANGEAREA}
          />

          <SurveyTypeDPPS
            surveys={regions.area_of_range_covered_by_continent}
            tablesTitle="Counts by Survey Category"
          />
        </div>
      }

      {!isEmpty(regions) && currentTitle === 'regional' && data &&
        <div>
          <ParentDPPS
            definite={data.DEFINITE}
            probable={data.PROBABLE}
            possible={data.POSSIBLE}
            speculative={data.SPECUL}
            rangeArea={data.RANGEAREA}
            rangePercentage={data.RANGEPERC}
            rangeAssessed={data.SURVRANGPERC}
            iqi={data.INFQLTYIDX}
            pfs={data.PFS}
          />

          <ChildDPPS
            tablesTitle="Numbers by Region"
            geographies={regions.regions}
          />
        </div>
       }
    </div>
  );
}

DPPSSidebar.propTypes = {
  regions: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired
};
