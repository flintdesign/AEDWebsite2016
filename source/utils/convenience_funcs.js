export const getNextGeography = currentGeography => {
  const geographies = ['continent', 'region', 'country', 'inputZone', 'stratum'];
  return geographies[geographies.indexOf(currentGeography) + 1];
};

export const pluralize = word => {
  const wordMapping = {
    contient: 'continents',
    region: 'regions',
    country: 'countries',
    inputZone: 'inputZones',
    stratum: 'strata'
  };
  return wordMapping[word];
};

export const capitalize = word => `${word[0].toUpperCase()}${word.split('').splice(1).join('')}`;
export const titleize = str => str.split('-').map(word => capitalize(word)).join(' ');

