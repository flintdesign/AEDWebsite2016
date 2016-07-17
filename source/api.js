import fetch from 'isomorphic-fetch';
import config from './config';
import { getCoordData } from './utils/geo_funcs';
import {
  pluralize,
  getNextGeography,
  mapSlugToId,
  flatten
} from './utils/convenience_funcs';

import {
  FETCH_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_ERROR,
  FETCH_SUBGEOGRAPHY_DATA,
  RECEIVE_SUBGEOGRAPHY_DATA,
  RECEIVE_BOUNDS,
} from './actions/app_actions';

import cache from 'memory-cache';

/*
*   Fetches geoJSON data from the API for a single geography
*
*   geoType: One of ['region', 'country', 'stratum']
*   geoItem: The object for which we're fetching geoJSON data
*/

const getSimplifyParam = (geoType) => {
  if (geoType === 'stratum') { return ''; }
  const geoMap = {
    continent: 3.0,
    region: 1.5,
    country: 0.05
  };
  return `?simplify=${geoMap[geoType]}`;
};

export function fetchGeoJSON(geoType, geoItem) {
  // Get the ID or (if the item is a country) ISO code
  const geoId = geoItem.iso_code || geoItem.id || geoItem.strcode;

  // Fetch the geoJSON data
  return fetch(`${config.apiBaseURL}/${geoType}/${geoId}/geojson_map${getSimplifyParam(geoType)}`)
  .then(r => r.json())
  .then(d => ({
    ...d,
    ...geoItem,
    name: geoItem[geoType] || geoItem[geoType.toUpperCase()],
    id: geoItem.id || geoItem.iso_code || geoItem.strcode
  }));
}

/*
*   Fetches and loads geoJSON data into the store. This is a separate method
*   because the subGeography list may be sourced either from previously-fetched
*   data or from an API call to an endpoint like `/regions/3/countries`
*
*   dispatch: Must be passed in from the component
*   data: An array of region, country, or strata entries
*   subGeoType: One of ['region', 'country', 'stratum']
*/
export function loadSubGeography(dispatch, data, subGeoType) {
  let array = data;
  // Regions come back as an array, countries as { countries: [...] }
  if (!(data instanceof Array)) {
    array = data[pluralize(subGeoType)];
  }

  // Fetch geoJSON data for each of the subGeographies
  return Promise.all(array.map(c => fetchGeoJSON(subGeoType, c)))
  .then(geoData => {
    // dispatch "receive" action with response data
    dispatch({
      type: RECEIVE_SUBGEOGRAPHY_DATA,
      data: geoData
    });
  });
}

const fiveMinutes = 1000 * 60 * 5;
const cacheDuration = fiveMinutes;

function fetchBounds(dispatch, geoType, mappedId) {
  // look up in cache first
  const cacheKey = `${geoType}-${mappedId}`;
  const cacheResponse = cache.get(cacheKey);
  if (cacheResponse) {
    return dispatch({ type: RECEIVE_BOUNDS, data: cacheResponse });
  }

  // value not cached; fetching
  return fetch(`${config.apiBaseURL}/${geoType}/${mappedId}/geojson_map`)
    .then(r => r.json())
    .then(d => {
      const coords = d.coordinates.map(flatten);
      const bounds = getCoordData(coords).bounds;
      cache.put(cacheKey, bounds, cacheDuration);
      dispatch({
        type: RECEIVE_BOUNDS,
        data: bounds
      });
    });
}


/*
*   Fetches a list of subGeographies from the API and sends that data to the
*   `loadSubGeography` for processing into the store
*
*   dispatch: Must be passed in from the component
*   geoType: One of ['continent', 'region', 'country', 'stratum']
*   geoId: An ID matching the `geographyType` (either a number or string)
*   subGeoType: One of ['region', 'country', 'stratum']
*/
export function fetchSubGeography(dispatch, geoType, geoId, subGeoType) {
  // Dispatch the "loading" action
  dispatch({ type: FETCH_SUBGEOGRAPHY_DATA });

  // Fetch a list of subGeographies
  fetch(`${config.apiBaseURL}/${geoType}/${geoId}/${pluralize(subGeoType)}`)
  .then(r => r.json())
  .then(d => loadSubGeography(dispatch, d, subGeoType));
}

/*
*   Fetches geography data from the API and fires actions signaling the start
*   of the request and the reception of data from the API
*
*   dispatch: Must be passed in from the component
*   geoType: One of ['continent', 'region', 'country', 'stratum']
*   geoId: An ID matching the `geographyType` (either a number or string)
*   geoYear: A valid survey year
*   geoCount: One of ['add', 'dps']
*/
export function fetchGeography(dispatch, geoType, slug, geoYear, geoCount) {
  // Formatting and validation
  const type = geoType.toLowerCase();
  const id = slug.toLowerCase();
  const year = geoYear;
  const count = geoCount ? geoCount.toLowerCase() : 'add';

  // Dispatch the "loading" action
  dispatch({ type: FETCH_GEOGRAPHY_DATA, data: { countType: count } });

  const mappedId = mapSlugToId(slug);

  // fetch bound
  fetchBounds(dispatch, geoType, mappedId);


  // Dispatch the "loading" action
  dispatch({ type: FETCH_GEOGRAPHY_DATA, data: { countType: count } });

  const fetchURL = `${config.apiBaseURL}/${type}/${mappedId}/${year}/${count}`;
  // Dispatch async call to the APIk
  fetch(fetchURL)
    .then(r => r.json())
    .then(d => {
      const data = {
        ...d,
        type: type,
        countType: count,
        name: d.name,
        id: id
      };

      // fetch the narrative data
      fetch(`${config.apiBaseURL}/${type}/${mappedId}/narrative`)
      .then(r => r.json())
      .then(d2 => {
        // dispatch "receive" action with response data
        dispatch({
          type: RECEIVE_GEOGRAPHY_DATA,
          data: { ...data, narrative: d2.narrative }
        });
      });


      // fetch subgeography data
      const subGeoType = getNextGeography(geoType);

      // if the returned data (d) of, say, a continent
      // contains a `regions` (pluralized subGeoType) key
      if (d[pluralize(subGeoType)]) {
        dispatch({ type: FETCH_SUBGEOGRAPHY_DATA });
        loadSubGeography(dispatch, d[pluralize(subGeoType)], subGeoType);
      } else {
        fetchSubGeography(dispatch, geoType, mappedId, subGeoType);
      }
    })
    .catch(() => {
      dispatch({
        type: RECEIVE_GEOGRAPHY_ERROR,
        data: 'No data available'
      });
    });
}

export function fetchSearchData(successCallback, errorCallback = (err) => console.log(err)) {
  const url = `${config.apiBaseURL}/autocomplete`;
  fetch(url)
  .then(r => r.json())
  .then(successCallback)
  .catch(errorCallback);
}
