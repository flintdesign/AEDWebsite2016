import map from './slug_map';
import compact from 'lodash.compact';
import uniq from 'lodash.uniq';
import find from 'lodash.find';
import geometa from '../geometa';

export const getNextGeography = currentGeography => {
  const geographies = ['continent', 'region', 'country', 'stratum'];
  return geographies[geographies.indexOf(currentGeography) + 1];
};

export const pluralize = word => {
  const wordMapping = {
    contient: 'continents',
    region: 'regions',
    country: 'countries',
    stratum: 'strata'
  };
  return wordMapping[word];
};

export const capitalize = word => `${word[0].toUpperCase()}${word.split('').splice(1).join('')}`;
// Have to call compact because the slug of some regions has two hyphens (parc-national--du-faro)
export const titleize = str => compact(str.split('-')).map(word => capitalize(word)).join(' ');
export const slugify = str => str.toLowerCase().split(' ').join('-');

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

export const getEntityName = (location) => {
  const parts = compact(location.pathname.split('/'));
  return parts.length > 1 ? titleize(parts[parts.length - 1]) : 'Africa';
};

export const getParentRegionFromURL = (location) => {
  const parts = compact(location.pathname.split('/'));
  return parts.length === 1 ? '' : parts[1];
};

export const getGeoFromId = (id, geographies) => {
  const stratumIdParts = id.split('-');
  const stratumId = stratumIdParts[stratumIdParts.length - 1];
  return find(geographies, s => s.strcode === stratumId);
};
