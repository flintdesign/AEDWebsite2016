import { combineReducers } from 'redux';
import { FETCH_REGION_DATA, RECEIVE_REGION_DATA } from '../actions/app_actions';

const initialState = {
  loading: false,
  regions: {},
  totalEstimate: '426032'
};

function regions(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_REGION_DATA:
      console.log(action.data);
      return Object.assign({}, state, {
        loading: false,
        regions: action.data,
        totalEstimate: action.data.summary_sums[0].ESTIMATE
      });
    case FETCH_REGION_DATA:
      return Object.assign({}, state, {
        loading: true,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  regionData: regions
});

export default rootReducer;
