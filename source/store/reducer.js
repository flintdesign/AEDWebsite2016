import { combineReducers } from 'redux';
import { geographies } from './geographies';
import { navigation } from './navigation';
import { search } from './search';
import { kpdp } from './kpdp';

const rootReducer = combineReducers({
  geographyData: geographies,
  navigation,
  search,
  kpdp
});

export default rootReducer;
