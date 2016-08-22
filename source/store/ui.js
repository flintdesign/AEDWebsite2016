import {
  TOGGLE_LEGEND,
  TOGGLE_RANGE
} from '../constants';

const initialState = {
  legendActive: false,
  known: true,
  doubtful: false,
  possible: true,
  protected: false
};

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LEGEND:
      return { ...state, legendActive: !state.legendActive };
    case TOGGLE_RANGE: {
      const current = state[action.rangeType];
      return {
        ...state, [action.rangeType]: !current
      };
    }
    default:
      return state;
  }
};

