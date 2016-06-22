import { FETCH_REGION_DATA, RECEIVE_REGION_DATA } from './actions/app_actions';
import fetch from 'isomorphic-fetch';

const baseAPIUrl = 'http://staging.elephantdatabase.org/api';

/*
*   Fetches geography data from the API and fires actions signaling the start
*   of the request and the reception of data from the API
*
*   dispatch: Must be passed in from the component
*   geographyType: One of ['continent', 'region', 'country', 'inputZone', 'stratum']
*   geographyId: An ID matching the `geographyType` (either a number or string)
*   year: A valid survey year
*   countType: One of ['add', 'dps']
*/
export function fetchGeography(dispatch, geographyType, geographyId, year, countType = 'add') {
  dispatch({ type: FETCH_REGION_DATA });
  fetch(`${baseAPIUrl}/${geographyType}/${geographyId}/${year}/${countType.toLowerCase()}`)
    .then(r => r.json())
    .then(d => dispatch({
      type: RECEIVE_REGION_DATA,
      data: d
    }));
}
