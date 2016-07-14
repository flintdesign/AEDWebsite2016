import {
  RECEIVE_AUTOCOMPLETE
} from '../constants';

const initialState = {
  searchReady: false,
  searchData: null
};

export const search = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_AUTOCOMPLETE:
      return { ...state,
        searchReady: true,
        searchData: action.data
      };
    default:
      return state;
  }
};
