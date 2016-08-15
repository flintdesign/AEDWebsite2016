import {
  FETCH_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_ERROR,
  FETCH_SUBGEOGRAPHY_DATA,
  RECEIVE_SUBGEOGRAPHY_DATA,
  RECEIVE_BOUNDS,
  RECEIVE_BORDER,
  CHANGE_MAP,
} from '../actions/app_actions';
import { getTotalEstimate } from '../utils/convenience_funcs';

const initialState = {
  error: null,
  loading: false,
  canInput: false,
  parentGeography: [],
  geographies: {},
  subGeographies: [],
  totalEstimate: '426032',
  currentGeography: 'continent',
  currentGeographyId: 'africa',
  currentNarrative: null,
  border: {}
};
export function geographies(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_GEOGRAPHY_DATA:
      return { ...state,
        // having null for the error value caused it
        // to not update
        error: '',
        loading: false,
        geographies: action.data,
        totalEstimate: getTotalEstimate(action.data),
        currentGeography: action.data.type,
        currentGeographyId: action.data.id,
        currentNarrative: action.data.narrative,
        canInput: true
      };
    case RECEIVE_GEOGRAPHY_ERROR:
      return {
        ...state, error: action.data
      };
    case RECEIVE_SUBGEOGRAPHY_DATA:
      return { ...state,
        loading: false,
        subGeographies: action.data
      };
    case RECEIVE_BOUNDS:
      return {
        ...state, bounds: action.bounds
      };
    case RECEIVE_BORDER:
      return {
        ...state, border: action.border
      };
    case FETCH_GEOGRAPHY_DATA:
      return { ...state, loading: true, canInput: false, parentGeography: state.subGeographies };
    case FETCH_SUBGEOGRAPHY_DATA:
      return { ...state, loading: true, canInput: false };
    case CHANGE_MAP:
      return state;
    default:
      return state;
  }
}
