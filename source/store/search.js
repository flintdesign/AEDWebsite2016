import {
  TOGGLE_SEARCH,
  RECEIVE_AUTOCOMPLETE
} from '../constants';

const initialState = {
  searchReady: false,
  searchData: null,
  searchActive: false,
};

export const search = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SEARCH:
      return { ...state,
        searchActive: action.bool === null ? !state.searchActive : action.bool
      };
    case RECEIVE_AUTOCOMPLETE:
      // console.log(action.data);
      return { ...state,
        searchReady: true,
        searchData: action.data
      };
    default:
      return state;
  }
};
