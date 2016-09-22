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
  RECEIVE_ADJACENT_DATA
} from './actions/app_actions';

import { FETCH_RANGE, RECEIVE_RANGE } from './constants';

import cache from 'memory-cache';

const fiveMinutes = 1000 * 60 * 5;
const cacheDuration = fiveMinutes;

/*
*   Fetches geoJSON data from the API for a single geography
*
*   geoType: One of ['region', 'country', 'stratum']
*   entity: The object for which we're fetching geoJSON data
*/

const getSimplifyParam = (geoType) => {
  if (geoType === 'stratum' || geoType === 'country') { return ''; }
  const geoMap = {
    continent: 3.0,
    region: 1.5,
    country: 0.05,
    input_zone: 1.0
  };
  return `?simplify=${geoMap[geoType]}`;
};

export function fetchGeoJSON(geoType, entity) {
  // Get the ID or (if the item is a country) ISO code
  const geoId = entity.iso_code || entity.id || entity.strcode;
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
      ...entity,
      name: entity[geoType] || entity[geoType.toUpperCase()] || entity.CNTRYNAME || entity.name,
      id: entity.id || entity.iso_code || entity.strcode,
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
  })
  .catch(() => {
    dispatch({
      type: RECEIVE_GEOGRAPHY_ERROR,
      data: 'No border available'
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
  return fetch(`${config.apiBaseURL}/${type}/${id}/geojson_map`)
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

export function fetchInputZoneData(z) {
  const url = `${config.apiBaseURL}/input_zone/${z.id}/data`;
  return fetch(url)
  .then(r => r.json())
  .then(data => ({ ...z, ...data }));
}

export function fetchNarrative(data, dispatch) {
  let narrative;
  fetch(`/narratives/${data.id}.md`)
    .then(r => r.text())
    .then(r => {
      narrative = r;
      const dataWithNarrative = { ...data, narrative };
      setTimeout(() => {
        dispatch({
          type: RECEIVE_GEOGRAPHY_DATA,
          data: dataWithNarrative
        });
      }, 50);
    });
}

/*
*   Fetches geography data from the API and fires actions signaling the start
*   of the request and the reception of data from the API
*
*   dispatch: Must be passed in from the component
*   type: One of ['continent', 'region', 'country', 'stratum']
*   slug: An ID matching the `geographyType` (either a number or string)
*   year: A valid survey year
*   count: One of ['add', 'dps']
*/
export function fetchGeography(dispatch, type, slug, year, count) {
  const validYears = [2015, 2013, '2015', '2013'];
  if (validYears.indexOf(year) === -1) {
    dispatch({
      type: RECEIVE_GEOGRAPHY_ERROR,
      data: 'Invalid Year'
    });
  }
  // Formatting and validation
  const id = slug.toLowerCase();
  const _count = count ? count.toLowerCase() : 'add';
  const apiId = mapSlugToId(slug);
  let output = {
    type: type,
    countType: _count,
    name: undefined,
    id: id,
    apiId: apiId
  };

  // Dispatch the "loading" action
  dispatch({ type: FETCH_GEOGRAPHY_DATA, data: { countType: _count } });

  // fetch bound
  fetchBounds(dispatch, type, apiId);
  fetchBorder(dispatch, type, apiId);

  const fetchURL = `${config.apiBaseURL}/${type}/${apiId}/${year}/${_count}`;
  // Dispatch async call to the APIk
  fetch(fetchURL)
    .then(r => r.json())
    .then(d => {
      output = { ...d, ...output };
      if (output.input_zones) {
        const filteredInputZones = d.input_zones.filter(z => `${z.analysis_year}` === year);
        Promise.all(filteredInputZones.map(z => fetchInputZoneData(z)))
        .then(zones => {
          const zonesWithStrata = zones.map(zone => {
            const strata = d.strata.filter(s => s.inpzone.trim() === zone.name.trim());
            return { ...zone, strata };
          });
          output = { ...output, input_zones: zonesWithStrata };
          fetchNarrative(output, dispatch);
        });
      } else {
        fetchNarrative(output, dispatch);
      }

      // fetch subgeography data
      const subType = getNextGeography(type);

      // if the returned data (d) of, say, a continent
      // contains a `regions` (pluralized subType) key
      if (d[pluralize(subType)]) {
        dispatch({ type: FETCH_SUBGEOGRAPHY_DATA });
        let subGeoList = d[pluralize(subType)];
        //IF INPUT ZONES
        if (subType === 'input_zone') {
          subGeoList = d[pluralize(subType)].filter(z => `${z.analysis_year}` === year);
          const firstStratum = d.strata[0];
          subGeoList = subGeoList.map(z => (
            { ...z, region: firstStratum.region, country: firstStratum.country }
          ));
          Promise.all(subGeoList.map(z => fetchInputZoneData(z)))
          .then(zones => {
            const zonesWithStrata = zones.map(zone => {
              const strata = d.strata.filter(s => s.inpzone.trim() === zone.name.trim());
              return { ...zone, strata };
            });
            loadSubGeography(dispatch, zonesWithStrata, subType);
          });
        } else {
          loadSubGeography(dispatch, subGeoList, subType);
        }
      } else {
        fetchSubGeography(dispatch, type, apiId, subType);
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

