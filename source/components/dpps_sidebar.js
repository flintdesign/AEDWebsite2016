import React, { PropTypes } from 'react';
import isEmpty from 'lodash.isempty';
import ParentDPPS from './parent_dpps';

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
            rangeArea={data.RANGEAREA}
            rangePercentage={data.RANGEPERC}
            rangeAssessed={data.SURVRANGPERC}
            iqi={data.INFQLTYIDX}
            pfs={data.PFS}
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
