import {
  TOGGLE_SEARCH
} from '../constants';

const initialState = {
  search: false,
};

export const navigation = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH:
      return { ...state,
        search: action.bool === null ? !state.search : action.bool
      };
    default:
      return state;
  }
};
