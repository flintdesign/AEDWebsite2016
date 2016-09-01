import {
  EXPAND_SIDEBAR,
  CONTRACT_SIDEBAR,
  SET_SIDEBAR
} from '../actions/app_actions';

import {
  SIDEBAR_CLOSED,
  SIDEBAR_FULL,
} from '../constants';

const initialState = {
  sidebarState: SIDEBAR_CLOSED,
};

export const navigation = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIDEBAR:
      return { ...state,
        sidebarState: action.data
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
