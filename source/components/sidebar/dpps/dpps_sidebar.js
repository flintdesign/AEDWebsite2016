import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import isEmpty from 'lodash.isempty';
import ParentDPPS from './parent_dpps';
import AreaRange from '../area_range';
import SurveyTypeDPPS from './survey_type_dpps';
import CauseOfChangeDPPS from './cause_of_change_dpps';
import CountsByInputZones from './../add/counts_by_input_zones';
import ChildDPPS from './child_dpps';
import { formatNumber } from '../../../utils/format_utils.js';
import { pluralize, getNextGeography } from '../../../utils/convenience_funcs';

const SidebarMapLink = ({ label, path }) => (
  <Link
    to={path}
    className="sidebar__map-link"
  >
    {label}
  </Link>
);
SidebarMapLink.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default function DPPSSidebar(props) {
  const {
    geographies,
    currentTitle,
    currentGeography,
    params,
    sidebarState
  } = props;
  const subGeography = getNextGeography(currentGeography);
  const data = geographies[`${pluralize(subGeography)}_sum`] &&
    geographies[`${pluralize(subGeography)}_sum`][0] || geographies.summary;

  const rangeSurveyed = data.SURVRANGPERC;
  const totalRange = data.RANGEAREA;
  const assessedInKM = (rangeSurveyed / 100) * totalRange;
  const unassessedPercent = 100 - rangeSurveyed;
  const unassessedInKM = (unassessedPercent / 100) * totalRange;
  return (
    <div>
      {!isEmpty(geographies) && currentTitle === 'totals' && data &&
        <div>
          <SurveyTypeDPPS
            surveys={
              geographies.area_of_range_covered_by_continent ||
              geographies.area_of_range_covered_by_region ||
              geographies.area_of_range_covered_by_country}
            tablesTitle="Counts by Survey Category"
          />
          <CauseOfChangeDPPS
            surveys={
              geographies.causes_of_change_by_continent ||
              geographies.causes_of_change_by_region ||
              geographies.causes_of_change_by_country}
            tablesTitle="Counts by Reasons for Change"
          />
        </div>
      }

      {!isEmpty(geographies) && currentTitle === 'summary_area' && data &&
        <div>
          {sidebarState !== 2 &&
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
              <AreaRange
                totalRange={formatNumber(data.RANGEAREA)}
                assessedInKM={formatNumber(assessedInKM)}
                assessedPercent={data.SURVRANGPERC}
                unassessedInKM={formatNumber(unassessedInKM)}
                unassessedPercent={unassessedPercent}
              />
            </div>
          }
          {!geographies.strata &&
            <ChildDPPS
              tablesTitle={`Numbers by ${subGeography}`}
              geographies={geographies[pluralize(subGeography)]}
            />
          }
          {geographies.input_zones &&
            <CountsByInputZones
              geographies={geographies}
              inputZones={geographies.input_zones}
              sidebarState={sidebarState}
              params={params}
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
  sidebarState: PropTypes.number.isRequired,
};
