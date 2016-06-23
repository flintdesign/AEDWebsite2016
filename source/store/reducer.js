import { combineReducers } from 'redux';
import { FETCH_GEOGRAPHY_DATA, RECEIVE_GEOGRAPHY_DATA } from '../actions/app_actions';
import { pluralize, getNextGeography } from '../utils/convenience_funcs';

const initialState = {
  loading: false,
  geographies: {},
  totalEstimate: '426032',
  currentGeography: 'continent',
  currentGeographyId: 2
};

function geographies(state = initialState, action) {
  const totalEstimate = (data) => {
    if (data.countType === 'add') {
      return data.summary_sums[0].ESTIMATE;
    }
    return data[`${pluralize(getNextGeography(data.type))}_sum`][0].DEFINITE;
  };
  switch (action.type) {
    case RECEIVE_GEOGRAPHY_DATA:
      return { ...state,
        loading: false,
        geographies: action.data,
        totalEstimate: totalEstimate(action.data),
        currentGeography: action.data.type,
        currentGeographyId: action.data.id
      };
    case FETCH_GEOGRAPHY_DATA:
      return { ...state, loading: true };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  geographyData: geographies
});

export default rootReducer;
