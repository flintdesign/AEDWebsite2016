/* eslint max-len: [0] */
import map from './slug_map';
import compact from 'lodash.compact';
import uniq from 'lodash.uniq';
import find from 'lodash.find';
import geometa from '../geometa';

export const getNextGeography = currentGeography => {
  const geographies = ['continent', 'region', 'country', 'input_zone'];
  return geographies[geographies.indexOf(currentGeography) + 1];
};

export const pluralize = word => {
  const wordMapping = {
    contient: 'continents',
    region: 'regions',
    country: 'countries',
    stratum: 'strata',
    input_zone: 'input_zones'
  };
  return wordMapping[word];
};

export const capitalize = word => `${word[0].toUpperCase()}${word.split('').splice(1).join('')}`;
// Have to call compact because the slug of some regions has two hyphens (parc-national--du-faro)
export const titleize = str => compact(str.split('-')).map(word => capitalize(word)).join(' ').replace(/%2F/g, '/');
export const slugify = str => str.toLowerCase().split(' ').join('-').replace(/\//g, '%2F');

export const titleizeStratum = (p) => {
  const titleParts = p.split('-');
  const lastPart = titleParts[titleParts.length - 1];
  return titleize(p.replace(lastPart, ''));
};

export const flatten = ary => {
  ary.reduce((a, b) => a.concat(b));
  return ary;
};

export const mapSlugToId = (slug) => map[slug];

export const regionById = (id) => geometa.regions[id];

export const replaceURLPart = (pathname, slug) => {
  const urlParts = uniq(compact(pathname.split('/')));
  const _slug = slug.replace('/', '');
  const length = urlParts.length;
  let url = `/${urlParts[0]}`;
  switch (length) {
    case 1:
      // we only have the year, so add the slug
      url += `/${_slug}`;
      break;
    case 2:
      // we have a year and a region, so keep the year and the region and add the country slug
      url += `/${urlParts[1]}/${_slug}`;
      break;
    case 3:
    case 4:
      // year, region, country; add stratum/zone
      url += `/${urlParts[1]}/${urlParts[2]}/${_slug}`;
      break;
    default:
      url = `/${urlParts[0]}`;
  }
  return url;
};


export const geoTypeFromHref = event => {
  const length = compact(event.target.options.href.split('/')).length;
  let geoType;
  switch (length) {
    case 3:
      geoType = 'country';
      break;
    case 4:
      geoType = 'stratum';
      break;
    default:
      geoType = 'region';
  }
  return geoType;
};

export const getEntityName = (location, params) => {
  const validRegions = ['eastern-africa', 'west-africa', 'southern-africa', 'central-africa'];
  if (params.region) {
    if (validRegions.indexOf(params.region) === -1) {
      return '';
    }
  }
  if (params.country) {
    if (!mapSlugToId(params.country)) {
      return '';
    }
  }
  if (location.query.input_zone) {
    return titleize(location.query.input_zone);
  }
  const parts = compact(location.pathname.split('/'));
  let title;
  switch (parts.length) {
    case 4:
      // title = titleizeStratum(params.stratum);
      title = titleize(params.input_zone);
      break;
    case 3:
      title = titleize(params.country);
      break;
    case 2:
      title = titleize(params.region);
      break;
    default:
      title = 'Africa';
  }
  return title;
};

export const getGeoFromId = (id, geographies) => {
  const stratumIdParts = id.split('-');
  const stratumId = stratumIdParts[stratumIdParts.length - 1];
  return find(geographies, s => s.strcode === stratumId);
};

export const getTotalEstimate = (data) => {
  if (data.countType === 'add') {
    // It appears that the API is returning inconsistent structures
    if (data.summary_sums === undefined) {
      return data.data.summary_sums[0].ESTIMATE;
    }
    return data.summary_sums[0].ESTIMATE;
  }
  if (data[`${pluralize(getNextGeography(data.type))}_sum`]) {
    return data[`${pluralize(getNextGeography(data.type))}_sum`][0].DEFINITE;
  }
  let finalTotal = 0;
  if (data.country_totals) {
    data.country_totals.forEach(t => {
      finalTotal += parseInt(t.DEFINITE, 10);
    });
  }
  return `${finalTotal}`;
};
