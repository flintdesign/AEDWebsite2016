import {
  TOGGLE_LEGEND,
  TOGGLE_RANGE,
  DISMISS_INTRO
} from '../constants';

const initialState = {
  legendActive: false,
  known: true,
  doubtful: true,
  possible: true,
  protected: true,
  intro: true
};

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case DISMISS_INTRO:
      return { ...state, intro: false };
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

