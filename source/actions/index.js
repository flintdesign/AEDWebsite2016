import {
  TOGGLE_SEARCH,
  EXPAND_SIDEBAR,
  CONTRACT_SIDEBAR,
} from './app_actions';

import {
  RECEIVE_AUTOCOMPLETE
} from '../constants';

export function toggleSearch(bool = null) {
  return ({
    type: TOGGLE_SEARCH,
    bool
  });
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
