import {
  TOGGLE_SEARCH,
  EXPAND_SIDEBAR,
  CONTRACT_SIDEBAR,
} from '../actions/app_actions';

import {
  SIDEBAR_CLOSED,
  SIDEBAR_FULL,
} from '../constants';

const initialState = {
  search: false,
  sidebarState: SIDEBAR_CLOSED,
};

export const navigation = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH:
      return { ...state,
        search: action.bool === null ? !state.search : action.bool
      };
    case EXPAND_SIDEBAR:
      return { ...state,
        sidebarState: Math.min(state.sidebarState + 1, SIDEBAR_FULL)
      };
    case CONTRACT_SIDEBAR:
      return { ...state,
        sidebarState: Math.max(state.sidebarState - 1, SIDEBAR_CLOSED)
      };
    default:
      return state;
  }
};
