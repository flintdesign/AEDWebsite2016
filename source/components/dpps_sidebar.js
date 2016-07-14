import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ParentDPPS from './parent_dpps';
import AreaRange from './area_range';
import SurveyTypeDPPS from './survey_type_dpps';
import ChildDPPS from './child_dpps';
import { formatNumber } from '../utils/format_utils.js';
import { pluralize, getNextGeography } from '../utils/convenience_funcs';

export default function DPPSSidebar(props) {
  const { geographies, currentTitle, currentGeography } = props;
  const subGeography = getNextGeography(currentGeography);
  const data = geographies[`${pluralize(subGeography)}_sum`] &&
    geographies[`${pluralize(subGeography)}_sum`][0];

  const rangeSurveyed = data.SURVRANGPERC;
  const totalRange = data.RANGEAREA;
  const assessedInKM = (rangeSurveyed / 100) * totalRange;
  const unassessedPercent = 100 - rangeSurveyed;
  const unassessedInKM = (unassessedPercent / 100) * totalRange;
  return (
    <div>
      {!isEmpty(geographies) && currentTitle === 'summary_area' && data &&
        <div>
          <ParentDPPS
            currentGeography={currentGeography}
            definite={data.DEFINITE}
            probable={data.PROBABLE}
            possible={data.POSSIBLE}
            speculative={data.SPECUL}
          />

          <AreaRange
            totalRange={formatNumber(data.RANGEAREA)}
            assessedInKM={formatNumber(assessedInKM)}
            assessedPercent={data.SURVRANGPERC}
            unassessedInKM={formatNumber(unassessedInKM)}
            unassessedPercent={unassessedPercent}
          />

          <SurveyTypeDPPS
            surveys={geographies.area_of_range_covered_by_continent}
            tablesTitle="Counts by Survey Category"
          />
        </div>
      }

      {!isEmpty(geographies) && currentTitle === 'totals' && data &&
        <div>
          <ParentDPPS
            currentGeography={currentGeography}
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
            tablesTitle={`Numbers by ${subGeography}`}
            geographies={geographies[pluralize(subGeography)]}
          />
        </div>
       }
    </div>
  );
}

DPPSSidebar.propTypes = {
  geographies: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired,
  currentGeography: PropTypes.string.isRequired
};
