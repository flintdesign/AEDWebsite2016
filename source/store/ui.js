import { TOGGLE_LEGEND } from '../constants';

const initialState = {
  legendActive: false
};

export const ui = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LEGEND:
      console.log('in store');
      return { ...state, legendActive: !state.legendActive };
    default:
      return state;
  }
};

