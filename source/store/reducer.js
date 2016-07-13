import { combineReducers } from 'redux';
import { geographies } from './geographies';
import { navigation } from './navigation';
import { search } from './search';

const rootReducer = combineReducers({
  geographyData: geographies,
  navigation,
  search
});

export default rootReducer;
