import { FETCH_GEOGRAPHY_DATA, RECEIVE_GEOGRAPHY_DATA } from './actions/app_actions';
import fetch from 'isomorphic-fetch';

const baseAPIUrl = 'http://staging.elephantdatabase.org/api';

/*
*   Fetches geography data from the API and fires actions signaling the start
*   of the request and the reception of data from the API
*
*   dispatch: Must be passed in from the component
*   geoType: One of ['continent', 'region', 'country', 'inputZone', 'stratum']
*   geoId: An ID matching the `geographyType` (either a number or string)
*   geoYear: A valid survey year
*   geoCount: One of ['add', 'dps']
*/
export function fetchGeography(dispatch, geoType, geoId, geoYear, geoCount) {
  // Formatting and validation
  const type = geoType.toLowerCase();
  const id = geoId.toLowerCase();
  const year = geoYear;
  const count = geoCount ? geoCount.toLowerCase() : 'add';

  // Dispatch the "loading" action
  dispatch({ type: FETCH_GEOGRAPHY_DATA, data: { countType: count } });

  // Dispatch async call to the API and dispatch "receive" action with response
  fetch(`${baseAPIUrl}/${type}/${id}/${year}/${count}`)
    .then(r => r.json())
    .then(d => {
      const data = { ...d, type: type, countType: count };
      dispatch({
        type: RECEIVE_GEOGRAPHY_DATA,
        data: data
      });
    });
}
