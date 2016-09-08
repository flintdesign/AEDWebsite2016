import {
  FETCH_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_ERROR,
  FETCH_SUBGEOGRAPHY_DATA,
  RECEIVE_SUBGEOGRAPHY_DATA,
  RECEIVE_BOUNDS,
  RECEIVE_BORDER,
  FETCH_BORDER,
  CHANGE_MAP,
  FETCH_ADJACENT_DATA,
  RECEIVE_ADJACENT_DATA,
  SELECT_STRATUM,
  FETCH_STRATUM_TREE,
  RECEIVE_STRATUM_TREE
} from '../actions/app_actions';
import { getTotalEstimate } from '../utils/convenience_funcs';

const initialState = {
  error: null,
  loading: false,
  loadingData: false,
  loadingGeoJSON: false,
  canInput: true,
  parentGeography: [],
  geographies: {},
  subGeographies: [],
  totalEstimate: '426032',
  currentGeography: 'continent',
  currentGeographyId: 'africa',
  currentNarrative: null,
  border: {},
  geoJSON: {},
  adjacentData: [],
  selectedStratum: null,
  stratumTree: null
};

export function geographies(state = initialState, action) {
  let isStillLoading = true;
  switch (action.type) {
    case FETCH_STRATUM_TREE:
      return { ...state, stratumTree: null };
    case RECEIVE_STRATUM_TREE:
      return { ...state, stratumTree: action.data };
    case RECEIVE_GEOGRAPHY_DATA:
      if (!state.loadingGeoJSON) {
        isStillLoading = false;
      }
      return { ...state,
        // having null for the error value caused it
        // to not update
        error: '',
        loading: isStillLoading,
        loadingData: false,
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
      if (!state.loadingData) {
        isStillLoading = false;
      }
      return { ...state,
        loading: isStillLoading,
        loadingGeoJSON: false,
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
        loadingData: true,
        loading: true,
        canInput: false,
        parentGeography: state.subGeographies
      };
    case FETCH_SUBGEOGRAPHY_DATA:
      return {
        ...state,
        loadingGeoJSON: true,
        loading: true,
        canInput: false
      };
    case CHANGE_MAP:
      return state;
    default:
      return state;
  }
}
