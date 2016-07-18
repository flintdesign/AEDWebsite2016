import { RECEIVE_RANGE } from '../constants';

const initialState = {
  known: [],
  doubful: [],
  possible: [],
  protected: []
};

export const ranges = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_RANGE:
      return { ...state,
        [action.data.rangeType]: action.data.geometries
      };
    default:
      return state;
  }
};
