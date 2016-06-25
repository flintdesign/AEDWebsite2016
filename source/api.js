import {
  FETCH_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_DATA,
  FETCH_SUBGEOGRAPHY_DATA,
  RECEIVE_SUBGEOGRAPHY_DATA
} from './actions/app_actions';
import fetch from 'isomorphic-fetch';
import config from './config';
import { pluralize, getNextGeography } from './utils/convenience_funcs';


export function fetchGeoJSON(geoType, geoItem) {
  let geoId = geoItem.id;
  if (geoItem.iso_code) {
    geoId = geoItem.iso_code;
  }
  return fetch(`${config.apiBaseURL}/${geoType}/${geoId}/geojson_map`)
  .then(r => r.json())
  .then(d => Object.assign(d, geoItem));
}

/*
*   Fetches geoJSON data from the API and fires actions signaling the start
*   of the request and the reception of data from the API
*
*   dispatch: Must be passed in from the component
*   geoType: One of ['continent', 'region', 'country', 'inputZone', 'stratum']
*   geoId: An ID matching the `geographyType` (either a number or string)
*   subGeoType: One of ['continent', 'region', 'country', 'inputZone', 'stratum']
*/
export function fetchSubGeography(dispatch, geoType, geoId, subGeoType) {
  // Dispatch the "loading" action
  dispatch({ type: FETCH_SUBGEOGRAPHY_DATA });

  fetch(`${config.apiBaseURL}/${geoType}/${geoId}/${pluralize(subGeoType)}`)
  .then(r => r.json())
  // .then(d => d.map(c => c.id))
  .then(d => {
    let array = d;
    if (!(d instanceof Array)) {
      array = d[pluralize(subGeoType)];
    }
    return Promise.all(array.map(c => fetchGeoJSON(subGeoType, c)));
  })
  .then(data => {
    // dispatch "receive" action with response data
    dispatch({
      type: RECEIVE_SUBGEOGRAPHY_DATA,
      data: data
    });
  });
}

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

  // Dispatch async call to the API
  fetch(`${config.apiBaseURL}/${type}/${id}/${year}/${count}`)
    .then(r => r.json())
    .then(d => {
      const data = { ...d, type: type, countType: count, id: id };
      // dispatch "receive" action with response data
      dispatch({
        type: RECEIVE_GEOGRAPHY_DATA,
        data: data
      });

      const subGeoType = getNextGeography(geoType);
      fetchSubGeography(dispatch, geoType, geoId, subGeoType);
    });
}
