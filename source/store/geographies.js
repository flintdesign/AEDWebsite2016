import {
  FETCH_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_ERROR,
  FETCH_SUBGEOGRAPHY_DATA,
  RECEIVE_SUBGEOGRAPHY_DATA,
  RECEIVE_BOUNDS,
  RECEIVE_BORDER,
  FETCH_BORDER,
  FETCH_ADJACENT_DATA,
  RECEIVE_ADJACENT_DATA,
  SELECT_STRATUM
} from '../actions/app_actions';
import { getTotalEstimate } from '../utils/convenience_funcs';

const initialState = {
  error: null,
  loading: false,
  currentlyLoadingData: false,
  currentlyLoadingGeoJSON: false,
  canInput: true,
  geographies: {},
  subGeographies: [],
  totalEstimate: '426032',
  currentGeography: 'continent',
  currentGeographyId: 'africa',
  currentNarrative: null,
  border: {},
  adjacentData: [],
  selectedStratum: null
};

export function geographies(state = initialState, action) {
  let isStillLoading = true;
  switch (action.type) {
    case RECEIVE_GEOGRAPHY_DATA:
      if (!state.currentlyLoadingGeoJSON) {
        isStillLoading = false;
      }
      return { ...state,
        // having null for the error value caused it
        // to not update
        error: '',
        loading: isStillLoading,
        currentlyLoadingData: false,
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
      if (!state.currentlyLoadingData) {
        isStillLoading = false;
      }
      return { ...state,
        loading: isStillLoading,
        currentlyLoadingGeoJSON: false,
        subGeographies: action.data
      };
    case RECEIVE_BOUNDS:
      return {
        ...state,
        bounds: action.bounds
      };
    case FETCH_BORDER:
      return {
        ...state,
        border: {}
      };
    case RECEIVE_BORDER:
      return {
        ...state,
        border: action.border
      };
    case FETCH_ADJACENT_DATA:
      return {
        ...state,
        adjacentData: []
      };
    case RECEIVE_ADJACENT_DATA:
      return {
        ...state,
        adjacentData: action.data
      };
    case SELECT_STRATUM:
      return {
        ...state,
        selectedStratum: action.data
      };
    case FETCH_GEOGRAPHY_DATA:
      return {
        ...state,
        currentlyLoadingData: true,
        loading: true,
        canInput: false
      };
    case FETCH_SUBGEOGRAPHY_DATA:
      return {
        ...state,
        currentlyLoadingGeoJSON: true,
        loading: true,
        canInput: false,
        subGeographies: []
      };
    default:
      return state;
  }
}
