import { combineReducers } from 'redux';
import { geographies } from './geographies';
import { navigation } from './navigation';

const rootReducer = combineReducers({
  geographyData: geographies,
  navigation
});

export default rootReducer;
