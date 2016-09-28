import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ParentDPPS from './parent_dpps';
import AreaRange from '../area_range';
import SurveyTypeDPPS from './survey_type_dpps';
import CauseOfChangeDPPS from './cause_of_change_dpps';
import CountsByInputZones from './../add/counts_by_input_zones';
import ChildDPPS from './child_dpps';
import { formatNumber } from '../../../utils/format_utils.js';
import { pluralize, getNextGeography } from '../../../utils/convenience_funcs';

export default function DPPSSidebar(props) {
  const {
    geographies,
    currentTitle,
    currentGeography,
    params,
    sidebarState,
    location
  } = props;
  const subGeography = getNextGeography(currentGeography);
  const data = geographies[`${pluralize(subGeography)}_sum`] &&
    geographies[`${pluralize(subGeography)}_sum`][0] || geographies.summary;
  // console.log(geographies);
  const summaryTotals = geographies[`${currentGeography}_totals`];
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
            rangeArea={data.RANGEAREA}
            rangePercentage={data.RANGEPERC}
            rangeAssessed={data.SURVRANGPERC}
            iqi={data.INFQLTYIDX}
            pfs={data.PFS}
            sidebarState={sidebarState}
          />
          {sidebarState !== 2 &&
            <div>
              <AreaRange
                totalRange={formatNumber(data.RANGEAREA)}
                assessedInKM={formatNumber(assessedInKM)}
                assessedPercent={data.SURVRANGPERC}
                unassessedInKM={formatNumber(unassessedInKM)}
                unassessedPercent={unassessedPercent}
              />
            </div>
          }
          <CauseOfChangeDPPS
            surveys={
              geographies.causes_of_change_by_continent ||
              geographies.causes_of_change_by_region ||
              geographies.causes_of_change_by_country}
            tablesTitle="Interpretation of changes from previous report"
            sidebarState={sidebarState}
          />
          <SurveyTypeDPPS
            surveys={
              geographies.area_of_range_covered_by_continent ||
              geographies.area_of_range_covered_by_region ||
              geographies.area_of_range_covered_by_country}
            surveySums={
              geographies.area_of_range_covered_sum_by_continent ||
              geographies.area_of_range_covered_sum_by_region ||
              geographies.area_of_range_covered_sum_by_country}
            summarySums={data}
            tablesTitle="Area of Range by Data Category"
            sidebarState={sidebarState}
            summaryTotals={summaryTotals}
          />
        </div>
      }

      {!isEmpty(geographies) && currentTitle === 'totals' && data &&
        <div>
          {!geographies.strata &&
            <ChildDPPS
              tablesTitle={`${
                subGeography === 'region' ? 'Regional' : subGeography} Totals and Data Quality`
              }
              geographies={geographies[pluralize(subGeography)]}
              params={params}
            />
          }
          {geographies.input_zones &&
            <CountsByInputZones
              geographies={geographies}
              inputZones={geographies.input_zones}
              sidebarState={sidebarState}
              params={params}
              location={location}
            />
          }
        </div>
       }
    </div>
  );
}

DPPSSidebar.propTypes = {
  geographies: PropTypes.object.isRequired,
  currentTitle: PropTypes.string.isRequired,
  currentGeography: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sidebarState: PropTypes.number.isRequired,
};
