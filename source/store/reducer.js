import { combineReducers } from 'redux';
import { FETCH_REGION_DATA, RECEIVE_REGION_DATA } from '../actions/app_actions';

const initialState = {
  loading: false,
  regions: {},
  totalEstimate: '426032'
};

function regions(state = initialState, action) {
  const totalEstimate = (ac) => {
    if (ac.data.summary_sums) {
      return ac.data.summary_sums[0].ESTIMATE;
    } else if (ac.data.regions_sum) {
      return ac.data.regions_sum[0].DEFINITE;
    }
    return 0;
  };
  switch (action.type) {
    case RECEIVE_REGION_DATA:
      return { ...state,
        loading: false,
        regions: action.data,
        totalEstimate: totalEstimate(action)
      };
    case FETCH_REGION_DATA:
      return { ...state, loading: true };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  regionData: regions
});

export default rootReducer;
