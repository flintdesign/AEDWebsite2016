import { combineReducers } from 'redux';
import { FETCH_REGION_DATA } from '../actions/app_actions';

function regionData(state = {
  loading: true,
  regionData: {}
}, action) {
  switch (action.type) {
    case FETCH_REGION_DATA:
      return Object.assign({}, state, {
        loading: false,
        regionData: action.data
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  regionData
});

export default rootReducer;
