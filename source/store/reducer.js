import { combineReducers } from 'redux';
import { geographies } from './geographies';
import { navigation } from './navigation';
import { search } from './search';
import { ranges } from './ranges';

const rootReducer = combineReducers({
  geographyData: geographies,
  navigation,
  search,
  ranges
});

export default rootReducer;
