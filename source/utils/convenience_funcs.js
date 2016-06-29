import map from './slug_map';

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
export const titleize = str => str.split('-').map(word => capitalize(word)).join(' ');
export const slugify = str => str.toLowerCase().split(' ').join('-');

export const flatten = ary => {
  ary.reduce((a, b) => a.concat(b));
  return ary;
};

export const mapSlugToId = (slug) => map[slug];
