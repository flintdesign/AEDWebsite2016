import {
  EXPAND_SIDEBAR,
  CONTRACT_SIDEBAR,
  RECEIVE_ADJACENT_DATA,
  RECEIVE_BOUNDS,
  SELECT_STRATUM
} from './app_actions';

import {
  RECEIVE_AUTOCOMPLETE,
  TOGGLE_SEARCH,
  TOGGLE_LEGEND,
  TOGGLE_RANGE
} from '../constants';

export function toggleSearch(bool = null) {
  return ({
    type: TOGGLE_SEARCH,
    bool
  });
}

export function toggleLegend() {
  return ({ type: TOGGLE_LEGEND });
}

export function expandSidebar() {
  return ({ type: EXPAND_SIDEBAR });
}

export function contractSidebar() {
  return ({ type: CONTRACT_SIDEBAR });
}

export function receiveAutocompleteData(data) {
  return ({ type: RECEIVE_AUTOCOMPLETE, data });
}

export function toggleRange(rangeType) {
  return ({ type: TOGGLE_RANGE, rangeType });
}

export function clearAdjacentData() {
  return ({ type: RECEIVE_ADJACENT_DATA, data: [] });
}

export function updateBounds(newBounds) {
  return ({ type: RECEIVE_BOUNDS, bounds: newBounds });
}

export function selectStratum(stratumData) {
  return ({ type: SELECT_STRATUM, data: stratumData });
}
