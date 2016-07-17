import {
  //FETCH_KNOWN,
  RECEIVE_KNOWN,
  //FETCH_POSSIBLE,
  //RECEIVE_POSSIBLE,
  //FETCH_DOUBTFUL,
  //RECEIVE_DOUBTFUL,
  //FETCH_PROTECTED,
  //RECEIVE_PROTECTED
} from '../constants';

const initialState = {
  known: [],
  doubful: [],
  possible: [],
  protected: []
};

export const ranges = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_KNOWN:
      return { ...state,
        known: action.data
      };
    default:
      return state;
  }
};
