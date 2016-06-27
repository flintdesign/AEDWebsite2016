import { TOGGLE_SEARCH } from '../constants';

export function toggleSearch(bool = null) {
  return ({
    type: TOGGLE_SEARCH,
    bool
  });
}
