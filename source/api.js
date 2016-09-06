import fetch from 'isomorphic-fetch';
import config from './config';
import { getCoordData } from './utils/geo_funcs';
import {
  pluralize,
  getNextGeography,
  mapSlugToId,
  flatten,
  regionById
} from './utils/convenience_funcs';

import {
  FETCH_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_DATA,
  RECEIVE_GEOGRAPHY_ERROR,
  FETCH_SUBGEOGRAPHY_DATA,
  RECEIVE_SUBGEOGRAPHY_DATA,
  RECEIVE_BOUNDS,
  FETCH_BORDER,
  RECEIVE_BORDER,
  FETCH_ADJACENT_DATA,
  RECEIVE_ADJACENT_DATA,
  FETCH_STRATUM_TREE,
  RECEIVE_STRATUM_TREE
} from './actions/app_actions';

import { FETCH_RANGE, RECEIVE_RANGE } from './constants';

import cache from 'memory-cache';

const fiveMinutes = 1000 * 60 * 5;
const cacheDuration = fiveMinutes;

/*
*   Fetches geoJSON data from the API for a single geography
*
*   geoType: One of ['region', 'country', 'stratum']
*   geoItem: The object for which we're fetching geoJSON data
*/

const getSimplifyParam = (geoType) => {
  if (geoType === 'stratum' || geoType === 'country') { return ''; }
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

  const cacheKey = `geojson-${geoType}-${geoId}`;
  const cacheResponse = cache.get(cacheKey);
  if (cacheResponse) {
    return cacheResponse;
  }

  // Fetch the geoJSON data
  return fetch(`${config.apiBaseURL}/${geoType}/${geoId}/geojson_map${getSimplifyParam(geoType)}`)
  .then(r => r.json())
  .then(d => {
    const output = {
      ...d,
      ...geoItem,
      name: geoItem[geoType] || geoItem[geoType.toUpperCase()] || geoItem.CNTRYNAME,
      id: geoItem.id || geoItem.iso_code || geoItem.strcode,
      geoType
    };
    cache.put(cacheKey, output, cacheDuration);
    return output;
  });
}

export function fetchGeoJSONById(type, id) {
  // Fetch the geoJSON data
  return fetch(`${config.apiBaseURL}/${type}/${id}/geojson_map`)
  .then(r => r.json())
  .then(d => {
    const output = {
      ...d,
      id,
      type
    };
    return output;
  });
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

function fetchBounds(dispatch, geoType, mappedId) {
  // look up in cache first
  const cacheKey = `${geoType}-${mappedId}`;
  const cacheResponse = cache.get(cacheKey);
  if (cacheResponse) {
    return dispatch({ type: RECEIVE_BOUNDS, bounds: cacheResponse });
  }
  const url = `${config.apiBaseURL}/${geoType}/${mappedId}/geojson_map?simplify=4.0`;
  // value not cached; fetching
  return fetch(url)
    .then(r => r.json())
    .then(d => {
      const coords = d.coordinates.map(flatten);
      const bounds = getCoordData(coords).bounds;
      cache.put(cacheKey, bounds, cacheDuration);
      dispatch({
        type: RECEIVE_BOUNDS,
        bounds: bounds
      });
    });
}

function fetchBorder(dispatch, geoType, mappedId) {
  // look up in cache first
  dispatch({ type: FETCH_BORDER });
  const cacheKey = `border-${geoType}-${mappedId}`;
  const cacheResponse = cache.get(cacheKey);
  if (cacheResponse) {
    return dispatch({ type: RECEIVE_BORDER, border: cacheResponse });
  }
  const url = `${config.apiBaseURL}/${geoType}/${mappedId}/geojson_map`;
  // value not cached; fetching
  return fetch(url)
  .then(r => r.json())
  .then(d => {
    cache.put(cacheKey, d, cacheDuration);
    dispatch({
      type: RECEIVE_BORDER,
      border: {
        ...d,
        geoType: geoType,
        mapId: mappedId
      }
    });
  });
}

function fetchAdjacentGeoJSON(type, item) {
  const id = item.iso_code || item.id;
  let region;
  if (type === 'country') {
    region = regionById(item.region_id).className;
  }
  return fetch(`${config.apiBaseURL}/${type}/${id}/geojson_map?simplify=0.3`)
  .then(r => r.json())
  .then(d => {
    const coords = d.coordinates.map(flatten);
    const bounds = getCoordData(coords).bounds;
    const output = {
      ...d,
      ...item,
      geoType: type,
      region,
      bounds
    };
    return output;
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

export function fetchAdjacentGeography(dispatch, parentType, parentSlug, currentType) {
  const mappedParentId = mapSlugToId(parentSlug);
  dispatch({ type: FETCH_ADJACENT_DATA });

  const cacheKey = `adjacent-${parentType}-${parentSlug}`;
  const cacheResponse = cache.get(cacheKey);
  if (cacheResponse) {
    return dispatch({ type: RECEIVE_ADJACENT_DATA, data: cacheResponse });
  }

  let url = `${config.apiBaseURL}/${parentType}/${mappedParentId}/${pluralize(currentType)}`;
  if (currentType === 'country') {
    url = `${config.apiBaseURL}/countries`;
  }

  return fetch(url)
  .then(r => r.json())
  .then(d => {
    let data = d;
    if (currentType === 'country') {
      data = data.countries.filter(item => item.is_surveyed || (item.name === 'Somalia'));
    }
    return Promise.all(data.map(c => fetchAdjacentGeoJSON(currentType, c)))
    .then(adjacentData => {
      cache.put(cacheKey, adjacentData, cacheDuration);
      dispatch({
        type: RECEIVE_ADJACENT_DATA,
        data: adjacentData
      });
    });
  });
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

  let mappedId;
  if (type === 'stratum') {
    mappedId = id;
  } else {
    mappedId = mapSlugToId(slug);
  }

  // fetch bound
  fetchBounds(dispatch, geoType, mappedId);
  fetchBorder(dispatch, geoType, mappedId);

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
      // fetch(`${config.apiBaseURL}/${type}/${mappedId}/narrative`)
      // .then(r => r.json())
      // .then(d2 => {
      //   // dispatch "receive" action with response data
      //   const narrative = d2.narrative;
      //   const dataWithNarrative = { ...data, narrative };
      //   dispatch({
      //     type: RECEIVE_GEOGRAPHY_DATA,
      //     data: dataWithNarrative
      //   });
      // });
      const cacheKey = `${mappedId}-narrative`;
      const cacheResponse = cache.get(cacheKey);
      if (cacheResponse) {
        setTimeout(() => {
          dispatch({
            type: RECEIVE_GEOGRAPHY_DATA,
            data: { ...data, narrative: cacheResponse }
          });
        }, 50);
      } else {
        // fetch the narrative data
        fetch(`${config.apiBaseURL}/${type}/${mappedId}/narrative`)
        .then(r => r.json())
        .then(d2 => {
          // dispatch "receive" action with response data
          const narrative = d2.narrative;
          cache.put(cacheKey, narrative);
          const dataWithNarrative = { ...data, narrative };
          dispatch({
            type: RECEIVE_GEOGRAPHY_DATA,
            data: dataWithNarrative
          });
        });
      }

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

export function fetchLoadGeoJSON(z, type) {
  const _id = z.id || z.strcode;
  return fetch(`${config.apiBaseURL}/${type}/${_id}/geojson_map`)
  .then(r => r.json())
  .then(r => ({ ...z, geoJSON: r }));
}

export function fetchStrata(z) {
  const url = `${config.apiBaseURL}/input_zone/${z.id}/strata`;
  return fetch(url)
  .then(r => r.json())
  .then(({ strata }) => Promise.all(strata.map(s => fetchLoadGeoJSON(s, 'stratum'))))
  .then(strata => ({ ...z, strata }));
}

export function fetchInputZones(p) {
  const url = `${config.apiBaseURL}/population/${p.id}/input_zones`;
  return fetch(url)
    .then(response => response.json())
    .then(({ input_zones }) => Promise.all(input_zones.map(z => fetchStrata(z))))
    .then(zones => Promise.all(zones.map(zone => fetchLoadGeoJSON(zone, 'input_zone'))))
    .then(zones => ({ ...p, input_zones: zones }));
}

export function fetchStratumTree(dispatch, params) {
  const countryIso = mapSlugToId(params.country);
  const url = `${config.apiBaseURL}/country/${countryIso}/populations`;
  const cacheKey = `stratum-tree-${countryIso}`;
  const cacheResponse = cache.get(cacheKey);
  dispatch({ type: FETCH_STRATUM_TREE, data: params });
  if (cacheResponse) {
    return dispatch({ type: RECEIVE_STRATUM_TREE, data: cacheResponse });
  }
  return fetch(url)
  .then(r => r.json())
  .then(({ populations }) => Promise.all(populations.map(p => fetchInputZones(p))))
  .then(populations => Promise.all(populations.map(p => fetchLoadGeoJSON(p, 'population'))))
  .then(stratumTree => {
    cache.put(cacheKey, stratumTree, cacheDuration);
    dispatch({ type: RECEIVE_STRATUM_TREE, data: stratumTree });
  });
}

export function fetchSearchData(successCallback, errorCallback = (err) => console.log(err)) {
  const url = `${config.apiBaseURL}/autocomplete`;
  fetch(url)
  .then(r => r.json())
  .then(successCallback)
  .catch(errorCallback);
}


/* Known, possible, doubtful, protected */
export const fetchRanges = (type, dispatch) => {
  const url = `${config.apiBaseURL}/${type}/geojson_map`;
  dispatch({ type: FETCH_RANGE });
  fetch(url)
  .then(r => r.json())
  .then(d =>
    dispatch({
      type: RECEIVE_RANGE,
      data: { rangeType: type, geometries: d.geometries }
    }));
};

